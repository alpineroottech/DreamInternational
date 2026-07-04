import React, { useEffect, useState } from "react";
import api from "../api/client";
import { MediaInput } from "../components/MediaPicker";

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
];

/** Keys used by <Breadcrumb pageKey="…" /> across the public site. */
export const PAGE_HERO_FIELDS = [
  { key: "about", label: "About" },
  { key: "tours", label: "Tours listing" },
  { key: "tour-details", label: "Tour details (fallback)" },
  { key: "destinations", label: "Destinations listing" },
  { key: "destination-details", label: "Destination details (fallback)" },
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

  const pageHeroes =
    values.pageHeroes && typeof values.pageHeroes === "object" && !Array.isArray(values.pageHeroes)
      ? values.pageHeroes
      : {};

  const setPageHero = (key, url) => {
    set("pageHeroes", { ...pageHeroes, [key]: url || "" });
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const { data } = await api.put("/admin/settings", values);
      setValues(data);
      setMessage("Settings saved. Refresh the public site to see hero image changes.");
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
              {group.items.map((f) => (
                <div className="mb-3" key={f.key}>
                  <label className="form-label small fw-semibold">{f.label}</label>
                  {f.type === "image" ? (
                    <MediaInput value={values[f.key] || ""} onChange={(url) => set(f.key, url)} />
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
        <h6 className="fw-bold mb-1">Page hero banners</h6>
        <p className="text-muted small mb-3">
          Background image for each page&apos;s top banner. Detail pages (tour, destination, blog, etc.)
          use the item&apos;s own image when set; the values below are fallbacks for those pages and the
          primary image for listing pages.
        </p>

        <div className="mb-4">
          <label className="form-label small fw-semibold">Default hero (all pages without a specific image)</label>
          <MediaInput
            value={values.defaultHeroImage || ""}
            onChange={(url) => set("defaultHeroImage", url)}
            placeholder="Site-wide fallback hero image"
          />
        </div>

        <div className="row g-3">
          {PAGE_HERO_FIELDS.map((f) => (
            <div className="col-md-6 col-xl-4" key={f.key}>
              <label className="form-label small fw-semibold">{f.label}</label>
              <MediaInput
                value={pageHeroes[f.key] || ""}
                onChange={(url) => setPageHero(f.key, url)}
                placeholder={`Hero for ${f.label}`}
              />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
