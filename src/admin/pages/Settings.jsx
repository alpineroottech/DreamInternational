import React, { useEffect, useState } from "react";
import api from "../api/client";
import { MediaInput } from "../components/MediaPicker";
import { DEFAULT_HERO_COLOR, DEFAULT_PAGE_HERO_COLORS } from "../../brand/heroColors";

const FIELDS = [
  {
    group: "General",
    items: [
      { key: "siteTitle", label: "Site title" },
      { key: "tagline", label: "Tagline" },
      { key: "address", label: "Address" },
    ],
  },
  {
    group: "Contact",
    items: [
      { key: "contactEmail", label: "Contact email" },
      { key: "contactPhone", label: "Contact phone" },
      { key: "whatsappNumber", label: "WhatsApp number" },
    ],
  },
  {
    group: "Social",
    items: [
      { key: "facebookUrl", label: "Facebook URL" },
      { key: "instagramUrl", label: "Instagram URL" },
      { key: "youtubeUrl", label: "YouTube URL" },
      { key: "tripadvisorUrl", label: "TripAdvisor URL" },
    ],
  },
  {
    group: "SEO defaults",
    items: [
      { key: "defaultSeoTitle", label: "Default SEO title template" },
      { key: "defaultSeoDescription", label: "Default meta description" },
      { key: "defaultOgImage", label: "Default OG image URL", type: "image" },
    ],
  },
  {
    group: "Footer & map",
    description: "Used by the site footer, header top bar, and the Contact page map embed.",
    items: [
      { key: "officeHours", label: "Office hours (e.g. Sun to Fri: 8:00 am - 7:00 pm)" },
      { key: "footerAbout", label: "Footer about text", type: "textarea" },
      { key: "mapEmbedUrl", label: "Google Maps embed URL (src of the embed iframe)", type: "textarea" },
    ],
  },
  {
    group: "Legal pages",
    description: "Content shown on /privacy-policy, /terms-and-conditions, and /cancellation-policy. HTML is supported.",
    items: [
      { key: "privacyPolicyContent", label: "Privacy policy content (HTML)", type: "textarea" },
      { key: "termsContent", label: "Terms & conditions content (HTML)", type: "textarea" },
      { key: "cancellationPolicyContent", label: "Cancellation policy content (HTML)", type: "textarea" },
    ],
  },
  {
    group: "About page content",
    description:
      "Controls the dedicated /about page. For the homepage about collage, use Homepage Builder → About Section.",
    items: [
      { key: "aboutSubtitle", label: "About subtitle" },
      { key: "aboutTitle", label: "About title" },
      { key: "aboutText1", label: "About paragraph 1" },
      { key: "aboutText2", label: "About paragraph 2" },
      { key: "aboutFeatureOneTitle", label: "Feature 1 title" },
      { key: "aboutFeatureOneText", label: "Feature 1 text" },
      { key: "aboutFeatureTwoTitle", label: "Feature 2 title" },
      { key: "aboutFeatureTwoText", label: "Feature 2 text" },
      { key: "aboutFeatureThreeTitle", label: "Feature 3 title" },
      { key: "aboutFeatureThreeText", label: "Feature 3 text" },
      { key: "aboutCtaLabel", label: "About CTA label" },
      { key: "aboutCtaUrl", label: "About CTA URL" },
      { key: "aboutImage1", label: "Image 1 (large, back)", type: "image" },
      { key: "aboutImage2", label: "Image 2 (middle)", type: "image" },
      { key: "aboutImage3", label: "Image 3 (small, floating)", type: "image" },
    ],
  },
];

/** Keys used by <Breadcrumb pageKey="…" /> across the public site. */
export const PAGE_HERO_FIELDS = [
  { key: "about", label: "About" },
  { key: "tours", label: "Nepal Experiences listing" },
  { key: "tour-details", label: "Nepal Experience details (fallback)" },
  { key: "international-holidays", label: "International Holidays listing" },
  { key: "destinations", label: "Destinations listing (legacy)" },
  { key: "destination-details", label: "Destination details (fallback, legacy)" },
  { key: "activities", label: "Activities listing" },
  { key: "activity-details", label: "Activity details (fallback)" },
  { key: "services", label: "Services listing" },
  { key: "service-details", label: "Service details (fallback)" },
  { key: "blog", label: "Blog listing" },
  { key: "blog-details", label: "Blog post (fallback)" },
  { key: "contact", label: "Contact" },
  { key: "faq", label: "FAQ" },
  { key: "gallery", label: "Gallery" },
  { key: "pricing", label: "Pricing" },
  { key: "tour-guide", label: "Tour guides" },
  { key: "tour-guide-details", label: "Tour guide details (fallback)" },
  { key: "resort", label: "Resorts listing" },
  { key: "resort-details", label: "Resort details (fallback)" },
  { key: "shop", label: "Shop" },
  { key: "shop-details", label: "Shop details (fallback)" },
  { key: "cart", label: "Cart" },
  { key: "checkout", label: "Checkout" },
  { key: "wishlist", label: "Wishlist" },
  { key: "error", label: "404 / Error" },
  { key: "ticketing-domestic", label: "Domestic ticketing (fallback)" },
  { key: "ticketing-international", label: "International ticketing (fallback)" },
  { key: "ticketing-route", label: "Flight route details (fallback)" },
];

export default function Settings() {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/admin/settings");
        setValues(data || {});
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const set = (key, value) => setValues((v) => ({ ...v, [key]: value }));

  const pageHeroColors =
    values.pageHeroColors && typeof values.pageHeroColors === "object" && !Array.isArray(values.pageHeroColors)
      ? values.pageHeroColors
      : {};

  const setPageHeroColor = (key, color) => {
    set("pageHeroColors", { ...pageHeroColors, [key]: color || "" });
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const { data } = await api.put("/admin/settings", values);
      setValues(data);
      setMessage("Settings saved. Refresh the public site to see hero color changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-muted">Loading…</div>;

  return (
    <form onSubmit={save}>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1">Settings</h4>
          <p className="text-muted mb-0">Site-wide information used across the public website.</p>
        </div>
        <button type="submit" className="btn di-btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>

      {message && <div className="alert alert-success py-2">{message}</div>}

      <div className="row g-3">
        {FIELDS.map((group) => (
          <div className="col-md-6" key={group.group}>
            <div className="di-card p-4 h-100">
              <h6 className="fw-bold mb-3">{group.group}</h6>
              {group.description && (
                <p className="text-muted small mb-3">{group.description}</p>
              )}
              {group.items.map((f) => (
                <div className="mb-3" key={f.key}>
                  <label className="form-label small fw-semibold">{f.label}</label>
                  {f.type === "image" ? (
                    <MediaInput value={values[f.key] || ""} onChange={(url) => set(f.key, url)} />
                  ) : f.type === "textarea" ? (
                    <textarea
                      className="form-control"
                      rows={4}
                      value={values[f.key] || ""}
                      onChange={(e) => set(f.key, e.target.value)}
                    />
                  ) : (
                    <input
                      className="form-control"
                      value={values[f.key] || ""}
                      onChange={(e) => set(f.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="di-card p-4 mt-4">
        <h6 className="fw-bold mb-1">Page hero banner colors</h6>
        <p className="text-muted small mb-3">
          Solid background color for each page&apos;s top banner. Tour, destination, and activity
          <strong> card images</strong> are separate — they are not stretched into these banners.
        </p>

        <div className="mb-4">
          <label className="form-label small fw-semibold">Default banner color</label>
          <HeroColorInput
            value={values.defaultHeroColor || DEFAULT_HERO_COLOR}
            onChange={(color) => set("defaultHeroColor", color)}
            fallback={DEFAULT_HERO_COLOR}
          />
        </div>

        <div className="row g-3">
          {PAGE_HERO_FIELDS.map((f) => (
            <div className="col-md-6 col-xl-4" key={f.key}>
              <label className="form-label small fw-semibold">{f.label}</label>
              <HeroColorInput
                value={pageHeroColors[f.key] || DEFAULT_PAGE_HERO_COLORS[f.key] || DEFAULT_HERO_COLOR}
                onChange={(color) => setPageHeroColor(f.key, color)}
                fallback={DEFAULT_PAGE_HERO_COLORS[f.key] || DEFAULT_HERO_COLOR}
              />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}

function HeroColorInput({ value, onChange, fallback }) {
  const color = value || fallback;
  return (
    <div className="d-flex align-items-center gap-2">
      <input
        type="color"
        className="form-control form-control-color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        title="Pick banner color"
        style={{ width: 48, height: 38, padding: 2 }}
      />
      <input
        type="text"
        className="form-control form-control-sm font-monospace"
        value={color}
        onChange={(e) => {
          const next = e.target.value.trim();
          if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(next)) onChange(next);
        }}
        placeholder={fallback}
        maxLength={7}
      />
      <span
        className="rounded border flex-shrink-0"
        style={{ width: 38, height: 38, background: color }}
        aria-hidden
      />
    </div>
  );
}
