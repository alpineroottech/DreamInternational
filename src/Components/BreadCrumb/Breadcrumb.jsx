import React from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../../public-cms/hooks";
import { heroBannerStyle, resolveHeroColor, isHeroEnabled } from "../../brand/heroColors";

/**
 * Page hero / breadcrumb banner — solid CMS-pickable color per page.
 * Item card images (tours, destinations, etc.) are not used here.
 * Can be disabled per page from CMS → Settings → Page hero banners.
 */
function Breadcrumb({ title, pageKey, parent }) {
  const settings = useSettings();
  const color = resolveHeroColor(pageKey, settings);

  if (!isHeroEnabled(pageKey, settings)) {
    return <div className="di-page-without-hero" aria-hidden="true" />;
  }

  return (
    <div
      className="breadcumb-wrapper breadcumb-wrapper--solid"
      style={heroBannerStyle(color)}
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
