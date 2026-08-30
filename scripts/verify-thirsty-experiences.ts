import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

for (const fileName of [".env.local", ".env"]) {
  const filePath = resolve(process.cwd(), fileName);
  if (existsSync(filePath)) {
    process.loadEnvFile(filePath);
    break;
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceRoleKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are required",
  );
}

const service = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const anon = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function count(table: string, filter?: (query: any) => any): Promise<number> {
  let query = service.from(table).select("id", { count: "exact", head: true });
  if (filter) query = filter(query);
  const { count: result, error } = await query;
  if (error) throw new Error(`${table} count failed: ${error.message}`);
  return result ?? 0;
}

async function main(): Promise<void> {
  const [comarques, locations, institutes, groupsWithLink, groupsWithoutLink] =
    await Promise.all([
      count("comarques"),
      count("locations"),
      count("institutes"),
      count("whatsapp_groups", (query) => query.not("whatsapp_url", "is", null)),
      count("whatsapp_groups", (query) => query.is("whatsapp_url", null)),
    ]);

  const publicTables = ["comarques", "locations", "institutes", "whatsapp_groups"];
  for (const table of publicTables) {
    const { error } = await anon.from(table).select("id").limit(1);
    if (error) throw new Error(`Anon SELECT failed for ${table}: ${error.message}`);
  }

  const { data: customData, error: customSelectError } = await anon
    .from("custom_group_requests")
    .select("id")
    .limit(1);
  if (!customSelectError && (customData?.length ?? 0) > 0) {
    throw new Error("Anon SELECT unexpectedly returned custom group requests");
  }

  const marker = `rls-verification-${randomUUID()}`;
  const { error: insertError } = await anon.from("custom_group_requests").insert({
    destination: "menorca",
    name: marker,
    phone: marker,
    approx_people: 1,
  });
  if (insertError) throw new Error(`Anon INSERT failed: ${insertError.message}`);

  const { error: cleanupError } = await service
    .from("custom_group_requests")
    .delete()
    .eq("name", marker)
    .eq("phone", marker);
  if (cleanupError) throw new Error(`Verification cleanup failed: ${cleanupError.message}`);

  console.log(`Comarques: ${comarques}`);
  console.log(`Locations: ${locations}`);
  console.log(`Institutes: ${institutes}`);
  console.log(`WhatsApp groups with link: ${groupsWithLink}`);
  console.log(`WhatsApp groups without link: ${groupsWithoutLink}`);
  console.log("RLS: anon SELECT allowed for selector tables");
  console.log("RLS: anon SELECT blocked for custom_group_requests");
  console.log("RLS: anon INSERT allowed for custom_group_requests");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
