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

router.get("/", async (_req, res) => {
  const items = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
  res.json(items);
});

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const { isServerless, useRemoteStorage } = storageMode();

  try {
    let url;
    let fileName = req.file.originalname;
    let publicId = null;

    if (useRemoteStorage) {
      const result = await uploadImageToSupabase(req.file.buffer, req.file.originalname, req.file.mimetype);
      url = result.url;
      publicId = result.publicId;
      fileName = path.basename(result.publicId);
    } else if (isServerless) {
      return res.status(503).json({
        error:
          "Image uploads require Supabase Storage on Netlify. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_STORAGE_BUCKET in environment variables.",
      });
    } else {
      if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      const ext = path.extname(req.file.originalname);
      const base = path
        .basename(req.file.originalname, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 40);
      const diskName = `${Date.now()}-${base || "image"}${ext}`;
      fs.writeFileSync(path.join(UPLOAD_DIR, diskName), req.file.buffer);
      url = `/uploads/${diskName}`;
      fileName = diskName;
    }

    const asset = await prisma.mediaAsset.create({
      data: {
        url,
        publicId,
        fileName,
        mimeType: req.file.mimetype,
        altText: req.body.altText || null,
      },
    });
    res.status(201).json(asset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Upload failed" });
  }
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
