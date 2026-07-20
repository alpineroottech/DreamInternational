import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCollection, useSection, useSettings } from "../../public-cms/hooks";
import { heroBannerStyle, resolveHeroColor } from "../../brand/heroColors";
import TicketingRouteCard from "./TicketingRouteCard";
import FlightBookingForm from "./FlightBookingForm";
import "./ticketing.css";

export default function TicketingListing({ ticketType, pageKey, breadcrumbTitle, siblingLabel, siblingUrl }) {
  const section = useSection(pageKey, "page");
  const settings = useSettings();
  const cms = useCollection("/public/flight-routes", { ticketType });
  const settingsHeroKey =
    ticketType === "international" ? "ticketing-international" : "ticketing-domestic";
  const heroColor = resolveHeroColor(settingsHeroKey, settings);
  const [query, setQuery] = useState("");

  const routes = useMemo(() => {
    if (cms === undefined) return [];
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

  if (section === undefined) {
    return (
      <section className="space">
        <div className="container text-center py-5">
          <p className="text-muted mb-0">Loading flight routes…</p>
        </div>
      </section>
    );
  }

  const hero = section || {};

  const scrollToEnquiry = () => {
    const el = document.getElementById("enquiry-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const featured = routes.filter((r) => r.isFeatured);
  const regular = routes.filter((r) => !r.isFeatured);

  return (
    <>
      <section
        className="ticketing-hero ticketing-hero--solid"
        style={heroBannerStyle(heroColor)}
      >
        <div className="container">
          <div className="ticketing-hero__content">
            <span className="ticketing-hero__eyebrow">{hero.subTitle}</span>
            <h1>{hero.title}</h1>
            <p>{hero.intro}</p>
            <div className="ticketing-hero__actions">
              <button
                type="button"
                className="th-btn th-btn-accent"
                onClick={scrollToEnquiry}
              >
                Request a Quote
              </button>
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
              <Link to="/contact" className="th-btn style3">Contact us for a quote</Link>
            </div>
          )}
        </div>
      </section>

      <section className="space-bottom" id="enquiry-form">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-4">
                <span className="sub-title style1">Quick Enquiry</span>
                <h2 className="sec-title">Request a Flight Quote</h2>
                <p className="sec-text">
                  Fill in the details below and our ticketing team will respond within 24 hours
                  with available options for your route.
                </p>
              </div>
              <FlightBookingForm ticketType={ticketType} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
