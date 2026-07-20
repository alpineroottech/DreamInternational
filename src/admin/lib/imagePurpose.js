/** Map CMS field names to server image-processing purposes. */
const FIELD_PURPOSE_MAP = {
  cardImageUrl: "card",
  featuredImageUrl: "featured",
  heroImageUrl: "featured",
  coverImageUrl: "cover",
  ogImageUrl: "og",
  iconUrl: "icon",
  logoUrl: "icon",
  photoUrl: "photo",
  reviewerPhoto: "photo",
  imageUrl: "featured",
};

export function purposeForFieldName(fieldName) {
  if (!fieldName) return "default";
  return FIELD_PURPOSE_MAP[fieldName] || "default";
}
