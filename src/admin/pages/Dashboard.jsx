import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ destinations: 0, media: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [dest, media] = await Promise.all([
          api.get("/admin/destinations"),
          api.get("/admin/media"),
        ]);
        setStats({
          destinations: dest.data.length,
          media: media.data.length,
        });
      } catch {
        /* handled by interceptor */
      }
    })();
  }, []);

  const tiles = [
    { label: "Destinations", value: stats.destinations, icon: "solar:map-point-outline", to: "/admin/destinations" },
    { label: "Media assets", value: stats.media, icon: "solar:gallery-outline", to: "/admin/media" },
    { label: "Tours", value: "—", icon: "solar:mountains-outline", to: "/admin/destinations" },
    { label: "Inquiries", value: "—", icon: "solar:inbox-outline", to: "/admin/destinations" },
  ];

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Welcome back, {user?.name?.split(" ")[0]} 👋</h4>
        <p className="text-muted mb-0">Here's an overview of your website content.</p>
      </div>

      <div className="row g-3 mb-4">
        {tiles.map((t) => (
          <div className="col-sm-6 col-xl-3" key={t.label}>
            <Link to={t.to} className="text-decoration-none">
              <div className="di-stat d-flex align-items-center justify-content-between">
                <div>
                  <div className="di-stat__value">{t.value}</div>
                  <div className="di-stat__label">{t.label}</div>
                </div>
                <div className="di-stat__icon">
                  <Icon icon={t.icon} />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="di-card p-4">
        <h6 className="fw-bold mb-3">Quick actions</h6>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/admin/destinations/new" className="btn di-btn-primary">
            <Icon icon="solar:add-circle-outline" className="me-1" /> New destination
          </Link>
          <Link to="/admin/media" className="btn btn-outline-secondary">
            <Icon icon="solar:upload-outline" className="me-1" /> Upload media
          </Link>
          <Link to="/admin/settings" className="btn btn-outline-secondary">
            <Icon icon="solar:settings-outline" className="me-1" /> Edit settings
          </Link>
        </div>
      </div>
    </div>
  );
}
