import React from "react";
import { useCollection, resolveCmsList } from "../../public-cms/hooks";

const FALLBACK = [
  "Buddha Air",
  "Yeti Airlines",
  "Qatar Airways",
  "Emirates",
  "Singapore Airlines",
  "Turkish Airlines",
  "Nepal Airlines",
  "IndiGo",
].map((name) => ({ name, logoUrl: "" }));

function BrandOne({ className, data = {} }) {
  const cms = useCollection("/public/brands");
  const { loading, items: brands } = resolveCmsList(cms, FALLBACK);
  if (loading) return null;

  const names = brands
    .map((b) => (b.name || "").trim())
    .filter(Boolean);

  const track = names.length ? [...names, ...names] : FALLBACK.map((b) => b.name);

  return (
    <div className={`brand-area di-brand-marquee overflow-hidden ${className || ""}`}>
      <div className="container-fluid px-0">
        {(data.subTitle || data.title) && (
          <div className="container th-container">
            <div className="title-area text-center mb-20">
              {data.subTitle && <span className="sub-title">{data.subTitle}</span>}
              {data.title && <h2 className="sec-title">{data.title}</h2>}
            </div>
          </div>
        )}
        <div className="di-brand-marquee__viewport" aria-hidden={false}>
          <div className="di-brand-marquee__track">
            {track.map((name, index) => (
              <span key={`${name}-${index}`} className="di-brand-marquee__item">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrandOne;
