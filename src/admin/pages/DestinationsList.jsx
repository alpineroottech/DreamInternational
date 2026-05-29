import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import api from "../api/client";

export default function DestinationsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/destinations");
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await api.delete(`/admin/destinations/${id}`);
    setItems((prev) => prev.filter((d) => d.id !== id));
  };

  const filtered = items.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">Destinations</h4>
          <p className="text-muted mb-0">Manage the destinations shown on your website.</p>
        </div>
        <Link to="/admin/destinations/new" className="btn di-btn-primary">
          <Icon icon="solar:add-circle-outline" className="me-1" /> New destination
        </Link>
      </div>

      <div className="di-card p-3 mb-3">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <Icon icon="solar:magnifer-outline" />
          </span>
          <input
            className="form-control border-start-0"
            placeholder="Search destinations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="di-card">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Updated</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-4 text-muted">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4 text-muted">No destinations yet.</td></tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d.id}>
                    <td className="fw-semibold">{d.name}</td>
                    <td className="text-muted">/{d.slug}</td>
                    <td><span className={`di-badge-status di-badge-${d.status}`}>{d.status}</span></td>
                    <td>{d.isFeatured ? <Icon icon="solar:star-bold" className="text-warning" /> : "—"}</td>
                    <td className="text-muted small">{new Date(d.updatedAt).toLocaleDateString()}</td>
                    <td className="text-end">
                      <Link to={`/admin/destinations/${d.id}/edit`} className="btn btn-sm btn-outline-secondary me-1">
                        <Icon icon="solar:pen-outline" />
                      </Link>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => remove(d.id, d.name)}>
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
  );
}
