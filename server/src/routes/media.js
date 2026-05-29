import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import prisma from "../lib/prisma.js";
import { verifyJwt, requireRole } from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.resolve(__dirname, "../../uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Local disk storage for dev. Swap for Cloudinary in production (signed upload).
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 40);
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const upload = multer({
  storage,
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
  const url = `/uploads/${req.file.filename}`;
  const asset = await prisma.mediaAsset.create({
    data: {
      url,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      altText: req.body.altText || null,
    },
  });
  res.status(201).json(asset);
});

router.delete("/:id", async (req, res) => {
  const asset = await prisma.mediaAsset.findUnique({ where: { id: req.params.id } });
  if (!asset) return res.status(404).json({ error: "Asset not found" });
  // Best-effort local file removal.
  if (asset.url?.startsWith("/uploads/")) {
    const fp = path.join(UPLOAD_DIR, path.basename(asset.url));
    fs.promises.unlink(fp).catch(() => {});
  }
  await prisma.mediaAsset.delete({ where: { id: asset.id } });
  res.json({ ok: true });
});

export default router;
