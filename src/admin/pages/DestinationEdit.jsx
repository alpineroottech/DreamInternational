import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import api from "../api/client";
import { MediaInput } from "../components/MediaPicker";

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const EMPTY = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  heroImageUrl: "",
  heroImageAlt: "",
  cardImageUrl: "",
  cardImageAlt: "",
  bestTimeToVisit: "",
  gettingThere: "",
  tips: "",
  price: "",
  basePrice: "",
  thingsToDo: [],
  status: "DRAFT",
  isFeatured: false,
  seoTitle: "",
  seoDescription: "",
  ogImageUrl: "",
};

const TABS = ["Basic", "Pricing", "Content", "Things To Do", "SEO"];

export default function DestinationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [form, setForm] = useState(EMPTY);
  const [activeTab, setActiveTab] = useState("Basic");
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const { data } = await api.get(`/admin/destinations/${id}`);
        setForm({ ...EMPTY, ...data, thingsToDo: data.thingsToDo || [] });
        setSlugTouched(true);
      } catch {
        setError("Could not load this destination.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const onNameChange = (value) => {
    setForm((f) => ({
      ...f,
      name: value,
      slug: slugTouched ? f.slug : slugify(value),
    }));
  };

  const setThing = (i, value) =>
    setForm((f) => {
      const next = [...f.thingsToDo];
      next[i] = value;
      return { ...f, thingsToDo: next };
    });
  const addThing = () => setForm((f) => ({ ...f, thingsToDo: [...f.thingsToDo, ""] }));
  const removeThing = (i) =>
    setForm((f) => ({ ...f, thingsToDo: f.thingsToDo.filter((_, idx) => idx !== i) }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setFieldErrors({});
    setMessage("");
    const payload = {
      ...form,
      basePrice: form.basePrice === "" || form.basePrice == null ? null : Number(form.basePrice),
      thingsToDo: form.thingsToDo.filter((t) => t && t.trim()),
    };
    try {
      let saved;
      if (isNew) {
        ({ data: saved } = await api.post("/admin/destinations", payload));
        navigate(`/admin/destinations/${saved.id}/edit`, { replace: true });
      } else {
        ({ data: saved } = await api.patch(`/admin/destinations/${id}`, payload));
        setForm({ ...EMPTY, ...saved, thingsToDo: saved.thingsToDo || [] });
      }
      setMessage("Saved successfully.");
    } catch (err) {
      const res = err?.response?.data;
      if (res?.fieldErrors) setFieldErrors(res.fieldErrors);
      setError(res?.error || "Could not save. Please check the fields.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-muted">Loading…</div>;

  return (
    <form onSubmit={save}>
      <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-4">
        <div>
          <Link to="/admin/destinations" className="text-muted text-decoration-none small">
            <Icon icon="solar:alt-arrow-left-outline" /> Back to destinations
          </Link>
          <h4 className="fw-bold mb-0 mt-1">{isNew ? "New destination" : form.name}</h4>
        </div>
        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select"
            style={{ width: 150 }}
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <button type="submit" className="btn di-btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {message && <div className="alert alert-success py-2">{message}</div>}

      <div className="di-card p-0">
        <ul className="nav di-tabs px-3 pt-2 gap-3 border-bottom">
          {TABS.map((t) => (
            <li className="nav-item" key={t}>
              <button
                type="button"
                className={`nav-link ${activeTab === t ? "active" : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {t}
              </button>
            </li>
          ))}
        </ul>

        <div className="p-4">
          {activeTab === "Basic" && (
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label fw-semibold">Name *</label>
                <input
                  className={`form-control ${fieldErrors.name ? "is-invalid" : ""}`}
                  value={form.name}
                  onChange={(e) => onNameChange(e.target.value)}
                />
                {fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Slug</label>
                <input
                  className={`form-control ${fieldErrors.slug ? "is-invalid" : ""}`}
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", e.target.value);
                  }}
                  placeholder="auto-generated"
                />
                {fieldErrors.slug && <div className="invalid-feedback">{fieldErrors.slug}</div>}
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Short description</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={form.shortDescription || ""}
                  onChange={(e) => set("shortDescription", e.target.value)}
                  placeholder="One-line summary shown on cards"
                />
              </div>
              <div className="col-12">
                <p className="text-muted small mb-2">
                  Upload any high-resolution photo — the CMS automatically crops and optimizes card images to 424×274 and hero images to 1200×800.
                </p>
              </div>
              <div className="col-md-8">
                <label className="form-label fw-semibold">Card image (listing tile)</label>
                <MediaInput
                  value={form.cardImageUrl || ""}
                  onChange={(url) => set("cardImageUrl", url)}
                  imagePurpose="card"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Card image alt</label>
                <input
                  className="form-control"
                  value={form.cardImageAlt || ""}
                  onChange={(e) => set("cardImageAlt", e.target.value)}
                />
              </div>
              <div className="col-md-8">
                <label className="form-label fw-semibold">Hero image (detail page)</label>
                <MediaInput
                  value={form.heroImageUrl || ""}
                  onChange={(url) => set("heroImageUrl", url)}
                  imagePurpose="featured"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Hero image alt</label>
                <input
                  className="form-control"
                  value={form.heroImageAlt || ""}
                  onChange={(e) => set("heroImageAlt", e.target.value)}
                />
              </div>
              <div className="col-12">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="featured"
                    checked={!!form.isFeatured}
                    onChange={(e) => set("isFeatured", e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="featured">
                    Feature this destination on the homepage
                  </label>
                </div>
              </div>
              {form.heroImageUrl && (
                <div className="col-12">
                  <img
                    src={form.heroImageUrl}
                    alt="preview"
                    style={{ maxHeight: 160, borderRadius: 10, objectFit: "cover" }}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === "Pricing" && (
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Price (display text)</label>
                <input
                  className="form-control"
                  value={form.price || ""}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder='e.g. "From $450 per person"'
                />
                <div className="form-text">Shown on destination cards and detail pages.</div>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Base price (USD, optional)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="form-control"
                  value={form.basePrice ?? ""}
                  onChange={(e) => set("basePrice", e.target.value)}
                  placeholder="450"
                />
                <div className="form-text">Used for sorting; leave blank if not applicable.</div>
              </div>
            </div>
          )}

          {activeTab === "Content" && (
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-semibold">Overview (HTML allowed)</label>
                <textarea
                  className="form-control"
                  rows={5}
                  value={form.description || ""}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Best time to visit</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.bestTimeToVisit || ""}
                  onChange={(e) => set("bestTimeToVisit", e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Getting there</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.gettingThere || ""}
                  onChange={(e) => set("gettingThere", e.target.value)}
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Travel tips</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.tips || ""}
                  onChange={(e) => set("tips", e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === "Things To Do" && (
            <div>
              <label className="form-label fw-semibold">Top things to do</label>
              {form.thingsToDo.length === 0 && (
                <p className="text-muted small">No items yet. Add the first one below.</p>
              )}
              {form.thingsToDo.map((t, i) => (
                <div className="input-group mb-2" key={i}>
                  <input
                    className="form-control"
                    value={t}
                    onChange={(e) => setThing(i, e.target.value)}
                    placeholder={`Activity ${i + 1}`}
                  />
                  <button type="button" className="btn btn-outline-danger" onClick={() => removeThing(i)}>
                    <Icon icon="solar:trash-bin-trash-outline" />
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={addThing}>
                <Icon icon="solar:add-circle-outline" className="me-1" /> Add item
              </button>
            </div>
          )}

          {activeTab === "SEO" && (
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-semibold">
                  SEO title <span className="text-muted small">({(form.seoTitle || "").length}/60)</span>
                </label>
                <input
                  className="form-control"
                  maxLength={70}
                  value={form.seoTitle || ""}
                  onChange={(e) => set("seoTitle", e.target.value)}
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">
                  Meta description <span className="text-muted small">({(form.seoDescription || "").length}/160)</span>
                </label>
                <textarea
                  className="form-control"
                  rows={2}
                  maxLength={180}
                  value={form.seoDescription || ""}
                  onChange={(e) => set("seoDescription", e.target.value)}
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">OG image URL</label>
                <input
                  className="form-control"
                  value={form.ogImageUrl || ""}
                  onChange={(e) => set("ogImageUrl", e.target.value)}
                />
              </div>
              <div className="col-12">
                <div className="border rounded p-3 bg-light">
                  <div className="text-muted small mb-1">Google preview</div>
                  <div style={{ color: "#1a0dab", fontSize: 18 }}>{form.seoTitle || form.name || "Destination title"}</div>
                  <div style={{ color: "#006621", fontSize: 13 }}>
                    dreaminternationaltours.com › destinations › {form.slug || "slug"}
                  </div>
                  <div style={{ color: "#545454", fontSize: 13 }}>
                    {form.seoDescription || form.shortDescription || "Meta description preview…"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
