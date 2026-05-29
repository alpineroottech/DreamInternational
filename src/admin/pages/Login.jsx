import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.error || "Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="di-auth">
      <div className="di-auth__card">
        <div className="text-center mb-4" style={{ lineHeight: 1 }}>
          <div style={{ fontFamily: "'Montez', cursive", fontSize: 40, color: "#1ca8cb" }}>
            Dream International
          </div>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: "#113d48" }}>
            Travel and Tours — CMS
          </div>
        </div>
        <h5 className="mb-1">Sign in to your account</h5>
        <p className="text-muted small mb-4">Manage your website content</p>

        {error && (
          <div className="alert alert-danger py-2 small" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <Icon icon="mage:email" />
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="admin@dreaminternationaltours.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label small fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <Icon icon="solar:lock-password-outline" />
              </span>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn di-btn-primary w-100 py-2" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
