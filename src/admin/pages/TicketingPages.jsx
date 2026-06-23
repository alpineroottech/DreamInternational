import React, { useEffect, useState } from "react";
import api from "../api/client";

const PAGES = [
  { page: "ticketing-domestic", label: "Domestic Flights", key: "page" },
  { page: "ticketing-international", label: "International Flights", key: "page" },
];

const EMPTY = {
  subTitle: "",
  title: "",
  intro: "",
  heroImage: "",
  trustBadges: ["IATA Partner", "Best Fare Guarantee", "24/7 Support"],
};

export default function TicketingPages() {
  const [active, setActive] = useState(PAGES[0].page);
  const [sections, setSections] = useState({});
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next = {};
      for (const p of PAGES) {
        // eslint-disable-next-line no-await-in-loop
        const { data } = await api.get("/admin/sections", { params: { page: p.page } });
        const row = Array.isArray(data) ? data.find((s) => s.key === p.key) : null;
        if (row) next[p.page] = row;
      }
      if (!cancelled) setSections(next);
    })().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const row = sections[active];
    setForm({ ...EMPTY, ...(row?.data || {}) });
  }, [active, sections]);

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      const meta = PAGES.find((p) => p.page === active);
      const existing = sections[active];
      if (existing?.id) {
        const { data } = await api.patch(`/admin/sections/${existing.id}`, { data: form });
        setSections((s) => ({ ...s, [active]: data }));
      } else {
        const { data } = await api.post("/admin/sections", {
          page: meta.page,
          key: meta.key,
          label: meta.label,
          order: 0,
          enabled: true,
          data: form,
        });
        setSections((s) => ({ ...s, [active]: data }));
      }
      setMsg("Saved.");
    } catch {
      setMsg("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  return (
    <div className="di-page">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="h4 mb-1">Ticketing Pages</h1>
          <p className="text-muted mb-0">Edit hero and intro content for domestic and international flight listings.</p>
        </div>
        <button type="button" className="btn btn-primary" disabled={saving} onClick={save}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      {msg && <div className="alert alert-secondary py-2">{msg}</div>}

      <ul className="nav nav-tabs mb-4">
        {PAGES.map((p) => (
          <li className="nav-item" key={p.page}>
            <button
              type="button"
              className={`nav-link ${active === p.page ? "active" : ""}`}
              onClick={() => setActive(p.page)}
            >
              {p.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Subtitle</label>
          <input className="form-control" value={form.subTitle || ""} onChange={(e) => setField("subTitle", e.target.value)} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Hero image URL</label>
          <input className="form-control" value={form.heroImage || ""} onChange={(e) => setField("heroImage", e.target.value)} />
        </div>
        <div className="col-12">
          <label className="form-label">Page title</label>
          <input className="form-control" value={form.title || ""} onChange={(e) => setField("title", e.target.value)} />
        </div>
        <div className="col-12">
          <label className="form-label">Intro text</label>
          <textarea className="form-control" rows={4} value={form.intro || ""} onChange={(e) => setField("intro", e.target.value)} />
        </div>
        <div className="col-12">
          <label className="form-label">Trust badges (one per line)</label>
          <textarea
            className="form-control"
            rows={3}
            value={(form.trustBadges || []).join("\n")}
            onChange={(e) => setField("trustBadges", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
          />
        </div>
      </div>
    </div>
  );
}
