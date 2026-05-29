import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import api from "../api/client";

const STATUS = ["NEW", "IN_PROGRESS", "RESPONDED", "CLOSED"];
const STATUS_CLASS = {
  NEW: "di-badge-DRAFT",
  IN_PROGRESS: "di-badge-DRAFT",
  RESPONDED: "di-badge-PUBLISHED",
  CLOSED: "di-badge-ARCHIVED",
};

export default function Inquiries() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/admin/inquiries");
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (id, patch) => {
    const { data } = await api.patch(`/admin/inquiries/${id}`, patch);
    setItems((prev) => prev.map((it) => (it.id === id ? data : it)));
    if (selected?.id === id) setSelected(data);
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this inquiry?")) return;
    await api.delete(`/admin/inquiries/${id}`);
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Inquiries</h4>
        <p className="text-muted mb-0">Messages from your website contact and booking forms.</p>
      </div>

      <div className="row g-3">
        <div className={selected ? "col-lg-7" : "col-12"}>
          <div className="di-card">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr><th>Name</th><th>Email</th><th>Status</th><th>Received</th><th /></tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-4 text-muted">Loading…</td></tr>
                  ) : items.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-4 text-muted">No inquiries yet.</td></tr>
                  ) : (
                    items.map((it) => (
                      <tr key={it.id} style={{ cursor: "pointer" }} onClick={() => setSelected(it)}>
                        <td className="fw-semibold">{it.name}</td>
                        <td className="text-muted">{it.email}</td>
                        <td><span className={`di-badge-status ${STATUS_CLASS[it.status]}`}>{it.status}</span></td>
                        <td className="text-muted small">{new Date(it.createdAt).toLocaleDateString()}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-danger" onClick={(e) => { e.stopPropagation(); remove(it.id); }}>
                            <Icon icon="solar:trash-bin-trash-outline" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {selected && (
          <div className="col-lg-5">
            <div className="di-card p-4">
              <div className="d-flex justify-content-between mb-3">
                <h6 className="fw-bold mb-0">Inquiry detail</h6>
                <button className="btn btn-sm btn-light" onClick={() => setSelected(null)}>
                  <Icon icon="solar:close-circle-outline" />
                </button>
              </div>
              <dl className="row small mb-3">
                <dt className="col-4 text-muted">Name</dt><dd className="col-8">{selected.name}</dd>
                <dt className="col-4 text-muted">Email</dt><dd className="col-8">{selected.email}</dd>
                <dt className="col-4 text-muted">Phone</dt><dd className="col-8">{selected.phone || "—"}</dd>
                <dt className="col-4 text-muted">Type</dt><dd className="col-8">{selected.type}</dd>
                <dt className="col-4 text-muted">Message</dt><dd className="col-8">{selected.message || "—"}</dd>
              </dl>
              <label className="form-label small fw-semibold">Status</label>
              <select className="form-select mb-3" value={selected.status} onChange={(e) => update(selected.id, { status: e.target.value })}>
                {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <label className="form-label small fw-semibold">Internal notes</label>
              <textarea
                className="form-control"
                rows={4}
                defaultValue={selected.internalNotes || ""}
                onBlur={(e) => update(selected.id, { internalNotes: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
