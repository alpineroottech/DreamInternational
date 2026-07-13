import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSlugItem, resolveAssetUrl } from '../../public-cms/hooks';
import SafeHtml from '../../public-cms/SafeHtml';
import { BRAND_NAME, LOGO_FULL } from '../../brand/brandAssets';

function ServiceDetailsMain() {
    const { id } = useParams();
    const { data: service, loading, notFound } = useSlugItem('/public/services', id);

    if (loading) {
        return (
            <section className="space">
                <div className="container text-center py-5">
                    <p className="text-muted mb-0">Loading service…</p>
                </div>
            </section>
        );
    }

    if (notFound || !service) {
        return (
            <section className="space">
                <div className="container text-center py-5">
                    <h3>Service not found</h3>
                    <p className="text-muted mb-4">This service may have been removed or is not published yet.</p>
                    <Link to="/service" className="th-btn style3 th-icon">Back to Services</Link>
                </div>
            </section>
        );
    }

    const image = resolveAssetUrl(service.imageUrl);
    const features = Array.isArray(service.features) ? service.features : [];

    return (
        <section className="space">
            <div className="container shape-mockup-wrap">
                <div className="row">
                    <div className="col-xxl-8 col-lg-7">
                        <div className="page-single">
                            {image && (
                                <div className="service-img global-img">
                                    <img src={image} alt={service.imageAlt || service.title} />
                                </div>
                            )}
                            <div className="page-content d-block">
                                <h2 className="box-title mt-20">{service.title}</h2>
                                {service.shortDescription && (
                                    <p className="box-text mb-30 lead">{service.shortDescription}</p>
                                )}
                                {service.description && (
                                    <SafeHtml className="box-text mb-30" html={service.description} />
                                )}
                                {features.length > 0 && (
                                    <>
                                        <h2 className="box-title">Highlights</h2>
                                        <div className="checklist mb-30">
                                            <ul>
                                                {features.map((f, i) => (
                                                    <li key={i}>{f}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-4 col-lg-5">
                        <aside className="sidebar-area style3">
                            <div
                                className="widget widget_offer"
                                style={{ background: "url(/assets/img/bg/widget_bg_1.jpg)" }}
                            >
                                <div className="offer-banner">
                                    <div className="offer">
                                        <h6 className="box-title">
                                            Need Help? We Are Here To Help You
                                        </h6>
                                        <div className="banner-logo">
                                            <img src={LOGO_FULL} alt={BRAND_NAME} className="di-logo-full" />
                                        </div>
                                        <Link
                                            to={`/contact?subject=Service+enquiry&message=${encodeURIComponent(`I'd like to enquire about: ${service.title}`)}`}
                                            className="th-btn style2 th-icon"
                                        >
                                            Enquire Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ServiceDetailsMain
