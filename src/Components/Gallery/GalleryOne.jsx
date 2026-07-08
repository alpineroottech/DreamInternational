import React, { useState } from 'react';
import Modal from './Modal';
import { Link } from 'react-router-dom';
import { useCollection, resolveAssetUrl, resolveCmsList } from '../../public-cms/hooks';

const FALLBACK = [1, 2, 3, 4, 5, 6, 7].map((n) => ({ imageUrl: `/assets/img/gallery/gallery_1_${n}.jpg` }));

function GalleryOne({ data = {} }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState('');
    const cms = useCollection('/public/gallery');
    const { loading, items: images } = resolveCmsList(cms, FALLBACK);
    if (loading) return null;

    const openModal = (imageSrc, event) => {
        event.preventDefault();
        setModalImage(imageSrc);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="gallery-area space">
            <div className="container th-container shape-mockup-wrap">
                <div className="title-area text-center">
                    <span className="sub-title di-section-script">{data.subTitle || 'Make Your Tour More Pleasure'}</span>
                    <h2 className="sec-title">{data.title || 'Recent Gallery'}</h2>
                </div>
                <div className="row gy-10 gx-10 justify-content-center align-items-center">
                    {images.map((img, i) => {
                        const src = resolveAssetUrl(img.imageUrl);
                        return (
                            <div className="col-md-6 col-lg-2" key={img.id || i}>
                                <div className="gallery-card">
                                    <div className="box-img global-img">
                                        <Link
                                            to={src}
                                            className="popup-image"
                                            aria-label={`View gallery image${img.imageAlt || img.title ? `: ${img.imageAlt || img.title}` : ''}`}
                                            onClick={(e) => openModal(src, e)}
                                        >
                                            <div className="icon-btn">
                                                <i className="fal fa-magnifying-glass-plus" aria-hidden="true" />
                                            </div>
                                        </Link>
                                        <img
                                            src={src}
                                            alt={img.imageAlt || img.title || 'Dream International gallery photo'}
                                            width="600"
                                            height="750"
                                            loading="lazy"
                                            decoding="async"
                                            onClick={(e) => openModal(src, e)}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="shape-mockup d-none d-xl-block" style={{ top: "-25%", left: "0%" }} aria-hidden="true">
                    <img src="/assets/img/shape/line.png" alt="" width="120" height="120" loading="lazy" decoding="async" />
                </div>
                <div className="shape-mockup movingX d-none d-xl-block" style={{ top: "30%", left: "-3%" }} aria-hidden="true">
                    <img className="gmovingX" src="/assets/img/shape/shape_4.png" alt="" width="120" height="120" loading="lazy" decoding="async" />
                </div>
            </div>
            <Modal isOpen={isModalOpen} closeModal={closeModal} imageSrc={modalImage} />
        </div>
    );
}

export default GalleryOne;
