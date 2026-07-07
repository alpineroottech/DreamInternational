import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { publicApi, resolveAssetUrl } from '../../public-cms/hooks';
import SafeHtml from '../../public-cms/SafeHtml';
import Breadcrumb from '../BreadCrumb/Breadcrumb';

function DestinationDetailsMain() {
    const { id } = useParams();
    const [dest, setDest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) { setLoading(false); return; }
        let active = true;
        setLoading(true);
        publicApi.get(`/public/destinations/${id}`)
            .then(({ data }) => { if (active) setDest(data); })
            .catch(() => { if (active) setDest(null); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [id]);

    if (loading) {
        return (
            <section className="space">
                <div className="container">
                    <p className="text-muted">Loading destination…</p>
                </div>
            </section>
        );
    }

    if (!dest) {
        return (
            <section className="space">
                <div className="container text-center py-5">
                    <h3>Destination not found</h3>
                    <p className="text-muted mb-4">This destination may not be published yet or the URL is incorrect.</p>
                    <Link to="/destination" className="th-btn style3 th-icon">Browse Destinations</Link>
                </div>
            </section>
        );
    }

    const heroImg = resolveAssetUrl(dest.heroImageUrl) || resolveAssetUrl(dest.heroImage?.url);
    const galleryImages = Array.isArray(dest.galleryImages) && dest.galleryImages.length
        ? dest.galleryImages.map(g => typeof g === 'string' ? { url: resolveAssetUrl(g), alt: dest.name } : { url: resolveAssetUrl(g.url), alt: g.alt || dest.name })
        : [];
    const thingsToDo = Array.isArray(dest.thingsToDo) ? dest.thingsToDo : [];

    return (
        <>
        <Breadcrumb
            title={dest.name}
            pageKey="destination-details"
            parent={{ label: "Destinations", url: "/destination" }}
        />

        <section className="space">
            <div className="container">
                <div className="row gx-4">
                    {/* Main content */}
                    <div className="col-xxl-8 col-lg-7">
                        <div className="page-single">
                            {heroImg && (
                                <div className="service-img mb-4">
                                    <img
                                        src={heroImg}
                                        alt={dest.heroImageAlt || dest.name}
                                        style={{ width: '100%', borderRadius: 16, maxHeight: 420, objectFit: 'cover' }}
                                    />
                                </div>
                            )}

                            <div className="page-content d-block">
                                <div className="page-meta mb-3 d-flex align-items-center gap-3">
                                    <Link className="page-tag" to="/destination">Destination</Link>
                                    <span className="ratting">
                                        <i className="fa-sharp fa-solid fa-star text-warning" />
                                        <span className="ms-1">4.8</span>
                                    </span>
                                </div>

                                <h2 className="box-title mb-3">Explore {dest.name}</h2>

                                {/* Short description */}
                                {dest.shortDescription && (
                                    <p className="blog-text mb-4 lead">{dest.shortDescription}</p>
                                )}

                                {/* Full description */}
                                {dest.description && (
                                    <div className="mb-5">
                                        <SafeHtml html={dest.description} />
                                    </div>
                                )}

                                {/* Things to do / highlights */}
                                {thingsToDo.length > 0 && (
                                    <div className="mb-5">
                                        <h3 className="box-title mb-3">Top Experiences</h3>
                                        <div className="checklist">
                                            <ul>{thingsToDo.map((item, i) => <li key={i}>{item}</li>)}</ul>
                                        </div>
                                    </div>
                                )}

                                {/* Best time to visit */}
                                {dest.bestTimeToVisit && (
                                    <div className="mb-5">
                                        <h3 className="box-title mb-3">Best Time to Visit</h3>
                                        <SafeHtml html={dest.bestTimeToVisit} />
                                    </div>
                                )}

                                {/* Getting there */}
                                {dest.gettingThere && (
                                    <div className="mb-5">
                                        <h3 className="box-title mb-3">Getting There</h3>
                                        <SafeHtml html={dest.gettingThere} />
                                    </div>
                                )}

                                {/* Tips */}
                                {dest.tips && (
                                    <div className="mb-5">
                                        <h3 className="box-title mb-3">Travel Tips</h3>
                                        <SafeHtml html={dest.tips} />
                                    </div>
                                )}

                                {/* Gallery */}
                                {galleryImages.length > 0 && (
                                    <div className="mb-5">
                                        <h3 className="page-title mb-4">Gallery</h3>
                                        <div className="row gy-3 gx-3">
                                            {galleryImages.map((img, i) => (
                                                <div key={i} className="col-6 col-md-4">
                                                    <div className="gallery-box style3">
                                                        <div className="gallery-img global-img" style={{ borderRadius: 10, overflow: 'hidden', height: 180 }}>
                                                            <img
                                                                src={img.url}
                                                                alt={img.alt}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-xxl-4 col-lg-5">
                        <aside className="sidebar-area">
                            {/* Quick info widget */}
                            <div className="widget widget_offer mb-4" style={{ background: 'linear-gradient(135deg,#000f3d,#001a57)', borderRadius: 16, padding: '28px 24px' }}>
                                <h4 className="text-white mb-3">{dest.name}</h4>
                                {dest.price && (
                                    <p className="text-white mb-4">
                                        <strong>Package from:</strong><br />
                                        <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{dest.price}</span>
                                    </p>
                                )}
                                <Link
                                    to={`/contact?subject=Destination+enquiry&message=${encodeURIComponent(`I'd like more info about: ${dest.name}`)}`}
                                    className="th-btn th-btn-accent w-100 text-center d-block"
                                >
                                    Plan My Trip
                                </Link>
                                <Link to="/tour" className="th-btn style2 th-icon w-100 text-center d-block mt-3">
                                    View Tours
                                </Link>
                            </div>

                            {/* Help widget */}
                            <div className="widget widget_offer" style={{ background: 'url(/assets/img/bg/widget_bg_1.jpg)', borderRadius: 16, overflow: 'hidden' }}>
                                <div className="offer-banner p-4">
                                    <h6 className="box-title mb-2">Plan Your Visit</h6>
                                    <p className="small mb-3">
                                        Let our local experts craft the perfect itinerary for {dest.name}.
                                    </p>
                                    <Link to="/contact" className="th-btn style3 th-icon">Get in Touch</Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </section>
        </>
    );
}

export default DestinationDetailsMain;
