import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { publicApi, resolveAssetUrl } from "../../public-cms/hooks";

function DestinationOne({ data = {} }) {
  const [dest, setDest] = useState(null);

  // Pull the featured destination from the CMS; fall back to seeded Pokhara content.
  // If CMS section data provides a specific slug, load that destination.
  // Otherwise fall back to the first featured destination.
  const specificSlug = data.destinationSlug;

  useEffect(() => {
    let active = true;
    const req = specificSlug
      ? publicApi.get(`/public/destinations/${specificSlug}`)
      : publicApi.get("/public/destinations", { params: { featured: "true" } });

    req
      .then(({ data: payload }) => {
        if (!active) return;
        if (Array.isArray(payload)) {
          if (payload.length) setDest(payload[0]);
        } else {
          setDest(payload);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [specificSlug]);

  const name = dest?.name || "Pokhara City";
  const slug = dest?.slug || "pokhara-city";
  const image = resolveAssetUrl(dest?.heroImage?.url) || "/assets/img/destination/destination_4_1.jpg";
  const summary =
    dest?.shortDescription ||
    "Nepal's lakeside city with Phewa Lake, mountain views, paragliding, and easy access to Annapurna treks.";

  return (
    <div className="position-relative overflow-hidden">
      <div className="container">
        <div className="title-area text-center">
          <span className="sub-title">{data.subTitle || "Featured Destination"}</span>
          <h2 className="sec-title">{data.title || `${name}, Nepal`}</h2>
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
