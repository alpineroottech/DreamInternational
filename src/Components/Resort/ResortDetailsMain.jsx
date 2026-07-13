import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSlugItem, resolveAssetUrl } from '../../public-cms/hooks';
import SafeHtml from '../../public-cms/SafeHtml';
import Modal from '../Gallery/Modal';
import { BRAND_NAME, LOGO_FULL } from '../../brand/brandAssets';

function ResortDetailsMain() {
    const { id } = useParams();
    const { data: resort, loading, notFound } = useSlugItem('/public/resorts', id);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState('');

    if (loading) {
        return (
            <section className="space">
                <div className="container text-center py-5">
                    <p className="text-muted mb-0">Loading resort…</p>
                </div>
            </section>
        );
    }

    if (notFound || !resort) {
        return (
            <section className="space">
                <div className="container text-center py-5">
                    <h3>Resort not found</h3>
                    <p className="text-muted mb-4">This resort may have been removed or is not published yet.</p>
                    <Link to="/resort" className="th-btn style3 th-icon">Back to Resorts</Link>
                </div>
            </section>
        );
    }

    const openModal = (imageSrc, event) => {
        event.preventDefault();
        setModalImage(imageSrc);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);

    const heroImage = resolveAssetUrl(resort.imageUrl);
    const galleryRaw = Array.isArray(resort.galleryImages) && resort.galleryImages.length
        ? resort.galleryImages.map((g) => (typeof g === 'string' ? g : g?.url)).filter(Boolean)
        : [];
    const gallery = galleryRaw.map(resolveAssetUrl).filter(Boolean);
    const amenities = Array.isArray(resort.amenities)
        ? resort.amenities
        : typeof resort.amenities === 'string' && resort.amenities.trim()
            ? resort.amenities.split(/\s{2,}|[,|]/).map((s) => s.trim()).filter(Boolean)
            : [];

    return (
        <section className="space">
            <div className="container shape-mockup-wrap">
                <div className="row">
                    <div className="col-xxl-8 col-lg-7">
                        <div className="page-single">
                            {heroImage && (
                                <div className="service-img global-img">
                                    <img src={heroImage} alt={resort.imageAlt || resort.title} />
                                </div>
                            )}
                            <div className="page-content d-block">
                                <div className="d-flex flex-wrap gap-3 align-items-center mt-20 mb-2">
                                    <h3 className="box-title mb-0">{resort.title}</h3>
                                    {resort.location && (
                                        <span className="text-muted"><i className="fa-light fa-location-dot" /> {resort.location}</span>
                                    )}
                                </div>
                                {resort.price && (
                                    <h4 className="resort-price mb-3">
                                        <span className="currency">From {resort.price}</span>/per Night
                                    </h4>
                                )}
                                {resort.shortDescription && (
                                    <p className="blog-text lead mb-30">{resort.shortDescription}</p>
                                )}
                                {resort.description && (
                                    <SafeHtml className="blog-text mb-30" html={resort.description} />
                                )}
                                {amenities.length > 0 && (
                                    <>
                                        <h2 className="box-title">Amenities</h2>
                                        <div className="checklist mb-30">
                                            <ul>
                                                {amenities.map((a, i) => (
                                                    <li key={i}>{a}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                )}
                            </div>
                            {gallery.length > 0 && (
                                <div className="destination-gallery-wrapper">
                                    <h3 className="page-title mt-30 mb-30">From our gallery</h3>
                                    <div className="row gy-4 gallery-row filter-active">
                                        {gallery.map((img, i) => (
                                            <div className="col-xxl-auto filter-item" key={i}>
                                                <div className="gallery-box style3">
                                                    <div className="gallery-img global-img">
                                                        <img src={img} alt={`${resort.title} — ${i + 1}`} />
                                                        <Link
                                                            to={img}
                                                            className="icon-btn popup-image"
                                                            onClick={(e) => openModal(img, e)}
                                                        >
                                                            <i className="fal fa-magnifying-glass-plus" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
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
                                            to={`/contact?subject=Resort+booking&message=${encodeURIComponent(`I'd like to enquire about booking: ${resort.title}`)}`}
                                            className="th-btn style2 th-icon"
                                        >
                                            Book Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
            <Modal isOpen={isModalOpen} closeModal={closeModal} imageSrc={modalImage} />
        </section>
    )
}

export default ResortDetailsMain
