import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import api from "../api/client";
import { RESOURCE_CONFIG } from "../resourceConfig";

export default function ResourceList({ resource: resourceProp }) {
  const params = useParams();
  const resource = resourceProp || params.resource;
  const cfg = RESOURCE_CONFIG[resource];
  const [searchParams] = useSearchParams();
  const marketFilter = (searchParams.get("market") || "").trim();
  const qsSuffix = marketFilter ? `?market=${encodeURIComponent(marketFilter)}` : "";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!cfg) return;
    setLoading(true);
    setSearch("");
    api
      .get(`/admin/${cfg.apiPath}`, marketFilter ? { params: { market: marketFilter } } : undefined)
      .then(({ data }) => setItems(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [cfg, marketFilter]);

  if (!cfg) {
    return <div className="text-muted">Unknown content type.</div>;
  }

  const reload = async () => {
    const { data } = await api.get(
      `/admin/${cfg.apiPath}`,
      marketFilter ? { params: { market: marketFilter } } : undefined,
    );
    setItems(Array.isArray(data) ? data : []);
  };

  const remove = async (id, label) => {
    if (!id) {
      window.alert("Cannot delete this item — missing ID. Refresh the page and try again.");
      return;
    }
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/${cfg.apiPath}/${id}`);
      setItems((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      const status = err?.response?.status;
      const msg =
        status === 404
          ? "This item was not found. It may have already been deleted."
          : err?.response?.data?.error || "Could not delete this item. Please try again.";
      window.alert(msg);
      if (status === 404) {
        try {
          await reload();
        } catch {
          /* ignore refresh failure */
        }
      }
    }
  };

  const filtered = items.filter((it) =>
    String(it[cfg.titleField] || "").toLowerCase().includes(search.toLowerCase())
  );

  const formatCell = (val) => {
    if (val == null || val === "") return "—";
    if (typeof val === "object") {
      return val.name || val.title || val.slug || val.label || val.id || "—";
    }
    return val;
  };

  const renderCell = (col, row) => {
    const val = row[col.key];
    if (col.type === "bool") {
      return val ? <Icon icon="solar:check-circle-bold" className="text-success" /> : <span className="text-muted">—</span>;
    }
    if (col.badge && val) {
      return <span className={`di-badge-status di-badge-${val}`}>{val}</span>;
    }
    return formatCell(val);
  };

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">{cfg.label}</h4>
          <p className="text-muted mb-0">Manage {cfg.label.toLowerCase()} shown on your website.</p>
        </div>
        <Link to={`/admin/${resource}/new${qsSuffix}`} className="btn di-btn-primary">
          <Icon icon="solar:add-circle-outline" className="me-1" /> New {cfg.singular.toLowerCase()}
        </Link>
      </div>

      <div className="di-card p-3 mb-3">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <Icon icon="solar:magnifer-outline" />
          </span>
          <input
            className="form-control border-start-0"
            placeholder={`Search ${cfg.label.toLowerCase()}…`}
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
                {cfg.listColumns.map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={cfg.listColumns.length + 1} className="text-center py-4 text-muted">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={cfg.listColumns.length + 1} className="text-center py-4 text-muted">Nothing here yet.</td></tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id}>
                    {cfg.listColumns.map((c, idx) => (
                      <td key={c.key} className={idx === 0 ? "fw-semibold" : ""}>
                        {renderCell(c, row)}
                      </td>
                    ))}
                    <td className="text-end">
                      <Link to={`/admin/${resource}/${row.id}/edit${qsSuffix}`} className="btn btn-sm btn-outline-secondary me-1">
                        <Icon icon="solar:pen-outline" />
                      </Link>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => remove(row.id, row[cfg.titleField])}>
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
