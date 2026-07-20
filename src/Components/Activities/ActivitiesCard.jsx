import React from 'react'
import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../../public-cms/hooks';

function ActivitiesCard(props) {
    const { activitiesImage, activitiesTitle, activitiesLink, activitiesDuration } = props;
    const src = activitiesImage ? resolveAssetUrl(activitiesImage) : '';
    const link = activitiesLink || '/activities-details';

    return (
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
                    <Link to={link}>{activitiesTitle}</Link>
                </h3>
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
    );
}

export default ActivitiesCard;
