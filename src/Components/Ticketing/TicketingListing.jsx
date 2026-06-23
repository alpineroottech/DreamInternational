import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCollection, useSection, resolveAssetUrl } from "../../public-cms/hooks";
import TicketingRouteCard from "./TicketingRouteCard";
import "./ticketing.css";

const DEFAULTS = {
  domestic: {
    subTitle: "Domestic Flights",
    title: "Nepal Domestic Air Tickets",
    intro: "Book flights across Nepal with competitive fares on major routes — Pokhara, Lukla, Bharatpur, and more.",
    heroImage: "/assets/img/hero/Hero2.jpg",
    trustBadges: ["Licensed Travel Agency", "Instant Confirmation", "24/7 Support"],
  },
  international: {
    subTitle: "International Flights",
    title: "International Air Tickets from Nepal",
    intro: "Fly from Kathmandu to Delhi, Dubai, Doha, Bangkok, and other global hubs with trusted airline partners.",
    heroImage: "/assets/img/bg/breadcumb-bg.jpg",
    trustBadges: ["Best Fare Search", "Multi-airline Options", "Visa & Travel Support"],
  },
};

export default function TicketingListing({ ticketType, pageKey, breadcrumbTitle, siblingLabel, siblingUrl }) {
  const section = useSection(pageKey, "page");
  const cms = useCollection("/public/flight-routes", { ticketType });
  const defaults = DEFAULTS[ticketType];
  const hero = { ...defaults, ...(section || {}) };
  const [query, setQuery] = useState("");

  const routes = useMemo(() => {
    const list = Array.isArray(cms) ? cms : [];
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(
      (r) =>
        r.title?.toLowerCase().includes(q) ||
        r.fromCity?.toLowerCase().includes(q) ||
        r.toCity?.toLowerCase().includes(q) ||
        r.airline?.toLowerCase().includes(q)
    );
  }, [cms, query]);

  const featured = routes.filter((r) => r.isFeatured);
  const regular = routes.filter((r) => !r.isFeatured);

  return (
    <>
      <section
        className="ticketing-hero"
        style={{ backgroundImage: `url(${resolveAssetUrl(hero.heroImage) || hero.heroImage})` }}
      >
        <div className="container">
          <div className="ticketing-hero__content">
            <span className="ticketing-hero__eyebrow">{hero.subTitle}</span>
            <h1>{hero.title}</h1>
            <p>{hero.intro}</p>
            <div className="ticketing-hero__actions">
              <Link to="/contact" className="th-btn style3 th-icon">Request a Quote</Link>
              {siblingUrl && (
                <Link to={siblingUrl} className="th-btn style2 th-icon">{siblingLabel}</Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {(hero.trustBadges || []).length > 0 && (
        <section className="ticketing-trust">
          <div className="container">
            <ul>
              {hero.trustBadges.map((badge) => (
                <li key={badge}><i className="fa-solid fa-circle-check" /> {badge}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="space">
        <div className="container">
          <div className="ticketing-toolbar">
            <div>
              <h2 className="ticketing-section-title">{breadcrumbTitle} Routes</h2>
              <p className="text-muted mb-0">
                {routes.length} route{routes.length === 1 ? "" : "s"} available
              </p>
            </div>
            <form className="search-form-area" onSubmit={(e) => e.preventDefault()}>
              <div className="search-form">
                <input
                  type="text"
                  placeholder="Search city, route, or airline…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" aria-label="Search">
                  <i className="fa-light fa-magnifying-glass" />
                </button>
              </div>
            </form>
          </div>

          {featured.length > 0 && (
            <>
              <h3 className="ticketing-subheading">Popular routes</h3>
              <div className="row gy-4">
                {featured.map((route) => (
                  <TicketingRouteCard key={route.id || route.slug} route={route} ticketType={ticketType} />
                ))}
              </div>
            </>
          )}

          {regular.length > 0 && (
            <>
              {featured.length > 0 && <h3 className="ticketing-subheading mt-5">All routes</h3>}
              <div className="row gy-4">
                {regular.map((route) => (
                  <TicketingRouteCard key={route.id || route.slug} route={route} ticketType={ticketType} />
                ))}
              </div>
            </>
          )}

          {routes.length === 0 && (
            <div className="ticketing-empty">
              <i className="fa-light fa-plane-slash" />
              <h3>No routes published yet</h3>
              <p>Flight routes will appear here once added in the CMS.</p>
              <Link to="/contact" className="th-btn style3">Contact us for fares</Link>
            </div>
          )}
        </div>
      </section>

      <section className="ticketing-cta space-bottom">
        <div className="container">
          <div className="ticketing-cta__box">
            <div>
              <h3>Need group fares or flexible dates?</h3>
              <p>Our ticketing team can search multiple airlines and share the best options for your travel dates.</p>
            </div>
            <Link to="/contact" className="th-btn style3 th-icon">Get Flight Quote</Link>
          </div>
        </div>
      </section>
    </>
  );
}
