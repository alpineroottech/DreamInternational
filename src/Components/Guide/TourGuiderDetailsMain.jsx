import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSlugItem, resolveAssetUrl } from '../../public-cms/hooks';
import SafeHtml from '../../public-cms/SafeHtml';

function TourGuiderDetailsMain() {
    const { id } = useParams();
    const { data: guide, loading, notFound } = useSlugItem('/public/team', id);

    if (loading) {
        return (
            <section className="space">
                <div className="container text-center py-5">
                    <p className="text-muted mb-0">Loading team member…</p>
                </div>
            </section>
        );
    }

    if (notFound || !guide) {
        return (
            <section className="space">
                <div className="container text-center py-5">
                    <h3>Team member not found</h3>
                    <p className="text-muted mb-4">This profile may have been removed or is not published yet.</p>
                    <Link to="/tour-guide" className="th-btn style3 th-icon">Back to Our Team</Link>
                </div>
            </section>
        );
    }

    const photo = resolveAssetUrl(guide.photoUrl);
    const expertise = Array.isArray(guide.expertise) ? guide.expertise : [];
    const socials = guide.socials || {};
    const socialLinks = [
        { key: 'facebook', icon: 'fab fa-facebook-f' },
        { key: 'twitter', icon: 'fab fa-twitter' },
        { key: 'linkedin', icon: 'fab fa-linkedin-in' },
        { key: 'youtube', icon: 'fab fa-youtube' },
        { key: 'instagram', icon: 'fab fa-instagram' },
    ];

    return (
        <section className="space">
            <div className="container">
                <div className="team-details">
                    <div className="row gy-5 mb-3 mb-xl-5 pb-xl-4">
                        <div className="col-xl-4">
                            <div className="th-team team-grid">
                                {photo && (
                                    <div className="team-img">
                                        <img src={photo} alt={guide.name} />
                                    </div>
                                )}
                                <div className="team-content">
                                    <div className="media-body">
                                        <h3 className="box-title">
                                            <Link to="#">{guide.name}</Link>
                                        </h3>
                                        <span className="team-desig">{guide.role || 'Tourist Guide'}</span>
                                        <div className="th-social">
                                            {socialLinks.map((s) => (
                                                socials[s.key] && (
                                                    <Link key={s.key} target="_blank" rel="noopener noreferrer" to={socials[s.key]}>
                                                        <i className={s.icon} />
                                                    </Link>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-8 ps-3 ps-xl-5 pe-xl-4">
                            <div className="team-about">
                                <h2 className="team-about_title">About {guide.name}</h2>
                                {guide.bio && <SafeHtml className="team-about_text mb-25" html={guide.bio} />}
                                {expertise.length > 0 && (
                                    <>
                                        <h5 className="box-title">Areas of Expertise</h5>
                                        <div className="checklist mb-25">
                                            <ul>
                                                {expertise.map((e, i) => (
                                                    <li key={i}>{e}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <Link
                            to={`/contact?subject=Guide+enquiry&message=${encodeURIComponent(`I'd like to enquire about a trip with ${guide.name}.`)}`}
                            className="th-btn th-icon"
                        >
                            Contact About This Guide
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TourGuiderDetailsMain
