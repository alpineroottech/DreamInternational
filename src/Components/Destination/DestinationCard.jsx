import React from 'react'
import { Link } from 'react-router-dom';

function formatPrice(price) {
    if (!price) return { amount: '$980.00', suffix: '/Person' };
    const lower = String(price).toLowerCase();
    if (lower.includes('per person') || lower.includes('/person') || lower.startsWith('from') || lower.includes('trek')) {
        return { amount: price, suffix: '' };
    }
    return { amount: price, suffix: '/Person' };
}

function DestinationCard(props) {
    const { destinationID, destinationImage, destinationTitle, destinationPrice, destinationSubtitle } = props;
    const imgSrc = destinationImage && (destinationImage.startsWith('/') || destinationImage.startsWith('http'))
        ? destinationImage
        : `/assets/img/tour/${destinationImage}`;
    const { amount, suffix } = formatPrice(destinationPrice);
    const link = `/destination/${destinationID}`;
    return (
        <>
            <div className="tour-box th-ani di-card-grid">
                <Link to={link} className="di-card-stretched-link" aria-hidden="true" tabIndex={-1} />
                <div className="tour-box_img global-img">
                    <img src={imgSrc} alt={destinationTitle || 'Destination'} loading="lazy" />
                </div>
                <div className="tour-content">
                    <h3 className="box-title">
                        <Link to={`/destination/${destinationID}`}>{destinationTitle ? destinationTitle : 'Dubai'}</Link>
                    </h3>
                    {destinationSubtitle && (
                        <p className="di-card-subtitle">{destinationSubtitle}</p>
                    )}
                    <h4 className="tour-box_price">
                        <span className="currency">{amount}</span>{suffix}
                    </h4>
                    <div className="tour-action">
                        <Link to={`/destination/${destinationID}`} className="th-btn style4 th-icon">
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DestinationCard
