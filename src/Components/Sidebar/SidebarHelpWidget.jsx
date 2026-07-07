import React from "react";
import { Link } from "react-router-dom";

export default function SidebarHelpWidget({ title = "Need Help? We Are Here To Help You" }) {
  return (
    <div className="widget widget_offer di-sidebar-help">
      <div className="offer-banner">
        <div className="offer">
          <h6 className="box-title">{title}</h6>
          <p className="small mb-3 opacity-90">Get online support from our travel team.</p>
          <Link to="/contact" className="th-btn th-btn-accent th-icon">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
