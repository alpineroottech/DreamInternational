import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import api from "../api/client";
import { RESOURCE_CONFIG } from "../resourceConfig";
import { slugify } from "../utils";
import FieldRenderer, { normalizeGalleryList } from "../components/FieldRenderer";

export default function ResourceEditor({ resource: resourceProp }) {
  const params = useParams();
  const resource = resourceProp || params.resource;
  const { id } = params;
  const cfg = RESOURCE_CONFIG[resource];
  const navigate = useNavigate();
  const isNew = !id;

  const allFields = useMemo(() => cfg.tabs.flatMap((t) => t.fields), [cfg]);
  const hasStatusField = useMemo(() => allFields.some((f) => f.name === "status"), [allFields]);

  const buildPayload = (source, statusOverride) => {
    const names = new Set(
      allFields.filter((f) => !f.name.startsWith("_")).map((f) => f.name)
    );
    if (resource === "tours") {
      names.add("itineraryDays");
      names.add("faqs");
    }
    const payload = {};
    for (const name of names) {
      if (source[name] !== undefined) payload[name] = source[name];
    }
    if (statusOverride) payload.status = statusOverride;
    return payload;
  };

  const [form, setForm] = useState({});
  const [activeTab, setActiveTab] = useState(cfg.tabs[0].name);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    setActiveTab(cfg.tabs[0].name);
    if (isNew) {
      setForm({});
      setSlugTouched(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .get(`/admin/${cfg.apiPath}/${id}`)
      .then(({ data }) => {
        const normalized = { ...data };
        for (const tab of cfg.tabs) {
          for (const field of tab.fields) {
            if (field.type === "gallery") {
              normalized[field.name] = normalizeGalleryList(data[field.name]);
            }
            if (field.type === "reference" && normalized[field.name] && typeof normalized[field.name] === "object") {
              normalized[field.name] = normalized[field.name].id || null;
            }
          }
        }
        setForm(normalized);
        setSlugTouched(true);
      })
      .catch(() => setError("Could not load this item."))
      .finally(() => setLoading(false));
  }, [cfg, id, isNew]);

  const setField = (name, value) => {
    setForm((f) => {
      const next = { ...f, [name]: value };
      // Auto-slug from the title field until the slug is manually edited.
      if (cfg.hasSlug && name === cfg.titleField && !slugTouched) {
        next.slug = slugify(value);
      }
      if (name === "slug") setSlugTouched(true);
      return next;
    });
  };

  const save = async (e, statusOverride) => {
    e?.preventDefault?.();
    setSaving(true);
    setError("");
    setFieldErrors({});
    setMessage("");
    try {
      const payload = buildPayload(form, statusOverride);
      let saved;
      if (isNew) {
        ({ data: saved } = await api.post(`/admin/${cfg.apiPath}`, payload));
        navigate(`/admin/${resource}/${saved.id}/edit`, { replace: true });
      } else {
        ({ data: saved } = await api.patch(`/admin/${cfg.apiPath}/${id}`, payload));
        const normalized = { ...saved };
        for (const tab of cfg.tabs) {
          for (const field of tab.fields) {
            if (field.type === "gallery") {
              normalized[field.name] = normalizeGalleryList(saved[field.name]);
            }
            if (field.type === "reference" && normalized[field.name] && typeof normalized[field.name] === "object") {
              normalized[field.name] = normalized[field.name].id || null;
            }
          }
        }
        setForm(normalized);
      }
      if (statusOverride === "PUBLISHED") setMessage("Published successfully.");
      else if (statusOverride === "DRAFT") setMessage("Saved as draft.");
      else setMessage("Saved successfully.");
    } catch (err) {
      const res = err?.response?.data;
      if (res?.fieldErrors) setFieldErrors(res.fieldErrors);
      setError(res?.error || "Could not save. Please check the fields.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-muted">Loading…</div>;

  const title = isNew ? `New ${cfg.singular.toLowerCase()}` : form[cfg.titleField] || cfg.singular;

  return (
    <form onSubmit={save}>
      <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-4">
        <div>
          <Link to={`/admin/${resource}`} className="text-muted text-decoration-none small">
            <Icon icon="solar:alt-arrow-left-outline" /> Back to {cfg.label.toLowerCase()}
          </Link>
          <h4 className="fw-bold mb-0 mt-1">{title}</h4>
        </div>
        <div className="d-flex gap-2">
          {hasStatusField ? (
            <>
              <button type="button" className="btn btn-outline-secondary" disabled={saving} onClick={(e) => save(e, "DRAFT")}>
                {saving ? "Saving…" : "Save Draft"}
              </button>
              <button type="button" className="btn di-btn-primary" disabled={saving} onClick={(e) => save(e, "PUBLISHED")}>
                {saving ? "Saving…" : "Publish"}
              </button>
            </>
          ) : (
            <button type="submit" className="btn di-btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          )}
        </div>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {message && <div className="alert alert-success py-2">{message}</div>}

      <div className="di-card p-0">
        {cfg.tabs.length > 1 && (
          <ul className="nav di-tabs px-3 pt-2 gap-3 border-bottom flex-wrap">
            {cfg.tabs.map((t) => (
              <li className="nav-item" key={t.name}>
                <button
                  type="button"
                  className={`nav-link ${activeTab === t.name ? "active" : ""}`}
                  onClick={() => setActiveTab(t.name)}
                >
                  {t.name}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="p-4">
          {cfg.tabs
            .filter((t) => t.name === activeTab)
            .map((t) =>
              t.fields.map((field) => (
                <FieldRenderer
                  key={field.name}
                  field={field}
                  value={form[field.name]}
                  error={fieldErrors[field.name]}
                  onChange={(v) => setField(field.name, v)}
                />
              ))
            )}
        </div>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-3">
        {hasStatusField ? (
          <>
            <button type="button" className="btn btn-outline-secondary" disabled={saving} onClick={(e) => save(e, "DRAFT")}>
              {saving ? "Saving…" : "Save Draft"}
            </button>
            <button type="button" className="btn di-btn-primary" disabled={saving} onClick={(e) => save(e, "PUBLISHED")}>
              {saving ? "Saving…" : "Publish"}
            </button>
          </>
        ) : (
          <button type="submit" className="btn di-btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        )}
      </div>
      <input type="hidden" value={allFields.length} readOnly />
    </form>
  );
}
