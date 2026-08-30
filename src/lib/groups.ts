export type GroupRow = {
  institute_id: number | null;
  whatsapp_url: string | null;
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
  instituteId: number,
): GroupRow | null {
  return (
    rows.find((row) => row.institute_id === instituteId) ??
    rows.find((row) => row.institute_id === null) ??
    null
  );
}
