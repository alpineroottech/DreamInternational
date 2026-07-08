import React from 'react'
import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../../public-cms/hooks';

function TourCard({ tourImage, tourTitle, tourPrice, tourLink, tourDuration, tourCategory, tourDifficulty, tourGroupSize }) {
    const src = tourImage && (tourImage.startsWith('/') || tourImage.startsWith('http'))
        ? resolveAssetUrl(tourImage)
        : `/assets/img/tour/${tourImage}`;
    const link = tourLink || '/tour-details';
    return (
        <div className="tour-box th-ani di-card-grid">
            <div className="tour-box_img global-img">
                <Link to={link}>
                    <img src={src} alt={tourTitle || 'Tour'} />
                </Link>
                {tourCategory && (
                    <span className="di-tour-tag">{tourCategory}</span>
                )}
            </div>
            <div className="tour-content">
                <h3 className="box-title">
                    <Link to={link}>{tourTitle || 'Nepal Tour Package'}</Link>
                </h3>
                <div className="tour-rating">
                    <div className="star-rating" role="img" aria-label="Rated 4.8 out of 5">
                        <span style={{ width: "96%" }}>
                            Rated <strong className="rating">4.8</strong> out of 5
                        </span>
                    </div>
                    <Link to={link} className="woocommerce-review-link">
                        (<span className="count">4.8</span> Rating)
                    </Link>
                </div>
                {(tourDifficulty || tourGroupSize) && (
                    <div className="di-card-meta">
                        {tourDifficulty && (
                            <span><i className="fa-light fa-gauge-simple-high" /> {tourDifficulty}</span>
                        )}
                        {tourGroupSize && (
                            <span><i className="fa-light fa-user-group" /> Up to {tourGroupSize}</span>
                        )}
                    </div>
                )}
                <h4 className="tour-box_price">
                    <span className="currency">{tourPrice || 'On request'}</span>
                    {tourPrice && tourPrice !== 'On request' && <span style={{ fontWeight: 400, fontSize: '0.85em' }}>/Person</span>}
                </h4>
                <div className="tour-action">
                    <span>
                        <i className="fa-light fa-clock" />
                        {tourDuration ? ` ${tourDuration} Days` : ' Custom'}
                    </span>
                    <Link to={link} className="th-btn style4">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default TourCard;
