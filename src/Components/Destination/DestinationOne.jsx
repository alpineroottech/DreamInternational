import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  useCollection,
  useSlugItem,
  resolveAssetUrl,
} from "../../public-cms/hooks";
import { tourDetailPath } from "../../lib/tourUrls";

function DestinationOne({ data = {} }) {
  const specificSlug = data.tourSlug || data.destinationSlug;
  const { data: slugTour, loading: slugLoading } = useSlugItem(
    "/public/tours",
    specificSlug || null,
  );
  const cms = useCollection("/public/tours", {
    featured: true,
    market: "nepal",
  });

  const tour = useMemo(() => {
    if (specificSlug) {
      if (slugLoading) return null;
      if (slugTour?.slug && (!slugTour.market || slugTour.market === "nepal")) {
        return slugTour;
      }
      return null;
    }
    if (cms === undefined) return null;
    if (!Array.isArray(cms) || !cms.length) return null;
    const sorted = [...cms].sort((a, b) => {
      const ap = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bp = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      if (bp !== ap) return bp - ap;
      const au = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bu = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bu - au;
    });
    return sorted[0] || null;
  }, [specificSlug, slugTour, slugLoading, cms]);

  if ((specificSlug && slugLoading) || (!specificSlug && cms === undefined)) {
    return null;
  }

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
    <section
      className="space di-featured-destination"
      style={{ background: "#ffffff" }}
    >
      <div className="container">
        <div className="title-area text-center mb-40">
          <span className="sub-title">
            {data.subTitle || "Nepal Experiences"}
          </span>
          <h2 className="sec-title">
            {data.title || "Featured Nepal Experience"}
          </h2>
        </div>
        <div className="row g-4 align-items-start">
          <div className="col-lg-6">
            <div
              className="global-img rounded overflow-hidden"
              style={{ height: 420 }}
            >
              <img
                src={image}
                alt={title}
                width="600"
                height="420"
                loading="lazy"
                decoding="async"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <h3 className="sec-title mb-10">
              <Link to={tourDetailPath({ slug, market: "nepal" })}>
                {title}
              </Link>
            </h3>
            <p className="mb-20" style={{ lineHeight: 1.8 }}>
              {summary}
            </p>
            {highlights.length > 0 && (
              <>
                <h4 className="box-title mb-10">Package highlights</h4>
                <div className="checklist mb-20">
                  <ul>
                    {highlights.slice(0, 5).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
            <div className="d-flex flex-wrap gap-3">
              <Link
                to={tourDetailPath({ slug, market: "nepal" })}
                className="th-btn th-icon"
              >
                View tour
              </Link>
              <Link to="/tour" className="th-btn style3 th-icon">
                Explore Nepal tours
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DestinationOne;
