export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Ensure a slug is unique within a model by appending -2, -3, ... if needed.
export async function uniqueSlug(model, base, currentId = null) {
  const root = slugify(base) || "item";
  let candidate = root;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await model.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === currentId) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}
