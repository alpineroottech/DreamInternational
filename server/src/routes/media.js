import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import prisma from "../lib/prisma.js";
import { verifyJwt, requireRole } from "../middleware/auth.js";
import { isServerlessHost, moduleDir } from "../lib/runtime.js";
import {
  deleteImageFromSupabase,
  isSupabaseConfigured,
  objectPathFromSupabaseUrl,
  uploadImageToSupabase,
} from "../lib/supabaseStorage.js";

const __dirname = moduleDir(import.meta.url, "server/src/routes");
const UPLOAD_DIR = path.resolve(__dirname, "../../uploads");
const MAX_BULK_FILES = 30;

function storageMode() {
  return {
    isServerless: isServerlessHost(),
    useRemoteStorage: isSupabaseConfigured(),
  };
}

if (!isServerlessHost() && !isSupabaseConfigured()) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only image uploads are allowed"));
  },
});

const router = Router();
router.use(verifyJwt, requireRole("SUPER_ADMIN", "ADMIN"));

// Multer errors (file too large, wrong type)
function handleUploadError(err, req, res, next) {
  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "Each image must be 8 MB or smaller." });
  }
  if (err?.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({ error: `You can upload up to ${MAX_BULK_FILES} images at once.` });
  }
  if (err?.message === "Only image uploads are allowed") {
    return res.status(400).json({ error: err.message });
  }
  return next(err);
}

router.get("/", async (_req, res) => {
  const items = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
  res.json(items);
});

async function saveUploadedFile(file, altText) {
  const { isServerless, useRemoteStorage } = storageMode();

  let url;
  let fileName = file.originalname;
  let publicId = null;

  if (useRemoteStorage) {
    const result = await uploadImageToSupabase(file.buffer, file.originalname, file.mimetype);
    url = result.url;
    publicId = result.publicId;
    fileName = path.basename(result.publicId);
  } else if (isServerless) {
    const err = new Error(
      "Image uploads require Supabase Storage on Netlify. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_STORAGE_BUCKET in environment variables."
    );
    err.status = 503;
    throw err;
  } else {
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 40);
    const diskName = `${Date.now()}-${base || "image"}${ext}`;
    fs.writeFileSync(path.join(UPLOAD_DIR, diskName), file.buffer);
    url = `/uploads/${diskName}`;
    fileName = diskName;
  }

  return prisma.mediaAsset.create({
    data: {
      url,
      publicId,
      fileName,
      mimeType: file.mimetype,
      altText: altText || null,
    },
  });
}

router.post("/upload", (req, res, next) => {
  upload.single("file")(req, res, async (err) => {
    if (err) return handleUploadError(err, req, res, next);
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    try {
      const asset = await saveUploadedFile(req.file, req.body.altText);
      res.status(201).json(asset);
    } catch (e) {
      console.error(e);
      res.status(e.status || 500).json({ error: e.message || "Upload failed" });
    }
  });
});

router.post("/upload-bulk", (req, res, next) => {
  upload.array("files", MAX_BULK_FILES)(req, res, async (err) => {
    if (err) return handleUploadError(err, req, res, next);
    const files = req.files || [];
    if (!files.length) return res.status(400).json({ error: "No files uploaded" });

    const succeeded = [];
    const failed = [];

    for (const file of files) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const asset = await saveUploadedFile(file, req.body.altText);
        succeeded.push(asset);
      } catch (e) {
        failed.push({ fileName: file.originalname, error: e.message || "Upload failed" });
      }
    }

    res.status(failed.length && !succeeded.length ? 500 : 201).json({
      succeeded,
      failed,
      total: files.length,
    });
  });
});

router.delete("/:id", async (req, res) => {
  const asset = await prisma.mediaAsset.findUnique({ where: { id: req.params.id } });
  if (!asset) return res.status(404).json({ error: "Asset not found" });

  const { isServerless, useRemoteStorage } = storageMode();

  if (asset.publicId && useRemoteStorage) {
    try {
      await deleteImageFromSupabase(asset.publicId);
    } catch (err) {
      console.error("Supabase delete failed:", err);
    }
  } else if (asset.url?.startsWith("/uploads/") && !isServerless) {
    const fp = path.join(UPLOAD_DIR, path.basename(asset.url));
    fs.promises.unlink(fp).catch(() => {});
  } else if (useRemoteStorage && asset.url) {
    const objectPath = objectPathFromSupabaseUrl(asset.url);
    if (objectPath) {
      deleteImageFromSupabase(objectPath).catch((err) => console.error("Supabase delete failed:", err));
    }
  }

  await prisma.mediaAsset.delete({ where: { id: asset.id } });
  res.json({ ok: true });
});

export default router;
