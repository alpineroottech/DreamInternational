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

  const base = names.length ? names : FALLBACK.map((b) => b.name);
  if (!base.length) return null;

  const renderGroup = (suffix) =>
    base.map((name) => (
      <span key={`${name}-${suffix}`} className="di-brand-marquee__item">
        {name}
      </span>
    ));

  const durationSec = Math.max(22, Math.min(80, base.length * 3.5));
  const ariaLabel = data.title || data.subTitle || "Partner brands";

  return (
    <div className={`brand-area di-brand-marquee overflow-hidden ${className || ""}`}>
      <div className="container-fluid px-0">
        <div className="container th-container">
          <div className="di-brand-marquee__row" aria-label={ariaLabel} role="region">
            <span className="di-brand-marquee__label">
              {data.subTitle || data.title || "Recognised by"}
            </span>

            <div className="di-brand-marquee__viewport">
              <div
                className="di-brand-marquee__track"
                style={{ animationDuration: `${durationSec}s` }}
              >
                <div className="di-brand-marquee__group" aria-hidden="false">
                  {renderGroup("a")}
                </div>
                <div className="di-brand-marquee__group" aria-hidden="true">
                  {renderGroup("b")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrandOne;
