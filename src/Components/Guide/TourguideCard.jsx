import React from 'react'
import { Link } from 'react-router-dom'
import { resolveAssetUrl } from '../../public-cms/hooks'

function TourguideCard(props) {
    const { guideID, guideThumb, guideImage, guideTitle, guideRole, guideSocials } = props;
    const resolve = (img, fallback) =>
        img && (img.startsWith('/') || img.startsWith('http')) ? resolveAssetUrl(img) : `/assets/img/team/${img || fallback}`;
    const socials = guideSocials || {};
    const socialLinks = [
        { key: 'facebook', icon: 'fab fa-facebook-f' },
        { key: 'twitter', icon: 'fab fa-twitter' },
        { key: 'linkedin', icon: 'fab fa-linkedin-in' },
        { key: 'youtube', icon: 'fab fa-youtube' },
        { key: 'instagram', icon: 'fab fa-instagram' },
    ];
    const link = `/tour-guide/${guideID}`;
    return (
        <div className="th-team team-grid">
            <Link to={link} className="di-card-stretched-link" aria-hidden="true" tabIndex={-1} />
            <div className="team-img">
                <img src={resolve(guideThumb, 'team_1_1.jpg')} alt="Team" />
            </div>
            <div className="team-img2">
                <img src={resolve(guideImage, 'team_1_1.jpg')} alt="Team" />
            </div>
            <div className="team-content">
                <div className="media-body">
                    <h3 className="box-title">
                        <Link to={link}>{guideTitle ? guideTitle : 'Michel Smith'}</Link>
                    </h3>
                    <span className="team-desig">{guideRole || 'Tourist Guide'}</span>
                    <div className="th-social">
                        {socialLinks.map((s) => (
                            <Link key={s.key} target="_blank" rel="noopener noreferrer" to={socials[s.key] || `https://${s.key}.com/`}>
                                <i className={s.icon} />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TourguideCard
