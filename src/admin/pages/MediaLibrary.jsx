import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import api from "../api/client";

const API_ORIGIN = (process.env.REACT_APP_API_URL || "http://localhost:4000/api").replace(/\/api$/, "");

function assetUrl(url) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_ORIGIN}${url}`;
}

export default function MediaLibrary() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/media");
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const { data } = await api.post("/admin/media/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setItems((prev) => [data, ...prev]);
    } catch (err) {
      setError(err?.response?.data?.error || "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this asset?")) return;
    await api.delete(`/admin/media/${id}`);
    setItems((prev) => prev.filter((m) => m.id !== id));
  };

  const copy = (url) => navigator.clipboard?.writeText(assetUrl(url));

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">Media Library</h4>
          <p className="text-muted mb-0">Upload images to Supabase Storage (production) or local disk (dev).</p>
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="d-none"
            onChange={(e) => upload(e.target.files?.[0])}
          />
          <button
            className="btn di-btn-primary"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            <Icon icon="solar:upload-outline" className="me-1" />
            {uploading ? "Uploading…" : "Upload image"}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      {loading ? (
        <div className="text-muted">Loading…</div>
      ) : items.length === 0 ? (
        <div className="di-card p-5 text-center text-muted">No media uploaded yet.</div>
      ) : (
        <div className="row g-3">
          {items.map((m) => (
            <div className="col-6 col-md-4 col-lg-3" key={m.id}>
              <div className="di-card p-2">
                <img
                  src={assetUrl(m.url)}
                  alt={m.altText || m.fileName}
                  style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8 }}
                />
                <div className="small text-truncate mt-2" title={m.fileName}>{m.fileName}</div>
                <div className="d-flex gap-1 mt-2">
                  <button className="btn btn-sm btn-outline-secondary flex-grow-1" onClick={() => copy(m.url)}>
                    <Icon icon="solar:copy-outline" /> Copy URL
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(m.id)}>
                    <Icon icon="solar:trash-bin-trash-outline" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
