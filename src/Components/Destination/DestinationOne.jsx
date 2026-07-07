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
      : publicApi.get("/public/tours", { params: { featured: "true", market: "nepal" } });

    req
      .then(({ data: payload }) => {
        if (!active) return;
        if (Array.isArray(payload)) {
          // Ensure homepage picks exactly ONE deterministic featured item.
          const sorted = [...payload].sort((a, b) => {
            const ap = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
            const bp = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
            if (bp !== ap) return bp - ap;
            const au = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
            const bu = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
            return bu - au;
          });
          if (sorted[0]) setTour(sorted[0]);
        } else if (payload?.slug) {
          // Only render Nepal market items in the "featured destination" slot.
          if (!payload.market || payload.market === "nepal") setTour(payload);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [specificSlug]);

  const title = tour?.title || "Everest Base Camp Trek";
  const slug = tour?.slug || "everest-base-camp-trek";
  const image =
    resolveAssetUrl(tour?.cardImageUrl || tour?.featuredImageUrl) ||
    "/assets/img/destination/destination_4_2.jpg";
  const summary =
    tour?.shortDescription ||
    "Classic Nepal trekking adventure from Kathmandu — explore iconic routes with licensed guides, permits, and full support.";

  const highlights = Array.isArray(tour?.highlights) ? tour.highlights : [];

  return (
    <section className="space di-featured-destination" style={{ background: "#ffffff" }}>
      <div className="container">
        <div className="title-area text-center mb-40">
          <span className="sub-title">{data.subTitle || "Nepal Experiences"}</span>
          <h2 className="sec-title">{data.title || "Featured Nepal Experience"}</h2>
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
              <Link to={tourDetailPath({ slug, market: "nepal" })}>{title}</Link>
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
            <Link to={tourDetailPath({ slug, market: "nepal" })} className="th-btn th-icon me-3">
              View tour
            </Link>
            <Link to="/tour" className="th-btn style3 th-icon">
              Explore Nepal tours
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DestinationOne;
