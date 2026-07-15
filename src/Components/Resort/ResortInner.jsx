import React from "react";
import { Link } from "react-router-dom";
import { useCollection, resolveAssetUrl, resolveCmsList } from "../../public-cms/hooks";

function ResortInner() {
  const cms = useCollection("/public/resorts");
  const { loading, items: resorts } = resolveCmsList(cms);

  if (loading) {
    return (
      <div className="space">
        <div className="container text-center py-5">
          <p className="mb-0">Loading resorts…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="title-area text-center pe-xl-4 ps-xl-4">
              <span className="sub-title">Best Resort For You</span>
              <h2 className="sec-title mb-20">Most Popular Resort</h2>
            </div>
          </div>
        </div>

        {resorts.length === 0 ? (
          <p className="text-muted text-center py-4">No resorts published yet. Please check back soon.</p>
        ) : (
          resorts.map((resort, index) => (
            <div className="row gx-60 gy-30 mb-60 align-items-center position-relative" key={resort.slug || resort.id}>
              <Link to={`/resort/${resort.slug}`} className="di-card-stretched-link" aria-hidden="true" tabIndex={-1} />
              <div className={`col-lg-6 ${index % 2 !== 0 ? "order-lg-4" : ""}`}>
                <div className="resort-image global-img">
                  <img src={resolveAssetUrl(resort.imageUrl) || "/assets/img/normal/resort_1_1.jpg"} alt={resort.imageAlt || resort.title} />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="resort-content">
                  <h3 className="box-title">
                    <Link to={`/resort/${resort.slug}`}>{resort.title}</Link>
                  </h3>
                  {resort.price && (
                    <h4 className="resort-price">
                      <span className="currency">From {resort.price}</span>/per Night
                    </h4>
                  )}
                  {resort.shortDescription && (
                    <p className="resort-text">{resort.shortDescription}</p>
                  )}
                  {(() => {
                    const amenities = Array.isArray(resort.amenities)
                      ? resort.amenities
                      : typeof resort.amenities === 'string' && resort.amenities.trim()
                        ? [resort.amenities.trim()]
                        : [];
                    return amenities.length > 0 && (
                      <div className="resort-list">
                        <ul>
                          {amenities.slice(0, 4).map((a, i) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })()}
                  <div className="resort-btn mt-40">
                    <Link to={`/resort/${resort.slug}`} className="th-btn style4 th-icon">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ResortInner;
