import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import api from "../api/client";

export default function Navigation() {
  const [header, setHeader] = useState([]);
  const [footer, setFooter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/admin/settings");
      setHeader(Array.isArray(data.headerNav) ? data.headerNav : []);
      setFooter(Array.isArray(data.footerColumns) ? data.footerColumns : []);
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage("");
    await api.put("/admin/settings", { headerNav: header, footerColumns: footer });
    setSaving(false);
    setMessage("Navigation saved.");
  };

  // Header helpers
  const setHeaderItem = (i, patch) => setHeader(header.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const addHeader = () => setHeader([...header, { label: "", url: "" }]);
  const removeHeader = (i) => setHeader(header.filter((_, idx) => idx !== i));

  // Footer helpers
  const setCol = (i, patch) => setFooter(footer.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  const addCol = () => setFooter([...footer, { title: "", links: [] }]);
  const removeCol = (i) => setFooter(footer.filter((_, idx) => idx !== i));
  const setLink = (ci, li, patch) =>
    setCol(ci, { links: footer[ci].links.map((l, idx) => (idx === li ? { ...l, ...patch } : l)) });
  const addLink = (ci) => setCol(ci, { links: [...(footer[ci].links || []), { label: "", url: "" }] });
  const removeLink = (ci, li) => setCol(ci, { links: footer[ci].links.filter((_, idx) => idx !== li) });

  if (loading) return <div className="text-muted">Loading…</div>;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">Navigation</h4>
          <p className="text-muted mb-0">Edit the header menu and footer link columns.</p>
        </div>
        <button className="btn di-btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save navigation"}
        </button>
      </div>

      {message && <div className="alert alert-success py-2">{message}</div>}

      <div className="row g-3">
        <div className="col-lg-5">
          <div className="di-card p-4">
            <h6 className="fw-bold mb-3">Header menu</h6>
            {header.map((it, i) => (
              <div className="input-group mb-2" key={i}>
                <input className="form-control" placeholder="Label" value={it.label} onChange={(e) => setHeaderItem(i, { label: e.target.value })} />
                <input className="form-control" placeholder="/url" value={it.url} onChange={(e) => setHeaderItem(i, { url: e.target.value })} />
                <button className="btn btn-outline-danger" onClick={() => removeHeader(i)}>
                  <Icon icon="solar:trash-bin-trash-outline" />
                </button>
              </div>
            ))}
            <button className="btn btn-sm btn-outline-secondary" onClick={addHeader}>
              <Icon icon="solar:add-circle-outline" className="me-1" /> Add menu item
            </button>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="di-card p-4">
            <div className="d-flex justify-content-between mb-3">
              <h6 className="fw-bold mb-0">Footer columns</h6>
              <button className="btn btn-sm btn-outline-secondary" onClick={addCol}>
                <Icon icon="solar:add-circle-outline" className="me-1" /> Add column
              </button>
            </div>
            {footer.map((col, ci) => (
              <div className="border rounded p-3 mb-3" key={ci}>
                <div className="input-group mb-2">
                  <span className="input-group-text">Title</span>
                  <input className="form-control" value={col.title} onChange={(e) => setCol(ci, { title: e.target.value })} />
                  <button className="btn btn-outline-danger" onClick={() => removeCol(ci)}>
                    <Icon icon="solar:trash-bin-trash-outline" />
                  </button>
                </div>
                {(col.links || []).map((l, li) => (
                  <div className="input-group mb-1" key={li}>
                    <input className="form-control" placeholder="Label" value={l.label} onChange={(e) => setLink(ci, li, { label: e.target.value })} />
                    <input className="form-control" placeholder="/url" value={l.url} onChange={(e) => setLink(ci, li, { url: e.target.value })} />
                    <button className="btn btn-outline-danger" onClick={() => removeLink(ci, li)}>
                      <Icon icon="solar:close-circle-outline" />
                    </button>
                  </div>
                ))}
                <button className="btn btn-sm btn-link p-0" onClick={() => addLink(ci)}>+ Add link</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
