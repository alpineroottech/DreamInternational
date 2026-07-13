import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { section: "Overview" },
  { to: "/admin", label: "Dashboard", icon: "solar:home-smile-outline", end: true },
  { to: "/admin/homepage", label: "Homepage Builder", icon: "solar:layers-outline" },
  { section: "Content" },
  { to: "/admin/tours?market=nepal", label: "Nepal Tours", icon: "solar:mountains-outline" },
  { to: "/admin/tours?market=international", label: "International Holidays", icon: "solar:globe-outline" },
  { to: "/admin/categories", label: "Tour Categories", icon: "solar:widget-5-outline" },
  { to: "/admin/destinations", label: "Destinations", icon: "solar:map-point-outline" },
  { to: "/admin/activities", label: "Activities", icon: "solar:running-2-outline" },
  { to: "/admin/vehicleRentals", label: "Vehicle Rentals", icon: "solar:wheel-outline" },
  { to: "/admin/vehicleCategories", label: "Vehicle Categories", icon: "solar:car-outline" },
  { to: "/admin/services", label: "Services", icon: "solar:case-round-outline" },
  { to: "/admin/flightRoutes", label: "Flight Routes", icon: "solar:airplane-outline" },
  { to: "/admin/ticketing-pages", label: "Ticketing Pages", icon: "solar:ticket-outline" },
  { to: "/admin/resorts", label: "Resorts", icon: "solar:bedside-table-3-outline" },
  { to: "/admin/team", label: "Team / Guides", icon: "solar:users-group-rounded-outline" },
  { to: "/admin/blog", label: "Blog", icon: "solar:document-text-outline" },
  { to: "/admin/gallery", label: "Gallery", icon: "solar:gallery-wide-outline" },
  { to: "/admin/reviews", label: "Testimonials", icon: "solar:star-outline" },
  { to: "/admin/faqs", label: "FAQs", icon: "solar:question-circle-outline" },
  { to: "/admin/counters", label: "Stats / Counters", icon: "solar:chart-2-outline" },
  { to: "/admin/brands", label: "Partner Brands", icon: "solar:ribbon-outline" },
  { section: "Engagement" },
  { to: "/admin/inquiries", label: "Inquiries", icon: "solar:inbox-outline" },
  { to: "/admin/flight-inquiries", label: "Flight Inquiries", icon: "solar:plane-2-outline" },
  { to: "/admin/media", label: "Media Library", icon: "solar:gallery-outline" },
  { section: "Configuration" },
  { to: "/admin/navigation", label: "Navigation", icon: "solar:hamburger-menu-outline" },
  { to: "/admin/settings", label: "Settings", icon: "solar:settings-outline" },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="di-admin">
      <aside className={`di-sidebar ${open ? "open" : ""}`}>
        <div className="di-sidebar__brand">
          <span className="script">Dream International</span>
          <span className="sub">Travel and Tours — CMS</span>
        </div>
        <nav className="di-nav">
          {NAV.map((item, i) =>
            item.section ? (
              <div className="di-nav__label" key={`s-${i}`}>
                {item.section}
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <Icon icon={item.icon} />
                <span>{item.label}</span>
                {item.soon && (
                  <span className="badge bg-light text-secondary ms-auto" style={{ fontSize: 10 }}>
                    soon
                  </span>
                )}
              </NavLink>
            )
          )}
        </nav>
      </aside>

      <div className="di-main">
        <header className="di-topbar">
          <button
            type="button"
            className="btn btn-light di-sidebar-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <Icon icon="solar:hamburger-menu-outline" />
          </button>
          <div className="ms-auto d-flex align-items-center gap-3">
            <a href="/" target="_blank" rel="noreferrer" className="text-decoration-none text-secondary d-flex align-items-center gap-1">
              <Icon icon="solar:eye-outline" /> View site
            </a>
            <div className="position-relative">
              <button
                className="btn btn-light d-flex align-items-center gap-2"
                onClick={() => setMenuOpen((v) => !v)}
                onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
              >
                <span className="rounded-circle text-white d-grid" style={{ width: 32, height: 32, placeItems: "center", background: "#1ca8cb" }}>
                  {user?.name?.[0]?.toUpperCase() || "A"}
                </span>
                <span className="d-none d-md-inline fw-semibold">{user?.name}</span>
                <Icon icon="solar:alt-arrow-down-outline" />
              </button>
              {menuOpen && (
                <div
                  className="di-card p-2 position-absolute end-0 mt-1 shadow-sm"
                  style={{ minWidth: 220, zIndex: 1050 }}
                >
                  <div className="px-2 py-1 small text-muted">{user?.email}</div>
                  <div className="px-2 pb-2 small text-muted">Role: {user?.role}</div>
                  <hr className="my-1" />
                  <button className="btn btn-sm btn-outline-danger w-100" onMouseDown={handleLogout}>
                    <Icon icon="solar:logout-2-outline" className="me-1" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="di-content">{children}</main>
      </div>
    </div>
  );
}
