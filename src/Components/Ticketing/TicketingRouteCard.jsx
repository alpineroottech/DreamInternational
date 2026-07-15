import React from "react";
import { Link } from "react-router-dom";
import { resolveAssetUrl } from "../../public-cms/hooks";

export default function TicketingRouteCard({ route, ticketType }) {
  const price = route.priceDisplay || (route.priceFrom ? `From $${route.priceFrom}` : "On request");
  const image = resolveAssetUrl(route.cardImageUrl || route.imageUrl) || "/assets/img/destination/destination_4_1.jpg";
  const detailUrl = `/ticketing/${ticketType}/${route.slug}`;

  return (
    <div className="col-md-6 col-xl-4">
      <article className="ticketing-card">
        <Link to={detailUrl} className="di-card-stretched-link" aria-hidden="true" tabIndex={-1} />
        <Link to={detailUrl} className="ticketing-card__media">
          <img src={image} alt={route.imageAlt || route.title} loading="lazy" />
          {route.isFeatured && <span className="ticketing-card__badge">Popular</span>}
        </Link>
        <div className="ticketing-card__body">
          <div className="ticketing-card__route">
            <div className="ticketing-card__city">
              <span className="code">{route.fromAirport || route.fromCity?.slice(0, 3).toUpperCase()}</span>
              <strong>{route.fromCity}</strong>
            </div>
            <div className="ticketing-card__arrow" aria-hidden="true">
              <i className="fa-regular fa-plane" />
            </div>
            <div className="ticketing-card__city ticketing-card__city--to">
              <span className="code">{route.toAirport || route.toCity?.slice(0, 3).toUpperCase()}</span>
              <strong>{route.toCity}</strong>
            </div>
          </div>
          <h3 className="ticketing-card__title">
            <Link to={detailUrl}>{route.title}</Link>
          </h3>
          {route.shortDescription && <p className="ticketing-card__desc">{route.shortDescription}</p>}
          <ul className="ticketing-card__meta">
            {route.airline && <li><i className="fa-light fa-building" /> {route.airline}</li>}
            {route.flightDuration && <li><i className="fa-light fa-clock" /> {route.flightDuration}</li>}
            {route.frequency && <li><i className="fa-light fa-calendar" /> {route.frequency}</li>}
          </ul>
          <div className="ticketing-card__footer">
            <span className="ticketing-card__price">{price}</span>
            <Link to={detailUrl} className="th-btn style4 th-icon">
              View Details
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
