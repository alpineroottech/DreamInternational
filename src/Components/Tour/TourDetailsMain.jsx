import React, { useEffect, useState } from 'react'
import { Link, useSearchParams, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs } from "swiper/modules";
import { publicApi, resolveAssetUrl, useSettings } from '../../public-cms/hooks';
import SafeHtml from '../../public-cms/SafeHtml';

function TourDetailsMain() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [searchParams] = useSearchParams();
    const params = useParams();
    const slug = searchParams.get('slug') || params.slug;
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const settings = useSettings();

    useEffect(() => {
        if (!slug) { setLoading(false); return; }
        let active = true;
        setLoading(true);
        publicApi.get(`/public/tours/${slug}`)
            .then(({ data }) => { if (active) setTour(data); })
            .catch(() => { if (active) setTour(null); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [slug]);

    if (loading) {
        return <section className="space"><div className="container"><p className="text-muted">Loading tour details…</p></div></section>;
    }

    if (!tour) {
        return (
            <section className="space">
                <div className="container text-center py-5">
                    <h3>Tour not found</h3>
                    <p className="text-muted mb-4">This tour may have been removed or is not published yet.</p>
                    <Link to="/tour" className="th-btn style3 th-icon">Back to Tours</Link>
                </div>
            </section>
        );
    }

    // Gallery images: use galleryImages array if present, else featuredImage
    const galleryRaw = Array.isArray(tour.galleryImages) && tour.galleryImages.length
        ? tour.galleryImages.map(g => typeof g === 'string' ? g : g.url)
        : [tour.featuredImageUrl].filter(Boolean);
    const gallery = galleryRaw.map(resolveAssetUrl).filter(Boolean);
    const fallbackImg = "/assets/img/tour/tour_inner_1.jpg";
    const images = gallery.length ? gallery : [fallbackImg, fallbackImg, fallbackImg];

    const itinerary = Array.isArray(tour.itinerary) ? tour.itinerary : [];
    const highlights = Array.isArray(tour.highlights) ? tour.highlights : [];
    const priceIncludes = Array.isArray(tour.priceIncludes) ? tour.priceIncludes : [];
    const priceExcludes = Array.isArray(tour.priceExcludes) ? tour.priceExcludes : [];

    const phone = settings.contactPhone || "+977-1-0000000";
    const whatsapp = settings.whatsappNumber || settings.contactPhone;

    return (
        <section className="space">
            <div className="container">
                <div className="row gx-4">
                    {/* Main content */}
                    <div className="col-xxl-8 col-lg-7">
                        <div className="tour-page-single">
                            {/* Gallery slider */}
                            <div className="slider-area tour-slider1 mb-4">
                                <Swiper
                                    modules={[Navigation, Thumbs]}
                                    loop={images.length > 1}
                                    spaceBetween={10}
                                    navigation={{ prevEl: ".slider-prev", nextEl: ".slider-next" }}
                                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                    className="swiper th-slider mb-3"
                                    id="tourSlider4"
                                >
                                    {images.map((img, i) => (
                                        <SwiperSlide key={i}>
                                            <div className="tour-slider-img">
                                                <img src={img} alt={`${tour.title} — ${i + 1}`} />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                {images.length > 1 && (
                                    <Swiper
                                        modules={[Thumbs]}
                                        loop={images.length > 1}
                                        spaceBetween={12}
                                        slidesPerView={Math.min(4, images.length)}
                                        watchSlidesProgress
                                        onSwiper={setThumbsSwiper}
                                        className="swiper tour-thumb-slider"
                                    >
                                        {images.map((img, i) => (
                                            <SwiperSlide key={i}>
                                                <div className="tour-slider-img">
                                                    <img src={img} alt={`Thumbnail ${i + 1}`} />
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

                            <div className="page-content">
                                {/* Meta row */}
                                <div className="page-meta mb-3 d-flex flex-wrap gap-2 align-items-center">
                                    {tour.category?.name && (
                                        <Link className="page-tag" to={`/tour?category=${tour.category.slug}`}>
                                            {tour.category.name}
                                        </Link>
                                    )}
                                    {tour.difficulty && (
                                        <span className="badge bg-light text-secondary border">{tour.difficulty}</span>
                                    )}
                                    <span className="ratting ms-auto">
                                        <i className="fa-sharp fa-solid fa-star text-warning" />
                                        <span className="ms-1">4.8</span>
                                    </span>
                                </div>

                                <h2 className="box-title mb-2">{tour.title}</h2>

                                {/* Snapshot strip */}
                                <div className="tour-snapshot mb-4">
                                    <div className="tour-snap-wrapp">
                                        {tour.durationDays && (
                                            <div className="tour-snap">
                                                <div className="icon"><i className="fa-light fa-clock" /></div>
                                                <div className="content">
                                                    <span className="title">Duration</span>
                                                    <span>{tour.durationDays} Days / {tour.durationNights || tour.durationDays - 1} Nights</span>
                                                </div>
                                            </div>
                                        )}
                                        {(tour.groupSizeMin || tour.groupSizeMax) && (
                                            <div className="tour-snap">
                                                <div className="icon"><i className="fa-light fa-users" /></div>
                                                <div className="content">
                                                    <span className="title">Group Size</span>
                                                    <span>{tour.groupSizeMin || 1}–{tour.groupSizeMax || 12} pax</span>
                                                </div>
                                            </div>
                                        )}
                                        {tour.startPoint && (
                                            <div className="tour-snap">
                                                <div className="icon"><i className="fa-light fa-location-dot" /></div>
                                                <div className="content">
                                                    <span className="title">Start Point</span>
                                                    <span>{tour.startPoint}</span>
                                                </div>
                                            </div>
                                        )}
                                        {tour.maxAltitude && (
                                            <div className="tour-snap">
                                                <div className="icon"><i className="fa-light fa-mountain" /></div>
                                                <div className="content">
                                                    <span className="title">Max Altitude</span>
                                                    <span>{tour.maxAltitude}m</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                {tour.description && (
                                    <div className="mb-5">
                                        <h3 className="box-title mb-3">Overview</h3>
                                        <SafeHtml html={tour.description} />
                                    </div>
                                )}

                                {/* Highlights */}
                                {highlights.length > 0 && (
                                    <div className="mb-5">
                                        <h3 className="box-title mb-3">Highlights</h3>
                                        <div className="checklist">
                                            <ul>
                                                {highlights.map((h, i) => <li key={i}>{h}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* Itinerary */}
                                {itinerary.length > 0 && (
                                    <div className="mb-5">
                                        <h3 className="box-title mb-3">Tour Itinerary</h3>
                                        <ul className="nav nav-tabs tour-tab mb-3 flex-wrap gap-1" role="tablist">
                                            {itinerary.map((day, i) => (
                                                <li className="nav-item" key={i}>
                                                    <button
                                                        className={`nav-link${activeTab === i ? " active" : ""}`}
                                                        onClick={() => setActiveTab(i)}
                                                        type="button"
                                                    >
                                                        Day {i + 1}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="tab-content">
                                            {itinerary.map((day, i) => (
                                                <div
                                                    key={i}
                                                    className={`tab-pane fade${activeTab === i ? " show active" : ""}`}
                                                >
                                                    <div className="tour-grid-plan p-3" style={{ background: '#f8fafc', borderRadius: 12 }}>
                                                        {day.title && <h5 className="mb-2">{day.title}</h5>}
                                                        {day.description
                                                            ? <SafeHtml html={day.description} />
                                                            : Array.isArray(day.activities) && (
                                                                <div className="checklist"><ul>
                                                                    {day.activities.map((a, j) => <li key={j}>{a}</li>)}
                                                                </ul></div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Price includes / excludes */}
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
                            {/* Booking widget */}
                            <div className="widget widget_offer mb-4" style={{ background: 'linear-gradient(135deg,#0a074f,#140ca9)', borderRadius: 16, padding: '28px 24px' }}>
                                <h4 className="text-white mb-1">{tour.basePrice ? `From $${tour.basePrice}` : 'On request'}</h4>
                                <p className="text-white opacity-75 small mb-4">{tour.basePrice ? 'per person' : 'contact us for pricing'}</p>
                                <ul className="list-unstyled text-white mb-4" style={{ fontSize: 14 }}>
                                    {tour.durationDays && <li className="mb-2"><i className="fa-light fa-clock me-2" />{tour.durationDays} Days</li>}
                                    {tour.difficulty && <li className="mb-2"><i className="fa-light fa-gauge me-2" />{tour.difficulty}</li>}
                                    {tour.startPoint && <li className="mb-2"><i className="fa-light fa-location-dot me-2" />{tour.startPoint}</li>}
                                </ul>
                                <Link
                                    to={`/contact?subject=Booking+enquiry&message=I+would+like+to+book+${encodeURIComponent(tour.title)}`}
                                    className="th-btn th-btn-accent w-100 text-center d-block"
                                >
                                    Book This Tour
                                </Link>
                                {whatsapp && (
                                    <a
                                        href={`https://wa.me/${String(whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I'd like to enquire about: ${tour.title}`)}`}
                                        className="th-btn style2 th-icon w-100 text-center d-block mt-3"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        WhatsApp Enquiry
                                    </a>
                                )}
                            </div>

                            {/* Need help */}
                            <div className="widget widget_offer" style={{ background: 'url(/assets/img/bg/widget_bg_1.jpg)', borderRadius: 16, overflow: 'hidden' }}>
                                <div className="offer-banner p-4">
                                    <h6 className="box-title mb-2">Need Help Planning?</h6>
                                    <p className="small mb-3">Our Nepal travel experts are ready to customise this trip for you.</p>
                                    <p className="fw-bold mb-3"><i className="fa-light fa-phone me-2" />{phone}</p>
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

export default TourDetailsMain;
