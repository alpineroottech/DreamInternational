import React from 'react';
import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../../public-cms/hooks';

const TYPE_LABELS = {
    car: 'Car',
    jeep: 'Jeep / SUV',
    van: 'Van / Minibus',
    bus: 'Bus / Coach',
    'driver-only': 'Driver Only',
};

function priceLabel(rental) {
    if (rental.showPricing === false) return 'Enquire for price';
    const perDay = rental.pricePerDay;
    const perDayDriver = rental.pricePerDayDriver;
    if (!perDay && !perDayDriver) return 'Enquire for price';
    if (perDay) return `$${perDay}/day`;
    return `$${perDayDriver}/day (with driver)`;
}

function VehicleRentalCard({ rental }) {
    const src = resolveAssetUrl(rental.cardImageUrl || rental.featuredImageUrl);
    const link = `/vehicle-rentals/${rental.slug}`;
    return (
        <div className="tour-box th-ani di-card-grid">
            <Link to={link} className="di-card-stretched-link" aria-hidden="true" tabIndex={-1} />
            <div className="tour-box_img global-img">
                {src ? <img src={src} alt={rental.title} loading="lazy" /> : <div className="di-card-img-placeholder" />}
                <span className="di-vehicle-type-badge">{TYPE_LABELS[rental.vehicleType] || 'Vehicle'}</span>
            </div>
            <div className="tour-content">
                <h3 className="box-title di-vehicle-title">
                    <Link to={link}>{rental.title}</Link>
                </h3>
                <h4 className="tour-box_price di-vehicle-price">
                    <span className="currency">{priceLabel(rental)}</span>
                </h4>
                <div className="tour-action">
                    <span>
                        {rental.seatingCapacity ? (
                            <><i className="fa-light fa-users" />{rental.seatingCapacity} seats</>
                        ) : rental.vehicleType === 'driver-only' ? (
                            <><i className="fa-light fa-id-card" />Bring your own vehicle</>
                        ) : null}
                    </span>
                    <Link to={link} className="th-btn style4">
                        Detail View
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default VehicleRentalCard;
