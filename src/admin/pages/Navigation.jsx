import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import api from "../api/client";
import { SITE_PAGES_BY_ID, resolveNavConfig, navConfigToHeaderNav, DEFAULT_NAV_IDS } from "../../lib/sitePages";

/**
 * The header menu is built from the SITE_PAGES registry (src/lib/sitePages.js) —
 * every real page the site has. Admins only ever check/uncheck visibility and
 * drag to reorder; nothing here requires typing a URL by hand. Saving writes
 * both `navConfig` (this screen's own state, for next time you open it) and
 * the derived `headerNav` the public site actually reads.
 */
export default function Navigation() {
  const [rows, setRows] = useState([]);
  const [footer, setFooter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/admin/settings");
      const savedConfig = Array.isArray(data.navConfig) && data.navConfig.length
        ? data.navConfig
        : DEFAULT_NAV_IDS.map((id) => ({ id, visible: true }));
      setRows(resolveNavConfig(savedConfig));
      setFooter(Array.isArray(data.footerColumns) ? data.footerColumns : []);
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage("");
    const navConfig = rows.map(({ id, visible, label }) => ({ id, visible, label }));
    const headerNav = navConfigToHeaderNav(navConfig);
    await api.put("/admin/settings", { navConfig, headerNav, footerColumns: footer });
    setSaving(false);
    setMessage("Navigation saved — the header menu on the live site will update immediately.");
  };

  const toggleVisible = (i) =>
    setRows(rows.map((r, idx) => (idx === i ? { ...r, visible: !r.visible } : r)));
  const setLabel = (i, label) =>
    setRows(rows.map((r, idx) => (idx === i ? { ...r, label } : r)));
  const move = (from, to) => {
    if (to < 0 || to >= rows.length) return;
    const next = [...rows];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setRows(next);
  };

  const onDragStart = (i) => setDragIndex(i);
  const onDragOver = (e) => e.preventDefault();
  const onDrop = (i) => {
    if (dragIndex === null || dragIndex === i) return;
    move(dragIndex, i);
    setDragIndex(null);
  };

  // Footer helpers
  const setCol = (i, patch) => setFooter(footer.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  const addCol = () => setFooter([...footer, { title: "", links: [] }]);
  const removeCol = (i) => setFooter(footer.filter((_, idx) => idx !== i));
  const setLink = (ci, li, patch) =>
    setCol(ci, { links: footer[ci].links.map((l, idx) => (idx === li ? { ...l, ...patch } : l)) });
  const addLink = (ci) => setCol(ci, { links: [...(footer[ci].links || []), { label: "", url: "" }] });
  const removeLink = (ci, li) => setCol(ci, { links: footer[ci].links.filter((_, idx) => idx !== li) });
  const addPageLink = (ci, pageId) => {
    const page = SITE_PAGES_BY_ID[pageId];
    if (!page) return;
    setCol(ci, { links: [...(footer[ci].links || []), { label: page.label, url: page.url }] });
  };

  if (loading) return <div className="text-muted">Loading…</div>;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">Navigation</h4>
          <p className="text-muted mb-0">
            Check the pages you want in the header menu, drag to reorder, then save. No URLs to type — every real page on the site is already listed below.
          </p>
        </div>
        <button className="btn di-btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save navigation"}
        </button>
      </div>

      {message && <div className="alert alert-success py-2">{message}</div>}

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="di-card p-4">
            <h6 className="fw-bold mb-1">Header menu</h6>
            <p className="text-muted small mb-3">
              Drag <Icon icon="solar:menu-dots-bold" /> to reorder. Tick the box to show a page in the header. Untick to hide it — it stays here for later.
            </p>
            <div className="di-nav-page-list">
              {rows.map((row, i) => {
                const page = SITE_PAGES_BY_ID[row.id];
                if (!page) return null;
                return (
                  <div
                    key={row.id}
                    className={`di-nav-page-row ${row.visible ? "" : "di-nav-page-row--hidden"} ${dragIndex === i ? "di-nav-page-row--dragging" : ""}`}
                    draggable
                    onDragStart={() => onDragStart(i)}
                    onDragOver={onDragOver}
                    onDrop={() => onDrop(i)}
                    onDragEnd={() => setDragIndex(null)}
                  >
                    <span className="di-nav-page-row__handle" title="Drag to reorder">
                      <Icon icon="solar:menu-dots-bold" />
                    </span>
                    <label className="di-nav-page-row__check form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={row.visible}
                        onChange={() => toggleVisible(i)}
                      />
                    </label>
                    <div className="di-nav-page-row__body">
                      <input
                        className="di-nav-page-row__label"
                        value={row.label || page.label}
                        onChange={(e) => setLabel(i, e.target.value)}
                      />
                      <span className="di-nav-page-row__url">
                        {page.url}
                        {page.children?.length ? ` (+ ${page.children.length} sub-links)` : ""}
                        {page.megaType ? " · mega menu" : ""}
                      </span>
                    </div>
                    <div className="di-nav-page-row__reorder">
                      <button type="button" className="btn btn-sm btn-light" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label="Move up">
                        <Icon icon="solar:alt-arrow-up-outline" />
                      </button>
                      <button type="button" className="btn btn-sm btn-light" onClick={() => move(i, i + 1)} disabled={i === rows.length - 1} aria-label="Move down">
                        <Icon icon="solar:alt-arrow-down-outline" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
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
                <div className="d-flex gap-2 align-items-center mt-2">
                  <button className="btn btn-sm btn-link p-0" onClick={() => addLink(ci)}>+ Add custom link</button>
                  <span className="text-muted small">or</span>
                  <select
                    className="form-select form-select-sm w-auto"
                    value=""
                    onChange={(e) => e.target.value && addPageLink(ci, e.target.value)}
                  >
                    <option value="">+ Add a site page…</option>
                    {Object.values(SITE_PAGES_BY_ID).map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
