import React from 'react'
import { Link } from 'react-router-dom';

function ServiceCard(props) {
    const { serviceID, serviceTitle, serviceItem } = props;
    return (
        <div className="di-service-tile h-100">
            <h3 className="box-title">
                <Link to={`/service/${serviceID}`}>{serviceTitle || 'Service'}</Link>
            </h3>
            {serviceItem && <p className="di-service-tile__text">{serviceItem}</p>}
            <Link to="/contact" className="th-btn style4 th-icon mt-auto">
                Book Now
            </Link>
        </div>
    );
}

export default ServiceCard
