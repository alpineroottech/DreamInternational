import React, { useState } from "react";
import api from "../api/client";

export default function ChangePasswordModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setSaving(true);
    try {
      await api.patch("/auth/me/password", { currentPassword, newPassword });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="di-modal-backdrop" onMouseDown={onClose}>
      <div className="di-modal" style={{ maxWidth: 480 }} onMouseDown={(e) => e.stopPropagation()}>
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          <h6 className="mb-0 fw-bold">Change my password</h6>
          <button type="button" className="btn-close" onClick={onClose} />
        </div>

        {success ? (
          <div className="p-3">
            <div className="alert alert-success py-2 mb-3">Password updated successfully.</div>
            <button type="button" className="btn di-btn-primary w-100" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="p-3">
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <div className="mb-3">
                <label className="form-label small fw-semibold">Current password</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">New password</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <div className="form-text">
                  At least 12 characters, with uppercase, lowercase, a number, and a symbol.
                </div>
              </div>
              <div className="mb-1">
                <label className="form-label small fw-semibold">Confirm new password</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="p-3 border-top d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn di-btn-primary" disabled={saving}>
                {saving ? "Saving…" : "Update password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
