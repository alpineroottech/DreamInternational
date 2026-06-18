import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { v2 as cloudinary } from "cloudinary";
import prisma from "../lib/prisma.js";
import { verifyJwt, requireRole } from "../middleware/auth.js";
import { isServerlessHost } from "../lib/runtime.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.resolve(__dirname, "../../uploads");
const isServerless = isServerlessHost();

const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

if (!isServerless) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const diskStorage = multer.diskStorage({
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

const memoryStorage = multer.memoryStorage();

const upload = multer({
  storage: isServerless || cloudinaryConfigured ? memoryStorage : diskStorage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only image uploads are allowed"));
  },
});

function uploadToCloudinary(buffer, originalname) {
  const ext = path.extname(originalname).replace(".", "") || "jpg";
  const folder = process.env.CLOUDINARY_FOLDER || "dream-international";
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image", format: ext },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

function cloudinaryPublicIdFromUrl(url) {
  if (!url || !url.includes("res.cloudinary.com")) return null;
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;
  const path = parts[1].replace(/^v\d+\//, "");
  return path.replace(/\.[^/.]+$/, "");
}

const router = Router();
router.use(verifyJwt, requireRole("SUPER_ADMIN", "ADMIN"));

router.get("/", async (_req, res) => {
  const items = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
  res.json(items);
});

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    let url;
    let fileName = req.file.originalname;

    if (isServerless || cloudinaryConfigured) {
      if (!cloudinaryConfigured) {
        return res.status(503).json({
          error:
            "Image uploads require Cloudinary on Netlify. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your site environment variables.",
        });
      }
      const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
      url = result.secure_url;
      fileName = result.public_id?.split("/").pop() || req.file.originalname;
    } else {
      url = `/uploads/${req.file.filename}`;
    }

    const asset = await prisma.mediaAsset.create({
      data: {
        url,
        fileName,
        mimeType: req.file.mimetype,
        altText: req.body.altText || null,
      },
    });
    res.status(201).json(asset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

router.delete("/:id", async (req, res) => {
  const asset = await prisma.mediaAsset.findUnique({ where: { id: req.params.id } });
  if (!asset) return res.status(404).json({ error: "Asset not found" });

  if (asset.url?.startsWith("/uploads/") && !isServerless) {
    const fp = path.join(UPLOAD_DIR, path.basename(asset.url));
    fs.promises.unlink(fp).catch(() => {});
  }

  if (cloudinaryConfigured && asset.url?.includes("res.cloudinary.com")) {
    const publicId = cloudinaryPublicIdFromUrl(asset.url);
    if (publicId) {
      cloudinary.uploader.destroy(publicId, { resource_type: "image" }).catch(() => {});
    }
  }

  await prisma.mediaAsset.delete({ where: { id: asset.id } });
  res.json({ ok: true });
});

export default router;
