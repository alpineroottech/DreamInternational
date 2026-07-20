import path from "node:path";
import sharp from "sharp";

/**
 * Target dimensions for each CMS image slot.
 * "cover" = crop to exact aspect ratio; "inside" = fit within bounds, preserve aspect.
 */
export const IMAGE_PURPOSES = {
  card: { width: 424, height: 274, fit: "cover", quality: 82 },
  featured: { width: 1200, height: 800, fit: "cover", quality: 85 },
  gallery: { width: 1920, height: 1280, fit: "inside", quality: 85, withoutEnlargement: true },
  cover: { width: 1200, height: 800, fit: "cover", quality: 85 },
  og: { width: 1200, height: 630, fit: "cover", quality: 85 },
  icon: { width: 256, height: 256, fit: "inside", quality: 90, withoutEnlargement: true },
  photo: { width: 400, height: 400, fit: "cover", quality: 85 },
  default: { width: 1920, height: 1920, fit: "inside", quality: 85, withoutEnlargement: true },
};

export function normalizePurpose(purpose) {
  const key = String(purpose || "")
    .toLowerCase()
    .trim();
  return Object.prototype.hasOwnProperty.call(IMAGE_PURPOSES, key) ? key : "default";
}

function outputExtension(mimetype) {
  if (mimetype === "image/png") return ".png";
  if (mimetype === "image/webp") return ".webp";
  return ".jpg";
}

/** Adjust filename extension to match processed output mime type. */
export function adjustFileNameForMime(originalname, mimetype) {
  const ext = path.extname(originalname);
  const base = ext ? path.basename(originalname, ext) : originalname;
  return `${base}${outputExtension(mimetype)}`;
}

/**
 * Resize and optimize an uploaded image for its CMS slot.
 * SVG uploads are returned unchanged.
 */
export async function processImageBuffer(buffer, mimetype, purpose) {
  if (!buffer?.length) {
    throw new Error("Empty image buffer");
  }

  if (mimetype === "image/svg+xml") {
    return { buffer, mimetype, width: null, height: null, processed: false, purpose: "default" };
  }

  const profileKey = normalizePurpose(purpose);
  const profile = IMAGE_PURPOSES[profileKey];

  let pipeline = sharp(buffer, { failOn: "none" }).rotate();
  const meta = await pipeline.metadata();
  const hasAlpha = Boolean(meta.hasAlpha);

  if (profile.fit === "cover") {
    pipeline = pipeline.resize(profile.width, profile.height, {
      fit: "cover",
      position: "centre",
    });
  } else {
    pipeline = pipeline.resize(profile.width, profile.height, {
      fit: "inside",
      withoutEnlargement: profile.withoutEnlargement !== false,
    });
  }

  let outputMimetype;
  if (hasAlpha && (profileKey === "icon" || profileKey === "default")) {
    pipeline = pipeline.png({ compressionLevel: 9, effort: 7 });
    outputMimetype = "image/png";
  } else {
    pipeline = pipeline.jpeg({ quality: profile.quality, mozjpeg: true });
    outputMimetype = "image/jpeg";
  }

  const outputBuffer = await pipeline.toBuffer();
  const outputMeta = await sharp(outputBuffer).metadata();

  return {
    buffer: outputBuffer,
    mimetype: outputMimetype,
    width: outputMeta.width ?? null,
    height: outputMeta.height ?? null,
    processed: true,
    purpose: profileKey,
  };
}
