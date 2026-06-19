import path from "node:path";
import { StorageClient } from "@supabase/storage-js";

let storage;

export function isSupabaseConfigured() {
  return Boolean(
    process.env.SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.SUPABASE_STORAGE_BUCKET
  );
}

function getStorage() {
  if (!storage) {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase storage is not configured");
    }
    const url = process.env.SUPABASE_URL.replace(/\/$/, "");
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    storage = new StorageClient(`${url}/storage/v1`, {
      apikey: key,
      Authorization: `Bearer ${key}`,
    });
  }
  return storage;
}

function safeFileName(originalname) {
  const ext = path.extname(originalname).toLowerCase() || ".jpg";
  const base = path
    .basename(originalname, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);
  return `${Date.now()}-${base || "image"}${ext}`;
}

/**
 * Upload an image buffer to Supabase Storage.
 * Returns public URL and storage object path (stored as publicId for deletes).
 */
export async function uploadImageToSupabase(buffer, originalname, mimetype) {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;
  const folder = (process.env.SUPABASE_STORAGE_FOLDER || "uploads").replace(/^\/|\/$/g, "");
  const fileName = safeFileName(originalname);
  const objectPath = folder ? `${folder}/${fileName}` : fileName;

  const client = getStorage();
  const { error } = await client.from(bucket).upload(objectPath, buffer, {
    contentType: mimetype,
    upsert: false,
    cacheControl: "3600",
  });

  if (error) throw error;

  const { data } = client.from(bucket).getPublicUrl(objectPath);
  return { url: data.publicUrl, publicId: objectPath };
}

/** Remove an object from Supabase Storage by its object path. */
export async function deleteImageFromSupabase(objectPath) {
  if (!objectPath) return;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;
  const { error } = await getStorage().from(bucket).remove([objectPath]);
  if (error) throw error;
}

/** Extract storage object path from a Supabase public URL, if possible. */
export function objectPathFromSupabaseUrl(url) {
  if (!url || !url.includes("/storage/v1/object/public/")) return null;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;
  const marker = `/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}
