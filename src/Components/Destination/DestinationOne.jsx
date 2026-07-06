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
  const image = resolveAssetUrl(dest?.cardImage?.url || dest?.heroImage?.url) || "/assets/img/destination/destination_4_1.jpg";
  const summary =
    dest?.shortDescription ||
    "Nepal's lakeside city with Phewa Lake, mountain views, paragliding, and easy access to Annapurna treks.";

  const thingsToDo = Array.isArray(dest?.thingsToDo) ? dest.thingsToDo : [];

  return (
    <section className="space" style={{ background: "var(--smoke-color, #f7f9fc)" }}>
      <div className="container">
        <div className="title-area text-center mb-40">
          <span className="sub-title">{data.subTitle || "Featured Destination"}</span>
          <h2 className="sec-title">{data.title || `${name}, Nepal`}</h2>
        </div>
        <div className="row g-4 align-items-start">
          <div className="col-lg-6">
            <div className="global-img rounded overflow-hidden" style={{ height: 420 }}>
              <img
                src={image}
                alt={dest?.heroImage?.alt || name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <h3 className="sec-title mb-10">
              <Link to={`/destination/${slug}`}>{name}</Link>
            </h3>
            <p className="mb-20" style={{ lineHeight: 1.8 }}>{summary}</p>
            {thingsToDo.length > 0 && (
              <>
                <h5 className="box-title mb-10">Things to Do</h5>
                <div className="checklist mb-20">
                  <ul>
                    {thingsToDo.slice(0, 5).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
            <Link to={`/destination/${slug}`} className="th-btn th-icon">
              Explore {name}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DestinationOne;
