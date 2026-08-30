import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import readXlsxFile from "read-excel-file/node";

const SHEET_NAME = "Seguiment Instituts";
const DEFAULT_FILE_NAME = "Localitats - Promos ThirstyExperiences.xlsx";
const REQUIRED_COLUMNS = [
  "Comarca",
  "Població",
  "Institut",
  "LINK GRUP DE WHATSAPP",
] as const;

type Warning = {
  rowNumber: number;
  location: string | null;
  institute: string | null;
  value: string | null;
  message: string;
};

type NamedRecord = { name: string; slug: string };
type LocationRecord = NamedRecord & { comarcaName: string };
type InstituteRecord = { name: string; locationKey: string };
type GroupRecord = {
  locationKey: string;
  instituteKey: string | null;
  whatsappUrl: string | null;
  sourceRow: number;
};

type ImportData = {
  comarques: Map<string, NamedRecord>;
  locations: Map<string, LocationRecord>;
  institutes: Map<string, InstituteRecord>;
  groups: Map<string, GroupRecord>;
  warnings: Warning[];
};

function trimToNull(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isCompatibleWhatsappUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      ["chat.whatsapp.com", "wa.me", "api.whatsapp.com", "whatsapp.com"].includes(
        hostname,
      )
    );
  } catch {
    return false;
  }
}

function compositeKey(...parts: string[]): string {
  return parts.join("\u0000");
}

function parseArgs(): { filePath: string; dryRun: boolean } {
  const args = process.argv.slice(2);
  let filePath = process.env.THIRSTY_EXCEL_PATH
    ? resolve(process.env.THIRSTY_EXCEL_PATH)
    : resolve(process.cwd(), DEFAULT_FILE_NAME);
  let dryRun = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--dry-run") {
      dryRun = true;
    } else if (arg === "--file") {
      const nextValue = args[index + 1];
      if (!nextValue) throw new Error("--file requires a path");
      filePath = resolve(nextValue);
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return { filePath, dryRun };
}

function loadLocalEnvironment(): void {
  for (const fileName of [".env.local", ".env"]) {
    const filePath = resolve(process.cwd(), fileName);
    if (existsSync(filePath)) {
      process.loadEnvFile(filePath);
      return;
    }
  }
}

async function readImportData(filePath: string): Promise<ImportData> {
  if (!existsSync(filePath)) {
    throw new Error(`Excel file not found: ${filePath}`);
  }

  const workbook = await readXlsxFile(filePath);
  const worksheet = workbook.find((candidate) => candidate.sheet === SHEET_NAME);
  if (!worksheet) {
    throw new Error(`Sheet not found: ${SHEET_NAME}`);
  }

  const [headerRow, ...bodyRows] = worksheet.data;
  if (!headerRow) throw new Error(`Sheet ${SHEET_NAME} is empty`);

  const headerIndexes = new Map<string, number>();
  headerRow.forEach((value, index) => {
    const header = trimToNull(value);
    if (header) headerIndexes.set(header, index);
  });

  for (const column of REQUIRED_COLUMNS) {
    if (!headerIndexes.has(column)) {
      throw new Error(`Required column not found: ${column}`);
    }
  }

  const comarques = new Map<string, NamedRecord>();
  const locations = new Map<string, LocationRecord>();
  const institutes = new Map<string, InstituteRecord>();
  const groups = new Map<string, GroupRecord>();
  const warnings: Warning[] = [];

  const columnValue = (row: unknown[], column: (typeof REQUIRED_COLUMNS)[number]) =>
    trimToNull(row[headerIndexes.get(column)!]);

  for (let index = 0; index < bodyRows.length; index += 1) {
    const row = bodyRows[index] as unknown[];
    const rowNumber = index + 2;
    if (row.every((value) => trimToNull(value) === null)) continue;

    const comarca = columnValue(row, "Comarca");
    const location = columnValue(row, "Població");
    const institute = columnValue(row, "Institut");
    const whatsappUrl = columnValue(row, "LINK GRUP DE WHATSAPP");

    if (!comarca || !location) {
      warnings.push({
        rowNumber,
        location,
        institute,
        value: whatsappUrl,
        message: "Skipped row because Comarca or Població is empty",
      });
      continue;
    }

    if (whatsappUrl && !isCompatibleWhatsappUrl(whatsappUrl)) {
      warnings.push({
        rowNumber,
        location,
        institute,
        value: whatsappUrl,
        message: "Suspicious WhatsApp URL; value will still be imported",
      });
    }

    const comarcaSlug = slugify(comarca);
    const locationSlug = slugify(location);
    if (!comarcaSlug || !locationSlug) {
      warnings.push({
        rowNumber,
        location,
        institute,
        value: null,
        message: "Skipped row because a stable slug could not be generated",
      });
      continue;
    }

    comarques.set(comarca, { name: comarca, slug: comarcaSlug });
    const locationKey = compositeKey(comarca, location);
    locations.set(locationKey, {
      comarcaName: comarca,
      name: location,
      slug: locationSlug,
    });

    const instituteKey = institute
      ? compositeKey(locationKey, institute)
      : null;
    if (institute && instituteKey) {
      institutes.set(instituteKey, { name: institute, locationKey });
    }

    const groupKey = instituteKey ?? compositeKey(locationKey, "__general__");
    const previousGroup = groups.get(groupKey);
    if (
      previousGroup &&
      previousGroup.whatsappUrl !== whatsappUrl
    ) {
      warnings.push({
        rowNumber,
        location,
        institute,
        value: whatsappUrl,
        message: `Duplicate group has a different link; row ${rowNumber} takes precedence over row ${previousGroup.sourceRow}`,
      });
    }
    groups.set(groupKey, {
      locationKey,
      instituteKey,
      whatsappUrl,
      sourceRow: rowNumber,
    });
  }

  const slugOwners = new Map<string, string>();
  for (const comarca of comarques.values()) {
    const owner = slugOwners.get(comarca.slug);
    if (owner && owner !== comarca.name) {
      throw new Error(
        `Comarca slug collision: "${owner}" and "${comarca.name}" both become "${comarca.slug}"`,
      );
    }
    slugOwners.set(comarca.slug, comarca.name);
  }

  for (const [locationKey, location] of locations) {
    const scopedSlug = compositeKey(location.comarcaName, location.slug);
    const owner = slugOwners.get(scopedSlug);
    if (owner && owner !== locationKey) {
      throw new Error(
        `Location slug collision in ${location.comarcaName}: "${owner}" and "${location.name}"`,
      );
    }
    slugOwners.set(scopedSlug, locationKey);
  }

  return { comarques, locations, institutes, groups, warnings };
}

async function upsertAndGetId(
  supabase: SupabaseClient,
  table: "comarques" | "locations" | "institutes",
  values: Record<string, unknown>,
  onConflict: string,
): Promise<number> {
  const { data, error } = await supabase
    .from(table)
    .upsert(values, { onConflict })
    .select("id")
    .single();
  if (error) throw new Error(`${table} upsert failed: ${error.message}`);
  return data.id as number;
}

async function importToSupabase(
  data: ImportData,
  supabaseUrl: string,
  serviceRoleKey: string,
): Promise<void> {
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const comarcaIds = new Map<string, number>();
  const locationIds = new Map<string, number>();
  const instituteIds = new Map<string, number>();

  for (const comarca of [...data.comarques.values()].sort((a, b) =>
    a.name.localeCompare(b.name, "ca"),
  )) {
    const id = await upsertAndGetId(
      supabase,
      "comarques",
      comarca,
      "name",
    );
    comarcaIds.set(comarca.name, id);
  }

  for (const [key, location] of [...data.locations.entries()].sort((a, b) =>
    a[1].name.localeCompare(b[1].name, "ca"),
  )) {
    const comarcaId = comarcaIds.get(location.comarcaName)!;
    const id = await upsertAndGetId(
      supabase,
      "locations",
      { comarca_id: comarcaId, name: location.name, slug: location.slug },
      "comarca_id,name",
    );
    locationIds.set(key, id);
  }

  for (const [key, institute] of [...data.institutes.entries()].sort((a, b) =>
    a[1].name.localeCompare(b[1].name, "ca"),
  )) {
    const locationId = locationIds.get(institute.locationKey)!;
    const id = await upsertAndGetId(
      supabase,
      "institutes",
      { location_id: locationId, name: institute.name },
      "location_id,name",
    );
    instituteIds.set(key, id);
  }

  for (const group of data.groups.values()) {
    const locationId = locationIds.get(group.locationKey)!;
    const instituteId = group.instituteKey
      ? instituteIds.get(group.instituteKey)!
      : null;
    let query = supabase
      .from("whatsapp_groups")
      .select("id")
      .eq("location_id", locationId);
    query = instituteId
      ? query.eq("institute_id", instituteId)
      : query.is("institute_id", null);
    const { data: existing, error: selectError } = await query.maybeSingle();
    if (selectError) {
      throw new Error(`whatsapp_groups lookup failed: ${selectError.message}`);
    }

    if (existing) {
      const { error } = await supabase
        .from("whatsapp_groups")
        .update({ whatsapp_url: group.whatsappUrl })
        .eq("id", existing.id);
      if (error) throw new Error(`whatsapp_groups update failed: ${error.message}`);
    } else {
      const { error } = await supabase.from("whatsapp_groups").insert({
        location_id: locationId,
        institute_id: instituteId,
        whatsapp_url: group.whatsappUrl,
      });
      if (error) throw new Error(`whatsapp_groups insert failed: ${error.message}`);
    }
  }
}

function printSummary(data: ImportData, dryRun: boolean): void {
  const groups = [...data.groups.values()];
  const withLink = groups.filter((group) => group.whatsappUrl !== null).length;
  const withoutLink = groups.length - withLink;
  console.log(dryRun ? "Dry run complete; no database writes." : "Import complete.");
  console.log(`Comarques: ${data.comarques.size}`);
  console.log(`Locations: ${data.locations.size}`);
  console.log(`Institutes: ${data.institutes.size}`);
  console.log(`WhatsApp groups with link: ${withLink}`);
  console.log(`WhatsApp groups without link: ${withoutLink}`);
  console.log(`Warnings: ${data.warnings.length}`);
  for (const warning of data.warnings) {
    console.warn(
      `[row ${warning.rowNumber}] location=${warning.location ?? "NULL"} institute=${warning.institute ?? "NULL"} value=${warning.value ?? "NULL"}: ${warning.message}`,
    );
  }
}

async function main(): Promise<void> {
  loadLocalEnvironment();
  const { filePath, dryRun } = parseArgs();
  const data = await readImportData(filePath);

  if (!dryRun) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error(
        "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required unless --dry-run is used",
      );
    }
    await importToSupabase(data, supabaseUrl, serviceRoleKey);
  }

  printSummary(data, dryRun);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
