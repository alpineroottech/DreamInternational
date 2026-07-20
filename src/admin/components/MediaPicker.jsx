import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import api from "../api/client";
import { resolveAssetUrl } from "../utils";
import { uploadMediaFile } from "../lib/mediaUpload";

// Modal gallery for selecting or uploading an image; calls onSelect(url).
export function MediaPickerModal({ onSelect, onClose, imagePurpose }) {
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
    try {
      const data = await uploadMediaFile(file, { purpose: imagePurpose });
      setItems((prev) => [data, ...prev]);
      onSelect(data.url);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="di-modal-backdrop" onMouseDown={onClose}>
      <div className="di-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          <h6 className="mb-0 fw-bold">Select image</h6>
          <div className="d-flex gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="d-none"
              onChange={(e) => upload(e.target.files?.[0])}
            />
            <button className="btn btn-sm di-btn-primary" onClick={() => fileRef.current?.click()} disabled={uploading}>
              <Icon icon="solar:upload-outline" className="me-1" />
              {uploading ? "Uploading…" : "Upload new"}
            </button>
            <button className="btn btn-sm btn-light" onClick={onClose}>
              <Icon icon="solar:close-circle-outline" />
            </button>
          </div>
        </div>
        <div className="p-3" style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {error && (
            <div className="alert alert-danger py-2 small mb-3" role="alert">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-muted">Loading…</div>
          ) : items.length === 0 ? (
            <div className="text-muted text-center py-4">No media yet. Upload one above.</div>
          ) : (
            <div className="row g-2">
              {items.map((m) => (
                <div className="col-4 col-md-3" key={m.id}>
                  <button
                    type="button"
                    className="border rounded p-0 w-100 bg-white"
                    onClick={() => {
                      onSelect(m.url);
                      onClose();
                    }}
                  >
                    <img
                      src={resolveAssetUrl(m.url)}
                      alt={m.altText || m.fileName}
                      style={{ width: "100%", height: 90, objectFit: "cover", borderRadius: 6 }}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Text input + image preview + "Browse" button that opens the media picker.
export function MediaInput({ value, onChange, placeholder, imagePurpose }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="input-group">
        <input
          className="form-control"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "/assets/img/... or upload"}
        />
        <button type="button" className="btn btn-outline-secondary" onClick={() => setOpen(true)}>
          <Icon icon="solar:gallery-outline" className="me-1" /> Browse
        </button>
        {value && (
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => onChange("")}
            title="Remove image"
          >
            <Icon icon="solar:trash-bin-trash-outline" />
          </button>
        )}
      </div>
      {value && (
        <img
          src={resolveAssetUrl(value)}
          alt="preview"
          style={{ maxHeight: 90, marginTop: 8, borderRadius: 8, objectFit: "cover" }}
        />
      )}
      {open && (
        <MediaPickerModal
          onSelect={onChange}
          onClose={() => setOpen(false)}
          imagePurpose={imagePurpose}
        />
      )}
    </div>
  );
}
