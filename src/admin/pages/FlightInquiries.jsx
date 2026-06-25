import React, { useEffect, useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import api from "../api/client";

const STATUS_COLORS = {
  NEW: "di-badge-DRAFT",
  IN_PROGRESS: "di-badge-PUBLISHED",
  RESPONDED: "di-badge-PUBLISHED",
  CLOSED: "di-badge-ARCHIVED",
};

const STATUS_OPTIONS = ["NEW", "IN_PROGRESS", "RESPONDED", "CLOSED"];

export default function FlightInquiries() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== "ALL") params.status = filter;
      if (typeFilter !== "ALL") params.ticketType = typeFilter;
      const { data } = await api.get("/admin/flight-inquiries", { params });
      setRows(data);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [filter, typeFilter]);

  useEffect(() => { load(); }, [load]);

  const openDetail = (row) => {
    setSelected(row);
    setNotes(row.internalNotes || "");
  };

  const saveStatus = async (id, status) => {
    setSaving(true);
    try {
      const { data } = await api.patch(`/admin/flight-inquiries/${id}`, { status, internalNotes: notes });
      setRows(prev => prev.map(r => r.id === id ? data : r));
      setSelected(data);
    } finally {
      setSaving(false);
    }
  };

  const deleteRow = async (id) => {
    if (!window.confirm("Delete this inquiry?")) return;
    await api.delete(`/admin/flight-inquiries/${id}`);
    setRows(prev => prev.filter(r => r.id !== id));
    setSelected(null);
  };

  return (
    <div className="di-page-wrap">
      <div className="di-page-header">
        <h1 className="di-page-title">
          <Icon icon="solar:plane-2-outline" className="me-2" />
          Flight Inquiries
        </h1>
        <p className="text-muted">Booking enquiries submitted through the ticketing pages.</p>
      </div>

      {/* Filters */}
      <div className="di-filter-bar mb-4 d-flex flex-wrap gap-2 align-items-center">
        <span className="text-muted small me-1">Status:</span>
        {["ALL", ...STATUS_OPTIONS].map(s => (
          <button
            key={s}
            type="button"
            className={`di-category-filter-btn${filter === s ? " active" : ""}`}
            onClick={() => setFilter(s)}
          >{s}</button>
        ))}
        <span className="text-muted small ms-3 me-1">Type:</span>
        {["ALL", "domestic", "international"].map(t => (
          <button
            key={t}
            type="button"
            className={`di-category-filter-btn${typeFilter === t ? " active" : ""}`}
            onClick={() => setTypeFilter(t)}
          >{t}</button>
        ))}
        <button type="button" className="btn btn-sm btn-outline-secondary ms-auto" onClick={load}>
          <Icon icon="solar:refresh-outline" /> Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="di-empty-state text-center py-5">
          <Icon icon="solar:inbox-line-outline" style={{ fontSize: 48, color: "#c0c0d0" }} />
          <p className="mt-3 text-muted">No flight inquiries yet.</p>
        </div>
      ) : (
        <div className="row g-3">
          {/* List */}
          <div className={selected ? "col-lg-5" : "col-12"}>
            <div className="di-table-wrap">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Route</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => (
                    <tr
                      key={row.id}
                      className={selected?.id === row.id ? "table-active" : ""}
                      style={{ cursor: "pointer" }}
                      onClick={() => openDetail(row)}
                    >
                      <td>
                        <strong>{row.name}</strong>
                        <div className="text-muted small">{row.email}</div>
                      </td>
                      <td>
                        <span className="fw-semibold">{row.fromCity}</span>
                        <i className="fa-light fa-arrow-right mx-1 text-muted" />
                        <span className="fw-semibold">{row.toCity}</span>
                        <div className="text-muted small">{row.ticketType} · {row.cabinClass}</div>
                      </td>
                      <td className="text-muted small">{new Date(row.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`di-badge-status ${STATUS_COLORS[row.status] || ""}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={e => { e.stopPropagation(); deleteRow(row.id); }}
                          title="Delete"
                        >
                          <Icon icon="solar:trash-bin-trash-outline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="col-lg-7">
              <div className="di-detail-panel p-4" style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h4 className="mb-0">{selected.name}</h4>
                  <button type="button" className="btn-close" onClick={() => setSelected(null)} />
                </div>

                <div className="row g-2 mb-4 small">
                  <div className="col-6"><span className="text-muted">Email</span><br /><strong>{selected.email}</strong></div>
                  <div className="col-6"><span className="text-muted">Phone</span><br /><strong>{selected.phone || "—"}</strong></div>
                  <div className="col-6"><span className="text-muted">Nationality</span><br /><strong>{selected.nationality || "—"}</strong></div>
                  <div className="col-6"><span className="text-muted">Submitted</span><br /><strong>{new Date(selected.createdAt).toLocaleString()}</strong></div>
                  <div className="col-6"><span className="text-muted">From</span><br /><strong>{selected.fromCity}</strong></div>
                  <div className="col-6"><span className="text-muted">To</span><br /><strong>{selected.toCity}</strong></div>
                  <div className="col-6"><span className="text-muted">Travel date</span><br /><strong>{selected.travelDate || "—"}</strong></div>
                  <div className="col-6"><span className="text-muted">Return</span><br /><strong>{selected.returnDate || "One-way"}</strong></div>
                  <div className="col-6"><span className="text-muted">Passengers</span><br /><strong>{selected.passengers}</strong></div>
                  <div className="col-6"><span className="text-muted">Cabin</span><br /><strong>{selected.cabinClass}</strong></div>
                  <div className="col-6"><span className="text-muted">Type</span><br /><strong className="text-capitalize">{selected.ticketType}</strong></div>
                </div>

                {selected.message && (
                  <div className="mb-4 p-3" style={{ background: "#f9fafb", borderRadius: 8 }}>
                    <div className="text-muted small mb-1">Message</div>
                    <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>{selected.message}</p>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Internal notes</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Add notes for your team…"
                  />
                </div>

                <div className="d-flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map(s => (
                    <button
                      key={s}
                      type="button"
                      disabled={saving || selected.status === s}
                      onClick={() => saveStatus(selected.id, s)}
                      className={`btn btn-sm ${selected.status === s ? "btn-secondary" : "btn-outline-primary"}`}
                    >
                      {s === selected.status ? `✓ ${s}` : `Mark ${s}`}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-success ms-auto"
                    disabled={saving}
                    onClick={() => saveStatus(selected.id, selected.status)}
                  >
                    Save notes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
