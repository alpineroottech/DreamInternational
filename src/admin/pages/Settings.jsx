import React, { useEffect, useState } from "react";
import api from "../api/client";

const FIELDS = [
  { group: "General", items: [
    { key: "siteTitle", label: "Site title" },
    { key: "tagline", label: "Tagline" },
    { key: "address", label: "Address" },
  ]},
  { group: "Contact", items: [
    { key: "contactEmail", label: "Contact email" },
    { key: "contactPhone", label: "Contact phone" },
    { key: "whatsappNumber", label: "WhatsApp number" },
  ]},
  { group: "Social", items: [
    { key: "facebookUrl", label: "Facebook URL" },
    { key: "instagramUrl", label: "Instagram URL" },
    { key: "youtubeUrl", label: "YouTube URL" },
    { key: "tripadvisorUrl", label: "TripAdvisor URL" },
  ]},
  { group: "SEO defaults", items: [
    { key: "defaultSeoTitle", label: "Default SEO title template" },
    { key: "defaultSeoDescription", label: "Default meta description" },
    { key: "defaultOgImage", label: "Default OG image URL" },
  ]},
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

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const { data } = await api.put("/admin/settings", values);
      setValues(data);
      setMessage("Settings saved.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-muted">Loading…</div>;

  return (
    <form onSubmit={save}>
      <div className="d-flex align-items-center justify-content-between mb-4">
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
                  <input
                    className="form-control"
                    value={values[f.key] || ""}
                    onChange={(e) => set(f.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
