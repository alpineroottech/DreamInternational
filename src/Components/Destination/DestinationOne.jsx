import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { publicApi, resolveAssetUrl } from "../../public-cms/hooks";
import { tourDetailPath } from "../../lib/tourUrls";

function DestinationOne({ data = {} }) {
  const [tour, setTour] = useState(null);
  const specificSlug = data.tourSlug || data.destinationSlug;

  useEffect(() => {
    let active = true;
    const req = specificSlug
      ? publicApi.get(`/public/tours/${specificSlug}`)
      : publicApi.get("/public/tours", { params: { featured: "true", market: "international" } });

    req
      .then(({ data: payload }) => {
        if (!active) return;
        if (Array.isArray(payload)) {
          const match = payload.find((t) => t.market === "international") || payload[0];
          if (match) setTour(match);
        } else if (payload?.slug) {
          setTour(payload);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [specificSlug]);

  const title = tour?.title || "Thailand — Bangkok & Phuket Escape";
  const slug = tour?.slug || "thailand-bangkok-phuket";
  const image =
    resolveAssetUrl(tour?.cardImageUrl || tour?.featuredImageUrl) ||
    "/assets/img/destination/destination_4_2.jpg";
  const summary =
    tour?.shortDescription ||
    "Beach and city escapes from Kathmandu — Thailand, Dubai, Maldives, Bali, and more, with flights and hotels arranged for you.";

  const highlights = Array.isArray(tour?.highlights) ? tour.highlights : [];

  return (
    <section className="space" style={{ background: "var(--smoke-color, #f7f9fc)" }}>
      <div className="container">
        <div className="title-area text-center mb-40">
          <span className="sub-title">{data.subTitle || "Travel Abroad"}</span>
          <h2 className="sec-title">{data.title || "International Holidays"}</h2>
        </div>
        <div className="row g-4 align-items-start">
          <div className="col-lg-6">
            <div className="global-img rounded overflow-hidden" style={{ height: 420 }}>
              <img
                src={image}
                alt={title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <h3 className="sec-title mb-10">
              <Link to={tourDetailPath({ slug, market: "international" })}>{title}</Link>
            </h3>
            <p className="mb-20" style={{ lineHeight: 1.8 }}>{summary}</p>
            {highlights.length > 0 && (
              <>
                <h5 className="box-title mb-10">Package highlights</h5>
                <div className="checklist mb-20">
                  <ul>
                    {highlights.slice(0, 5).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
            <Link to={tourDetailPath({ slug, market: "international" })} className="th-btn th-icon me-3">
              View package
            </Link>
            <Link to="/international-holidays" className="th-btn style3 th-icon">
              All international holidays
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DestinationOne;
