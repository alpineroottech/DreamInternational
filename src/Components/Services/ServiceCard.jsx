import React from 'react'
import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../../public-cms/hooks';

function ServiceCard(props) {
    const { serviceID, serviceImage, serviceTitle, serviceItem } = props;
    const src = serviceImage && (serviceImage.startsWith('/') || serviceImage.startsWith('http'))
        ? resolveAssetUrl(serviceImage)
        : `/assets/img/destination/${serviceImage}`;
    return (
            <div className="destination-item th-ani">
                <div className="destination-item_img global-img">
                    <img src={src} alt={serviceTitle || ''} />
                </div>
                <div className="destination-content">
                    <h3 className="box-title">
                        <Link to={`/service/${serviceID}`}>{serviceTitle ? serviceTitle : 'Photo Shoot'}</Link>
                    </h3>
                    <p className="destination-text">{serviceItem ? serviceItem : '20 Listing'}</p>
                    <Link to="/contact" className="th-btn style4 th-icon">
                        Book Now
                    </Link>
                </div>
            </div>
    )
}

export default ServiceCard
