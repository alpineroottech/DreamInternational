import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import api from "../api/client";
import { uploadMediaFiles } from "../lib/mediaUpload";

const API_ORIGIN = (process.env.REACT_APP_API_URL || "http://localhost:4000/api").replace(/\/api$/, "");

function assetUrl(url) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_ORIGIN}${url}`;
}

export default function MediaLibrary() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
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

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f && f.type.startsWith("image/"));
    if (!files.length) {
      setError("Please choose one or more image files.");
      return;
    }

    setUploading(true);
    setError("");
    setNotice("");
    setUploadProgress({ done: 0, total: files.length });

    try {
      const { succeeded, failed } = await uploadMediaFiles(files, {
        onProgress: ({ done, total }) => setUploadProgress({ done, total }),
      });

      if (succeeded.length) {
        setItems((prev) => [...succeeded, ...prev]);
      }

      if (failed.length && succeeded.length) {
        setNotice(`${succeeded.length} uploaded, ${failed.length} failed.`);
        setError(failed.map((f) => `${f.fileName}: ${f.error}`).join(" "));
      } else if (failed.length) {
        setError(failed.map((f) => `${f.fileName}: ${f.error}`).join(" "));
      } else {
        setNotice(
          succeeded.length === 1 ? "1 image uploaded." : `${succeeded.length} images uploaded.`
        );
      }
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
      setUploadProgress(null);
      setDragOver(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onInputChange = (e) => {
    handleFiles(e.target.files);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (!uploading) handleFiles(e.dataTransfer.files);
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
          <p className="text-muted mb-0">
            Upload one or many images at once. Drag and drop or use the button below.
          </p>
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="d-none"
            onChange={onInputChange}
          />
          <button
            className="btn di-btn-primary"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            <Icon icon="solar:upload-outline" className="me-1" />
            {uploading ? "Uploading…" : "Upload images"}
          </button>
        </div>
      </div>

      <div
        className={`di-card mb-4 p-4 text-center border-2 ${dragOver ? "border-primary bg-light" : "border-dashed"}`}
        style={{ borderStyle: "dashed", cursor: uploading ? "not-allowed" : "pointer" }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!uploading) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !uploading && fileRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !uploading) fileRef.current?.click();
        }}
      >
        <Icon icon="solar:gallery-add-outline" width={36} className="text-muted mb-2" />
        <div className="fw-semibold">Drop images here</div>
        <div className="text-muted small">or click to browse — up to 30 images per batch (8 MB each)</div>
        {uploadProgress && (
          <div className="mt-3 mx-auto" style={{ maxWidth: 320 }}>
            <div className="small text-muted mb-1">
              Uploading {uploadProgress.done} of {uploadProgress.total}…
            </div>
            <div className="progress" style={{ height: 6 }}>
              <div
                className="progress-bar"
                style={{ width: `${(uploadProgress.done / uploadProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {notice && <div className="alert alert-success py-2">{notice}</div>}
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
                <div className="small text-truncate mt-2" title={m.fileName}>
                  {m.fileName}
                </div>
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
