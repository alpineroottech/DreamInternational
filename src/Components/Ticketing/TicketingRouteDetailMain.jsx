import React from "react";
import { Link, useParams } from "react-router-dom";
import { useSlugItem, resolveAssetUrl, useSettings } from "../../public-cms/hooks";
import SafeHtml from "../../public-cms/SafeHtml";
import FlightBookingForm from "./FlightBookingForm";
import "./ticketing.css";

export default function TicketingRouteDetailMain({ ticketType, listingLabel, listingUrl }) {
  const { slug } = useParams();
  const { data: route, loading, notFound } = useSlugItem("/public/flight-routes", slug);
  const settings = useSettings();

  if (loading) {
    return (
      <section className="space">
        <div className="container text-center py-5">
          <p className="text-muted">Loading flight details…</p>
        </div>
      </section>
    );
  }

  if (notFound || !route) {
    return (
      <section className="space">
        <div className="container ticketing-empty">
          <i className="fa-light fa-plane-slash" />
          <h3>Route not found</h3>
          <p>This flight route may have been removed or is not published yet.</p>
          <Link to={listingUrl} className="th-btn style3">Back to {listingLabel}</Link>
        </div>
      </section>
    );
  }

  const image = resolveAssetUrl(route.imageUrl);
  const price = route.priceDisplay || (route.priceFrom ? `From $${route.priceFrom}` : "On request");
  const highlights = Array.isArray(route.highlights) ? route.highlights : [];
  const whatsapp = settings.whatsappNumber || settings.contactPhone;

  return (
    <section className="space">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-8">
            <div className={`ticketing-detail-hero${image ? "" : " ticketing-detail-hero--no-image"}`}>
              {image && <img src={image} alt={route.imageAlt || route.title} />}
              <div className="ticketing-detail-hero__overlay">
                <div className="ticketing-card__route ticketing-card__route--lg">
                  <div className="ticketing-card__city">
                    <span className="code">{route.fromAirport || route.fromCity?.slice(0, 3).toUpperCase()}</span>
                    <strong>{route.fromCity}</strong>
                  </div>
                  <div className="ticketing-card__arrow"><i className="fa-regular fa-plane" /></div>
                  <div className="ticketing-card__city ticketing-card__city--to">
                    <span className="code">{route.toAirport || route.toCity?.slice(0, 3).toUpperCase()}</span>
                    <strong>{route.toCity}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="ticketing-detail-content mt-4">
              <h2>{route.title}</h2>
              {route.shortDescription && <p className="lead">{route.shortDescription}</p>}
              {route.description && <SafeHtml html={route.description} />}

              {highlights.length > 0 && (
                <div className="ticketing-highlights mt-4">
                  <h4>Route highlights</h4>
                  <ul>
                    {highlights.map((item) => (
                      <li key={item}><i className="fa-solid fa-circle-check" /> {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {route.baggageInfo && (
                <div className="ticketing-info-box mt-4">
                  <h4><i className="fa-light fa-suitcase" /> Baggage information</h4>
                  <p>{route.baggageInfo}</p>
                </div>
              )}

              {route.bookingNotes && (
                <div className="ticketing-info-box mt-4">
                  <h4><i className="fa-light fa-circle-info" /> Booking notes</h4>
                  <SafeHtml html={route.bookingNotes} />
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <aside className="ticketing-sidebar">
              <div className="ticketing-sidebar__price">
                <span>Starting fare</span>
                <strong>{price}</strong>
              </div>
              <ul className="ticketing-sidebar__facts">
                {route.airline && <li><span>Airline</span><strong>{route.airline}</strong></li>}
                {route.flightDuration && <li><span>Duration</span><strong>{route.flightDuration}</strong></li>}
                {route.frequency && <li><span>Frequency</span><strong>{route.frequency}</strong></li>}
                <li><span>Type</span><strong>{ticketType === "domestic" ? "Domestic" : "International"}</strong></li>
              </ul>
              {whatsapp && (
                <a
                  href={`https://wa.me/${String(whatsapp).replace(/\D/g, "")}?text=${encodeURIComponent(`Hello, I need a quote for ${route.title}.`)}`}
                  className="th-btn style2 th-icon w-100 mt-3"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa-brands fa-whatsapp me-2" />WhatsApp Us
                </a>
              )}
              <Link to={listingUrl} className="ticketing-back-link mt-4 d-inline-block">
                ← Back to {listingLabel}
              </Link>
            </aside>

            {/* Inline booking form */}
            <div className="mt-4">
              <FlightBookingForm
                ticketType={ticketType}
                routeTitle={route.title}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
