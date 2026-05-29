import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../admin/api/client";

const API_ORIGIN = (process.env.REACT_APP_API_URL || "http://localhost:4000/api").replace(/\/api$/, "");
function resolveUrl(url) {
  if (!url) return "/assets/img/hero/R.jpg";
  if (url.startsWith("http") || url.startsWith("/assets")) return url;
  if (url.startsWith("/uploads")) return `${API_ORIGIN}${url}`;
  return url;
}

function DestinationOne() {
  const [dest, setDest] = useState(null);

  // Pull the featured destination from the CMS; fall back to seeded Pokhara content.
  useEffect(() => {
    let active = true;
    api
      .get("/public/destinations", { params: { featured: true } })
      .then(({ data }) => {
        if (active && Array.isArray(data) && data.length) setDest(data[0]);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const name = dest?.name || "Pokhara City";
  const slug = dest?.slug || "pokhara-city";
  const image = resolveUrl(dest?.heroImage?.url);
  const summary =
    dest?.shortDescription ||
    "Nepal's lakeside city with Phewa Lake, mountain views, paragliding, and easy access to Annapurna treks.";

  return (
    <div className="position-relative overflow-hidden">
      <div className="container">
        <div className="title-area text-center">
          <span className="sub-title">Featured Destination</span>
          <h2 className="sec-title">{name}, Nepal</h2>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="destination-box">
              <div className="destination-img">
                <img src={image} alt={dest?.heroImage?.alt || name} />
              </div>
              <div className="destination-content p-4 p-md-5">
                <div className="media-left">
                  <h4 className="box-title mb-2">
                    <Link to={`/destination/${slug}`}>{name}</Link>
                  </h4>
                  <span className="destination-subtitle d-block mb-3">
                    3–5 Days | Lakeside Stay | Best Season: Mar–May, Sep–Nov
                  </span>
                  <p className="mb-4">{summary}</p>
                </div>
                <div>
                  <Link to={`/destination/${slug}`} className="th-btn style2 th-icon">
                    View Destination Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DestinationOne;
