export type CloudinaryPhoto = {
  public_id: string;
  secure_url: string;
  width: number | null;
  height: number | null;
  format: string;
  created_at?: string;
};

type CloudinaryResource = Omit<CloudinaryPhoto, "secure_url"> & { secure_url?: string; resource_type?: string };

export async function getCloudinaryFolder(folder: string): Promise<CloudinaryPhoto[]> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Missing Cloudinary environment variables");

  const escapedFolder = folder.replaceAll('"', '\\"');
  const expressions = [
    `asset_folder="${escapedFolder}" AND resource_type:image`,
    `folder="${escapedFolder}" AND resource_type:image`,
  ];
  let resources: CloudinaryResource[] = [];
  for (const expression of expressions) {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/search`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expression, max_results: 500, sort_by: [{ created_at: "desc" }, { public_id: "asc" }] }),
      next: { revalidate: 60 },
    });
    if (!response.ok) throw new Error(`Cloudinary request failed (${response.status})`);
    const payload = (await response.json()) as { resources?: CloudinaryResource[] };
    resources = payload.resources ?? [];
    if (resources.length > 0) break;
  }
  return resources.map((photo) => ({
    public_id: photo.public_id,
    secure_url: photo.secure_url ?? cloudinaryUrl(photo.public_id, photo.format),
    width: Number.isFinite(photo.width) ? photo.width : null,
    height: Number.isFinite(photo.height) ? photo.height : null,
    format: photo.format,
    created_at: photo.created_at,
  }));
}

export function cloudinaryUrl(publicId: string, format?: string, transform = "f_auto,q_auto") {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) throw new Error("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${publicId}${format ? `.${format}` : ""}`;
}

export function cloudinaryDownloadUrl(photo: CloudinaryPhoto) {
  return cloudinaryUrl(photo.public_id, photo.format, "fl_attachment,q_auto");
}
