export type GroupRow = {
  institute_id: number | null;
  location_id: number | null;
  whatsapp_url: string | null;
};

export type GroupSelection = {
  instituteId?: number;
  locationId?: number;
};

export function isValidWhatsappUrl(value: string | null): value is string {
  if (!value) return false;

  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    return (
      url.protocol === "https:" &&
      ["chat.whatsapp.com", "wa.me", "api.whatsapp.com", "whatsapp.com"].includes(
        hostname,
      )
    );
  } catch {
    return false;
  }
}

export function selectBestGroup(
  rows: GroupRow[],
  selection: GroupSelection,
): GroupRow | null {
  return (
    (selection.instituteId
      ? rows.find((row) => row.institute_id === selection.instituteId)
      : undefined) ??
    (selection.locationId
      ? rows.find(
          (row) =>
            row.location_id === selection.locationId && row.institute_id === null,
        )
      : undefined) ??
    rows.find((row) => row.location_id === null && row.institute_id === null) ??
    null
  );
}
