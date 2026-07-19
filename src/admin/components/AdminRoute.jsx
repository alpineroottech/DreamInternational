import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="di-auth">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Optional per-route role gate — mirrors the backend's requireRole()
  // checks so the UI never renders a page the API would reject anyway.
  if (roles && roles.length && !roles.includes(user.role)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
