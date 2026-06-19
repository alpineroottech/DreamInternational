import api from "../api/client";

/** Upload a single image file to the media library. */
export async function uploadMediaFile(file) {
  const fd = new FormData();
  fd.append("file", file);
  const { data } = await api.post("/admin/media/upload", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

const MAX_BULK_FILES = 30;
const DEFAULT_CONCURRENCY = 3;

/**
 * Upload multiple images with limited concurrency.
 * Returns { succeeded, failed } — failed items include fileName + error.
 */
export async function uploadMediaFiles(files, { concurrency = DEFAULT_CONCURRENCY, onProgress } = {}) {
  const list = Array.from(files || []).filter((f) => f && /^image\//.test(f.type));
  if (list.length > MAX_BULK_FILES) {
    throw new Error(`You can upload up to ${MAX_BULK_FILES} images at once.`);
  }

  const succeeded = [];
  const failed = [];
  const queue = [...list];
  const total = list.length;
  let done = 0;

  async function worker() {
    while (queue.length) {
      const file = queue.shift();
      try {
        const asset = await uploadMediaFile(file);
        succeeded.push(asset);
      } catch (err) {
        failed.push({
          fileName: file.name,
          error: err?.response?.data?.error || err.message || "Upload failed",
        });
      }
      done += 1;
      onProgress?.({ done, total, fileName: file.name });
    }
  }

  const workers = Math.min(concurrency, total || 1);
  await Promise.all(Array.from({ length: workers }, () => worker()));

  return { succeeded, failed, total };
}
