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
  // Duplicate for seamless marquee loop.
  const track = base.length ? [...base, ...base] : [];

  const durationSec = Math.max(18, Math.min(70, track.length * 2.2));
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
                {track.map((name, index) => (
                  <span key={`${name}-${index}`} className="di-brand-marquee__item">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrandOne;
