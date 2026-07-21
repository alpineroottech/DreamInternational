/** Keys exposed by GET /api/public/settings — shared by settings route and home aggregate. */
export const PUBLIC_SETTING_KEYS = [
  "siteTitle",
  "tagline",
  "contactEmail",
  "contactPhone",
  "whatsappNumber",
  "address",
  "officeHours",
  "facebookUrl",
  "instagramUrl",
  "youtubeUrl",
  "tripadvisorUrl",
  "headerNav",
  "footerColumns",
  "footerAbout",
  "mapEmbedUrl",
  "googleMapsEmbed",
  "privacyPolicyContent",
  "termsContent",
  "cancellationPolicyContent",
  "defaultSeoTitle",
  "defaultSeoDescription",
  "defaultOgImage",
  "defaultHeroImage",
  "pageHeroes",
  "defaultHeroColor",
  "pageHeroColors",
  "pageHeroEnabled",
  "aboutSubtitle",
  "aboutTitle",
  "aboutText1",
  "aboutText2",
  "aboutFeatureOneTitle",
  "aboutFeatureOneText",
  "aboutFeatureTwoTitle",
  "aboutFeatureTwoText",
  "aboutFeatureThreeTitle",
  "aboutFeatureThreeText",
  "aboutCtaLabel",
  "aboutCtaUrl",
  "aboutImage1",
  "aboutImage2",
  "aboutImage3",
];

export function rowsToObject(rows) {
  const out = {};
  for (const r of rows) {
    let val = r.value;
    if (r.type === "json" && val != null) {
      try {
        val = JSON.parse(val);
      } catch {
        /* leave as string */
      }
    } else if (r.type === "boolean") {
      val = val === "true";
    } else if (r.type === "number") {
      val = val == null ? null : Number(val);
    }
    out[r.key] = val;
  }
  return out;
}
