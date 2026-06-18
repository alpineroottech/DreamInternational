import path from "node:path";
import { createClient } from "@supabase/supabase-js";

let client;

export function isSupabaseConfigured() {
  return Boolean(
    process.env.SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.SUPABASE_STORAGE_BUCKET
  );
}

function getSupabase() {
  if (!client) {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase storage is not configured");
    }
    client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
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

  const supabase = getSupabase();
  const { error } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
    contentType: mimetype,
    upsert: false,
    cacheControl: "3600",
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  return { url: data.publicUrl, publicId: objectPath };
}

/** Remove an object from Supabase Storage by its object path. */
export async function deleteImageFromSupabase(objectPath) {
  if (!objectPath) return;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;
  const supabase = getSupabase();
  const { error } = await supabase.storage.from(bucket).remove([objectPath]);
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
