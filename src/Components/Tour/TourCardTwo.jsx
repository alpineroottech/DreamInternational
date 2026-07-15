import React from 'react'
import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../../public-cms/hooks';

function TourCardTwo(props) {
    const { tourImage, tourTitle, tourPrice, tourLink } = props;
    const src = tourImage && (tourImage.startsWith('/') || tourImage.startsWith('http'))
        ? resolveAssetUrl(tourImage)
        : `/assets/img/tour/${tourImage}`;
    const link = tourLink || '/tour-details';
    return (
        <div className="tour-box style-flex th-ani">
            <Link to={link} className="di-card-stretched-link" aria-hidden="true" tabIndex={-1} />
            <div className="tour-box_img global-img">
                <img src={src} alt={tourTitle || ''} />
            </div>
            <div className="tour-content">
                <h3 className="box-title">
                   <Link to={link}>{tourTitle ? tourTitle : 'Greece Tour Package'}</Link>
                </h3>
                <div className="tour-rating">
                    <div
                        className="star-rating"
                        role="img"
                        aria-label="Rated 5.00 out of 5"
                    >
                        <span style={{ width: "100%" }}>
                            Rated
                            <strong className="rating">5.00</strong> out of 5
                            based on <span className="rating">4.8</span>(4.8
                            Rating)
                        </span>
                    </div>
                    <Link
                        to={link}
                        className="woocommerce-review-link"
                    >
                        (<span className="count">4.8</span>
                        Rating)
                    </Link>
                </div>
                <h4 className="tour-box_price">
                    <span className="currency">{tourPrice ? tourPrice : '$980.00'}</span>/Person
                </h4>
                <div className="tour-action">
                    <span>
                        <i className="fa-light fa-clock" />7 Days
                    </span>
                    <Link to={link} className="th-btn style4">
                        Detail View
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default TourCardTwo
