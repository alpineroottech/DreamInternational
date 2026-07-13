import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from "swiper/modules";
import { resolveAssetUrl } from '../../public-cms/hooks';
import { useSlugItem } from '../../public-cms/hooks';
import SafeHtml from '../../public-cms/SafeHtml';
import RentalInquiryWidget from './RentalInquiryWidget';

const TYPE_LABELS = {
    car: 'Car',
    jeep: 'Jeep / SUV',
    van: 'Van / Minibus',
    bus: 'Bus / Coach',
    'driver-only': 'Driver Only',
};

function priceDisplay(rental) {
    if (!rental || rental.showPricing === false) return { headline: 'Enquire for price', sub: 'Contact us for a quote' };
    const parts = [];
    if (rental.pricePerDay) parts.push(`$${rental.pricePerDay}/day self-drive`);
    if (rental.pricePerDayDriver) parts.push(`$${rental.pricePerDayDriver}/day with driver`);
    if (!parts.length) return { headline: 'Enquire for price', sub: 'Contact us for a quote' };
    return { headline: parts[0], sub: parts.slice(1).join(' · ') || rental.priceNote || '' };
}

function VehicleRentalDetailsMain() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const params = useParams();
    const slug = params.slug;
    const { data: rental, loading } = useSlugItem('/public/vehicle-rentals', slug);

    if (loading) {
        return <section className="space"><div className="container"><p className="text-muted">Loading vehicle…</p></div></section>;
    }

    if (!rental) {
        return (
            <section className="space">
                <div className="container text-center py-5">
                    <h3>Vehicle not found</h3>
                    <p className="text-muted mb-4">This listing may have been removed or is not published yet.</p>
                    <Link to="/vehicle-rentals" className="th-btn style3 th-icon">Back to Vehicle Rentals</Link>
                </div>
            </section>
        );
    }

    const galleryRaw = Array.isArray(rental.galleryImages) && rental.galleryImages.length
        ? rental.galleryImages.map((g) => (typeof g === 'string' ? g : g.url))
        : [rental.featuredImageUrl].filter(Boolean);
    const images = galleryRaw.map(resolveAssetUrl).filter(Boolean);

    const highlights = Array.isArray(rental.highlights) ? rental.highlights : [];
    const priceIncludes = Array.isArray(rental.priceIncludes) ? rental.priceIncludes : [];
    const priceExcludes = Array.isArray(rental.priceExcludes) ? rental.priceExcludes : [];
    const price = priceDisplay(rental);

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
                                                    <img src={img} alt={`${rental.title} — ${i + 1}`} />
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
                                    <Link className="page-tag" to="/vehicle-rentals">
                                        {TYPE_LABELS[rental.vehicleType] || 'Vehicle'}
                                    </Link>
                                    {rental.category?.name && (
                                        <span className="page-tag">{rental.category.name}</span>
                                    )}
                                </div>

                                <h2 className="box-title mb-3">{rental.title}</h2>
                                {rental.brandModel && <p className="text-muted mb-3">{rental.brandModel}</p>}

                                <div className="tour-snapshot mb-4">
                                    <div className="tour-snap-wrapp">
                                        {rental.seatingCapacity ? (
                                            <div className="tour-snap">
                                                <div className="icon"><i className="fa-light fa-users" /></div>
                                                <div className="content">
                                                    <span className="title">Seats</span>
                                                    <span>{rental.seatingCapacity}</span>
                                                </div>
                                            </div>
                                        ) : null}
                                        {rental.transmission && (
                                            <div className="tour-snap">
                                                <div className="icon"><i className="fa-light fa-gear" /></div>
                                                <div className="content">
                                                    <span className="title">Transmission</span>
                                                    <span style={{ textTransform: 'capitalize' }}>{rental.transmission}</span>
                                                </div>
                                            </div>
                                        )}
                                        {rental.fuelType && (
                                            <div className="tour-snap">
                                                <div className="icon"><i className="fa-light fa-gas-pump" /></div>
                                                <div className="content">
                                                    <span className="title">Fuel</span>
                                                    <span style={{ textTransform: 'capitalize' }}>{rental.fuelType}</span>
                                                </div>
                                            </div>
                                        )}
                                        {rental.luggageCapacity && (
                                            <div className="tour-snap">
                                                <div className="icon"><i className="fa-light fa-suitcase" /></div>
                                                <div className="content">
                                                    <span className="title">Luggage</span>
                                                    <span>{rental.luggageCapacity}</span>
                                                </div>
                                            </div>
                                        )}
                                        {rental.driverOptions && (
                                            <div className="tour-snap">
                                                <div className="icon"><i className="fa-light fa-id-card" /></div>
                                                <div className="content">
                                                    <span className="title">Driver</span>
                                                    <span>
                                                        {rental.driverOptions === 'self-drive' ? 'Self-drive only'
                                                            : rental.driverOptions === 'with-driver' ? 'With driver'
                                                            : 'Self-drive or with driver'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {rental.shortDescription && (
                                    <p className="box-text mb-4">{rental.shortDescription}</p>
                                )}

                                {rental.description && (
                                    <div className="mb-5">
                                        <h3 className="box-title mb-3">Overview</h3>
                                        <SafeHtml html={rental.description} />
                                    </div>
                                )}

                                {highlights.length > 0 && (
                                    <div className="mb-5">
                                        <h3 className="box-title mb-3">Highlights</h3>
                                        <div className="checklist">
                                            <ul>{highlights.map((h, i) => <li key={i}>{h}</li>)}</ul>
                                        </div>
                                    </div>
                                )}

                                {(priceIncludes.length > 0 || priceExcludes.length > 0) && (
                                    <div className="mb-5">
                                        <h3 className="box-title mb-3">Price Includes &amp; Excludes</h3>
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

                    <div className="col-xxl-4 col-lg-5">
                        <aside className="sidebar-area">
                            <div className="widget widget_offer mb-4" style={{ background: 'linear-gradient(135deg,#000f3d,#001a57)', borderRadius: 16, padding: '28px 24px' }}>
                                <h4 className="text-white mb-1">{price.headline}</h4>
                                {price.sub && <p className="text-white opacity-75 small mb-0">{price.sub}</p>}
                                {rental.minRentalDays ? (
                                    <p className="text-white opacity-75 small mb-0">Minimum {rental.minRentalDays} day(s)</p>
                                ) : null}
                            </div>
                            <RentalInquiryWidget rental={rental} />
                        </aside>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default VehicleRentalDetailsMain;
