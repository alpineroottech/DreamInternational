import React, { useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../../public-cms/hooks';

const FALLBACK_SLIDES = [
    {
        image: "/assets/img/hero/Hero2.jpg",
        subtitle: "Welcome to Dream International",
        title: "Discover the Himalayas of Nepal",
        primaryCta: { label: "Explore Tours", url: "/tour" },
        secondaryCta: { label: "Contact Us", url: "/contact" },
    },
    {
        image: "/assets/img/hero/R.jpg",
        subtitle: "Trusted Local Experts in Nepal",
        title: "Trekking, Culture & Tailor-Made Journeys",
        primaryCta: { label: "Explore Tours", url: "/tour" },
        secondaryCta: { label: "Contact Us", url: "/contact" },
    },
];

function HeroCta({ to, label, className }) {
    return (
        <Link to={to} className={`th-btn th-icon-plane ${className || ""}`}>
            {label}
            <i className="fa-regular fa-arrow-right" aria-hidden="true" />
        </Link>
    );
}

function BannerOne({ data = {} }) {
    const swiperRef = useRef(null);
    const slides = Array.isArray(data.slides) && data.slides.length ? data.slides : FALLBACK_SLIDES;

    useEffect(() => {
        document.querySelectorAll('[data-ani]').forEach((element) => {
            element.classList.add(element.getAttribute('data-ani'));
        });
        document.querySelectorAll('[data-ani-delay]').forEach((element) => {
            element.style.animationDelay = element.getAttribute('data-ani-delay');
        });
    }, [slides]);

    return (
        <div className="th-hero-wrapper hero-1 di-hero-mockup" id="hero">
            <Swiper
                ref={swiperRef}
                modules={[Pagination, EffectFade]}
                effect="fade"
                loop
                speed={1000}
                pagination={{ el: ".di-hero-pagination", clickable: true }}
                className="th-slider hero-slider-1"
                id="heroSlide1"
            >
                {slides.map((slide, i) => (
                    <SwiperSlide key={i}>
                        <div className="hero-inner">
                            <div
                                className="th-hero-bg"
                                style={{
                                    backgroundImage: `url(${resolveAssetUrl(slide.image)})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            />
                            <div className="di-hero-overlay" aria-hidden="true" />
                            <div className="container">
                                <div className="hero-style1 di-hero-content">
                                    {slide.subtitle && (
                                        <span className="sub-title style1 di-hero-script" data-ani="slideinup" data-ani-delay="0.2s">
                                            {slide.subtitle}
                                        </span>
                                    )}
                                    <h1 className="hero-title di-hero-title" data-ani="slideinup" data-ani-delay="0.4s">
                                        {slide.title}
                                    </h1>
                                    {slide.text && (
                                        <p className="hero-text" data-ani="slideinup" data-ani-delay="0.5s">
                                            {slide.text}
                                        </p>
                                    )}
                                    <div className="btn-group di-hero-cta" data-ani="slideinup" data-ani-delay="0.6s">
                                        {slide.primaryCta?.label && (
                                            <HeroCta
                                                to={slide.primaryCta.url || "/tour"}
                                                label={slide.primaryCta.label}
                                                className="di-hero-btn-primary"
                                            />
                                        )}
                                        {slide.secondaryCta?.label && (
                                            <HeroCta
                                                to={slide.secondaryCta.url || "/contact"}
                                                label={slide.secondaryCta.label}
                                                className="th-btn-accent"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
                <div className="di-hero-pagination-wrap">
                    <div className="swiper-pagination di-hero-pagination" />
                </div>
            </Swiper>
        </div>
    )
}

export default BannerOne
