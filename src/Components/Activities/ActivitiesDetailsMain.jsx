import React, { useEffect, useState } from 'react'
import { Link, useSearchParams, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs } from "swiper/modules";
import { publicApi, resolveAssetUrl } from '../../public-cms/hooks';
import SafeHtml from '../../public-cms/SafeHtml';

function ActivitiesDetailsMain() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [searchParams] = useSearchParams();
    const params = useParams();
    const slug = searchParams.get('slug') || params.slug;
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) { setLoading(false); return; }
        let active = true;
        setLoading(true);
        publicApi.get(`/public/activities/${slug}`)
            .then(({ data }) => { if (active) setActivity(data); })
            .catch(() => { if (active) setActivity(null); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [slug]);

    if (loading) {
        return <section className="space"><div className="container"><p className="text-muted">Loading activity…</p></div></section>;
    }

    if (!activity) {
        return (
            <section className="space">
                <div className="container text-center py-5">
                    <h3>Activity not found</h3>
                    <p className="text-muted mb-4">This activity may have been removed or is not published yet.</p>
                    <Link to="/activities" className="th-btn style3 th-icon">Back to Activities</Link>
                </div>
            </section>
        );
    }

    const galleryRaw = Array.isArray(activity.galleryImages) && activity.galleryImages.length
        ? activity.galleryImages.map(g => typeof g === 'string' ? g : g.url)
        : [activity.imageUrl].filter(Boolean);
    const images = galleryRaw.map(resolveAssetUrl).filter(Boolean);

    const highlights = Array.isArray(activity.highlights) ? activity.highlights : [];
    const priceIncludes = Array.isArray(activity.priceIncludes) ? activity.priceIncludes : [];
    const priceExcludes = Array.isArray(activity.priceExcludes) ? activity.priceExcludes : [];
    const amenities = Array.isArray(activity.amenities) ? activity.amenities : [];

    return (
        <section className="space">
            <div className="container">
                <div className="row gx-4">
                    <div className="col-xxl-8 col-lg-7">
                        <div className="tour-page-single">
                            {images.length > 0 && (
                            <div className="slider-area tour-slider1 mb-4">
                                <Swiper
                                    modules={[Navigation, Thumbs]}
                                    loop={images.length > 1}
                                    spaceBetween={10}
                                    navigation={{ prevEl: ".slider-prev", nextEl: ".slider-next" }}
                                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                    className="swiper th-slider mb-3"
                                >
                                    {images.map((img, i) => (
                                        <SwiperSlide key={i}>
                                            <div className="tour-slider-img">
                                                <img src={img} alt={`${activity.title} — ${i + 1}`} />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                {images.length > 1 && (
                                    <Swiper
                                        modules={[Thumbs]}
                                        loop={images.length > 1}
                                        spaceBetween={12}
                                        slidesPerView={Math.min(3, images.length)}
                                        watchSlidesProgress
                                        onSwiper={setThumbsSwiper}
                                        className="swiper tour-thumb-slider"
                                    >
                                        {images.map((img, i) => (
                                            <SwiperSlide key={i}>
                                                <div className="tour-slider-img">
                                                    <img src={img} alt={`Thumb ${i + 1}`} />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                )}
                                <button className="slider-arrow style3 slider-prev">
                                    <img src="/assets/img/icon/hero-arrow-left.svg" alt="Prev" />
                                </button>
                                <button className="slider-arrow style3 slider-next">
                                    <img src="/assets/img/icon/hero-arrow-right.svg" alt="Next" />
                                </button>
                            </div>
                            )}

                            <div className="page-content">
                                <div className="page-meta mb-3 d-flex flex-wrap gap-2 align-items-center">
                                    <Link className="page-tag" to="/activities">Activities</Link>
                                    <span className="ratting ms-auto">
                                        <i className="fa-sharp fa-solid fa-star text-warning" />
                                        <span className="ms-1">4.8</span>
                                    </span>
                                </div>

                                <h2 className="box-title mb-3">{activity.title}</h2>

                                {/* Snapshot strip */}
                                <div className="tour-snapshot mb-4">
                                    <div className="tour-snap-wrapp">
                                        {activity.duration && (
                                            <div className="tour-snap">
                                                <div className="icon"><i className="fa-light fa-clock" /></div>
                                                <div className="content">
                                                    <span className="title">Duration</span>
                                                    <span>{activity.duration}</span>
                                                </div>
                                            </div>
                                        )}
                                        {activity.groupSize && (
                                            <div className="tour-snap">
                                                <div className="icon"><i className="fa-light fa-users" /></div>
                                                <div className="content">
                                                    <span className="title">Group Size</span>
                                                    <span>{activity.groupSize}</span>
                                                </div>
                                            </div>
                                        )}
                                        {activity.difficulty && (
                                            <div className="tour-snap">
                                                <div className="icon"><i className="fa-light fa-gauge" /></div>
                                                <div className="content">
                                                    <span className="title">Difficulty</span>
                                                    <span>{activity.difficulty}</span>
                                                </div>
                                            </div>
                                        )}
                                        {activity.location && (
                                            <div className="tour-snap">
                                                <div className="icon"><i className="fa-light fa-location-dot" /></div>
                                                <div className="content">
                                                    <span className="title">Location</span>
                                                    <span>{activity.location}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Short description */}
                                {activity.shortDescription && (
                                    <p className="box-text mb-4">{activity.shortDescription}</p>
                                )}

                                {/* Full description */}
                                {activity.description && (
                                    <div className="mb-5">
                                        <h3 className="box-title mb-3">Overview</h3>
                                        <SafeHtml html={activity.description} />
                                    </div>
                                )}

                                {/* Highlights */}
                                {highlights.length > 0 && (
                                    <div className="mb-5">
                                        <h3 className="box-title mb-3">Highlights</h3>
                                        <div className="checklist">
                                            <ul>{highlights.map((h, i) => <li key={i}>{h}</li>)}</ul>
                                        </div>
                                    </div>
                                )}

                                {/* Amenities / what's included */}
                                {amenities.length > 0 && (
                                    <div className="mb-5">
                                        <h3 className="box-title mb-3">What's Included</h3>
                                        <div className="checklist style2 style4">
                                            <ul>{amenities.map((a, i) => <li key={i}>{a}</li>)}</ul>
                                        </div>
                                    </div>
                                )}

                                {/* Included / Excluded */}
                                {(priceIncludes.length > 0 || priceExcludes.length > 0) && (
                                    <div className="mb-5">
                                        <h3 className="box-title mb-3">Included &amp; Excluded</h3>
                                        <div className="destination-checklist">
                                            {priceIncludes.length > 0 && (
                                                <div className="checklist style2 style4">
                                                    <ul>{priceIncludes.map((item, i) => <li key={i}>{item}</li>)}</ul>
                                                </div>
                                            )}
                                            {priceExcludes.length > 0 && (
                                                <div className="checklist style5">
                                                    <ul>{priceExcludes.map((item, i) => <li key={i}>{item}</li>)}</ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-xxl-4 col-lg-5">
                        <aside className="sidebar-area">
                            <div className="widget widget_offer mb-4" style={{ background: 'linear-gradient(135deg,#000f3d,#001a57)', borderRadius: 16, padding: '28px 24px' }}>
                                <h4 className="text-white mb-1">{activity.price || 'On request'}</h4>
                                <p className="text-white opacity-75 small mb-4">per person</p>
                                <Link
                                    to={`/contact?subject=Activity+enquiry&message=${encodeURIComponent(`I'd like to enquire about: ${activity.title}`)}`}
                                    className="th-btn th-btn-accent w-100 text-center d-block"
                                >
                                    Book This Activity
                                </Link>
                            </div>
                            <div className="widget widget_offer di-help-planning-card">
                                <div className="offer-banner p-4">
                                    <h6 className="box-title mb-2">Need Help Planning?</h6>
                                    <p className="small mb-3">Our team can customise this activity for your group.</p>
                                    <Link to="/contact" className="th-btn style3 th-icon">Contact Us</Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ActivitiesDetailsMain;
