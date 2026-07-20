import React from 'react'
import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../../public-cms/hooks';

function formatPrice(price) {
    if (!price) return { amount: 'On request', suffix: '' };
    const lower = String(price).toLowerCase();
    if (lower.includes('per person') || lower.includes('/person') || lower.startsWith('from') || lower.includes('npr')) {
        return { amount: price, suffix: '' };
    }
    return { amount: price, suffix: '/Person' };
}

function ActivitiesCard(props) {
    const { activitiesImage, activitiesTitle, activitiesPrice, activitiesLink, activitiesDuration } = props;
    const src = activitiesImage ? resolveAssetUrl(activitiesImage) : '';
    const link = activitiesLink || '/activities-details';
    const { amount, suffix } = formatPrice(activitiesPrice);
    return (
        <>
            <div className="tour-box th-ani di-card-grid">
                <Link to={link} className="di-card-stretched-link" aria-hidden="true" tabIndex={-1} />
                <div className="tour-box_img global-img">
                    {src ? (
                        <img src={src} alt={activitiesTitle || ''} loading="lazy" />
                    ) : (
                        <div className="di-card-img-placeholder" aria-hidden="true" />
                    )}
                </div>
                <div className="tour-content">
                    <h3 className="box-title">
                        <Link to={link}>{activitiesTitle ? activitiesTitle : 'Paragliding'}</Link>
                    </h3>
                    <h4 className="tour-box_price">
                        <span className="currency">{amount}</span>{suffix}
                    </h4>
                    <div className="tour-action">
                        {activitiesDuration && (
                            <span>
                                <i className="fa-light fa-clock" />{activitiesDuration}
                            </span>
                        )}
                        <Link to={link} className="th-btn style4">
                            Detail View
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ActivitiesCard

