import React from "react";
import { Link } from "react-router-dom";
import { useSettings, resolveAssetUrl } from "../../public-cms/hooks";

const FALLBACK_HERO = "/assets/img/hero/Hero2.jpg";

/**
 * Page hero / breadcrumb banner.
 *
 * Image resolution order:
 * 1. `bgImage` prop (item-specific, e.g. tour featured image)
 * 2. CMS `pageHeroes[pageKey]` (per-page image from Settings)
 * 3. CMS `defaultHeroImage` (site-wide default)
 * 4. Static fallback
 */
function Breadcrumb({ title, bgImage, pageKey, parent }) {
  const settings = useSettings();
  const pageHeroes =
    settings.pageHeroes && typeof settings.pageHeroes === "object" && !Array.isArray(settings.pageHeroes)
      ? settings.pageHeroes
      : {};

  const fromPage = pageKey ? pageHeroes[pageKey] : null;
  const image =
    resolveAssetUrl(bgImage) ||
    resolveAssetUrl(fromPage) ||
    resolveAssetUrl(settings.defaultHeroImage) ||
    FALLBACK_HERO;

  return (
    <div
      className="breadcumb-wrapper"
      style={{
        backgroundImage: `url(${image})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container">
        <div className="breadcumb-content">
          <h1 className="breadcumb-title">{title}</h1>
          <ul className="breadcumb-menu">
            <li>
              <Link to="/">Home</Link>
            </li>
            {parent?.label && parent?.url && (
              <li>
                <Link to={parent.url}>{parent.label}</Link>
              </li>
            )}
            <li>{title}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Breadcrumb;
