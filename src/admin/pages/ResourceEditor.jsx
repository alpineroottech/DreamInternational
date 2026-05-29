import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import api from "../api/client";
import { RESOURCE_CONFIG } from "../resourceConfig";
import { slugify } from "../utils";
import FieldRenderer from "../components/FieldRenderer";

export default function ResourceEditor({ resource: resourceProp }) {
  const params = useParams();
  const resource = resourceProp || params.resource;
  const { id } = params;
  const cfg = RESOURCE_CONFIG[resource];
  const navigate = useNavigate();
  const isNew = !id;

  const allFields = useMemo(() => cfg.tabs.flatMap((t) => t.fields), [cfg]);

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
        setForm(data);
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

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setFieldErrors({});
    setMessage("");
    try {
      let saved;
      if (isNew) {
        ({ data: saved } = await api.post(`/admin/${cfg.apiPath}`, form));
        navigate(`/admin/${resource}/${saved.id}/edit`, { replace: true });
      } else {
        ({ data: saved } = await api.patch(`/admin/${cfg.apiPath}/${id}`, form));
        setForm(saved);
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
        <button type="submit" className="btn di-btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
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
      <input type="hidden" value={allFields.length} readOnly />
    </form>
  );
}
