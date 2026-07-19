import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  { value: "SUPER_ADMIN", label: "Super Admin", hint: "Full access, incl. managing users" },
  { value: "ADMIN", label: "Admin", hint: "Manage content, inquiries, settings" },
  { value: "EDITOR", label: "Editor", hint: "Manage content only (no settings/inquiries)" },
];

const roleLabel = (role) => ROLES.find((r) => r.value === role)?.label || role;

const roleBadgeClass = (role) => {
  if (role === "SUPER_ADMIN") return "bg-danger-subtle text-danger";
  if (role === "ADMIN") return "bg-primary-subtle text-primary";
  return "bg-secondary-subtle text-secondary";
};

function emptyForm() {
  return { name: "", email: "", password: "", role: "EDITOR" };
}

export default function Users() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null); // { mode: "create" | "edit", user? }
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } catch (e) {
      setError(e.response?.data?.error || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => setModal({ mode: "create", form: emptyForm() });
  const openEdit = (u) =>
    setModal({
      mode: "edit",
      user: u,
      form: { name: u.name, email: u.email, role: u.role, password: "" },
    });
  const closeModal = () => setModal(null);

  const toggleActive = async (u) => {
    try {
      await api.patch(`/admin/users/${u.id}`, { isActive: !u.isActive });
      load();
    } catch (e) {
      alert(e.response?.data?.error || "Failed to update user");
    }
  };

  const remove = async (u) => {
    if (!window.confirm(`Remove ${u.name} (${u.email})? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${u.id}`);
      load();
    } catch (e) {
      alert(e.response?.data?.error || "Failed to remove user");
    }
  };

  const save = async (e) => {
    e.preventDefault();
    if (!modal) return;
    setSaving(true);
    setError("");
    try {
      if (modal.mode === "create") {
        await api.post("/admin/users", modal.form);
      } else {
        const payload = { name: modal.form.name, role: modal.form.role };
        if (modal.form.password) payload.password = modal.form.password;
        await api.patch(`/admin/users/${modal.user.id}`, payload);
      }
      closeModal();
      load();
    } catch (e2) {
      setError(e2.response?.data?.error || "Failed to save user");
    } finally {
      setSaving(false);
    }
  };

  const setField = (key, value) =>
    setModal((m) => ({ ...m, form: { ...m.form, [key]: value } }));

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1">CMS Users</h4>
          <p className="text-muted mb-0">
            Create accounts for your team and control what each person can access.
          </p>
        </div>
        <button type="button" className="btn di-btn-primary" onClick={openCreate}>
          <Icon icon="solar:user-plus-outline" className="me-1" />
          Add user
        </button>
      </div>

      <div className="di-card p-3 mb-4">
        <h6 className="fw-bold mb-2">Roles</h6>
        <div className="row g-2">
          {ROLES.map((r) => (
            <div className="col-md-4" key={r.value}>
              <span className={`badge ${roleBadgeClass(r.value)} mb-1`}>{r.label}</span>
              <p className="text-muted small mb-0">{r.hint}</p>
            </div>
          ))}
        </div>
      </div>

      {error && !modal && <div className="alert alert-danger py-2">{error}</div>}

      <div className="di-card p-0">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last login</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    Loading…
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    No users yet.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td className="fw-semibold">
                      {u.name}
                      {u.id === me?.id && <span className="text-muted small ms-1">(you)</span>}
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${roleBadgeClass(u.role)}`}>{roleLabel(u.role)}</span>
                    </td>
                    <td>
                      {u.isActive ? (
                        <span className="badge bg-success-subtle text-success">Active</span>
                      ) : (
                        <span className="badge bg-secondary-subtle text-secondary">Disabled</span>
                      )}
                    </td>
                    <td className="text-muted small">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never"}
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => openEdit(u)}
                          title="Edit"
                        >
                          <Icon icon="solar:pen-outline" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => toggleActive(u)}
                          disabled={u.id === me?.id}
                          title={u.isActive ? "Disable login" : "Enable login"}
                        >
                          <Icon icon={u.isActive ? "solar:lock-outline" : "solar:lock-unlocked-outline"} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => remove(u)}
                          disabled={u.id === me?.id}
                          title="Remove"
                        >
                          <Icon icon="solar:trash-bin-trash-outline" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="di-modal-backdrop" onMouseDown={closeModal}>
          <div className="di-modal" onMouseDown={(e) => e.stopPropagation()}>
            <form onSubmit={save}>
              <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
                <h6 className="mb-0 fw-bold">
                  {modal.mode === "create" ? "Add CMS user" : `Edit ${modal.user.name}`}
                </h6>
                <button type="button" className="btn-close" onClick={closeModal} />
              </div>
              <div className="p-3">
                {error && <div className="alert alert-danger py-2">{error}</div>}

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Full name</label>
                  <input
                    className="form-control"
                    required
                    value={modal.form.name}
                    onChange={(e) => setField("name", e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    disabled={modal.mode === "edit"}
                    value={modal.form.email}
                    onChange={(e) => setField("email", e.target.value)}
                  />
                  {modal.mode === "edit" && (
                    <div className="form-text">Email cannot be changed once created.</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Role</label>
                  <select
                    className="form-select"
                    value={modal.form.role}
                    onChange={(e) => setField("role", e.target.value)}
                    disabled={modal.mode === "edit" && modal.user.id === me?.id}
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  {modal.mode === "edit" && modal.user.id === me?.id && (
                    <div className="form-text">You cannot change your own role.</div>
                  )}
                </div>

                <div className="mb-1">
                  <label className="form-label small fw-semibold">
                    {modal.mode === "create" ? "Temporary password" : "Reset password (optional)"}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    required={modal.mode === "create"}
                    value={modal.form.password}
                    onChange={(e) => setField("password", e.target.value)}
                    placeholder={modal.mode === "edit" ? "Leave blank to keep current password" : ""}
                  />
                  <div className="form-text">
                    At least 12 characters, with uppercase, lowercase, a number, and a symbol.
                    Share it with the user securely — they should change it after first login.
                  </div>
                </div>
              </div>
              <div className="p-3 border-top d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn di-btn-primary" disabled={saving}>
                  {saving ? "Saving…" : modal.mode === "create" ? "Create user" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
