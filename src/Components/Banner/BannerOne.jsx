import React, { useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Pagination, EffectFade, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../../public-cms/hooks';

const FALLBACK_SLIDES = [
    {
        image: "/assets/img/hero/Hero2.jpg",
        subtitle: "Dream International Travel and Tours",
        title: "Explore Nepal's Natural Wonders",
        primaryCta: { label: "Explore Tours", url: "/tour" },
        secondaryCta: { label: "Plan Custom Trip", url: "/service" },
    },
    {
        image: "/assets/img/hero/R.jpg",
        subtitle: "Trusted Local Experts in Nepal",
        title: "Trekking, Cultural, and Luxury Journeys",
        primaryCta: { label: "Explore Tours", url: "/tour" },
        secondaryCta: { label: "Plan Custom Trip", url: "/service" },
    },
];

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

    const handleSliderNavigation = (direction) => {
        const swiper = swiperRef.current?.swiper;
        if (!swiper) return;
        if (direction === "prev") swiper.slidePrev();
        else swiper.slideNext();
    };

    return (
        <div className="th-hero-wrapper hero-1" id="hero">
            <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination, EffectFade]}
                effect="fade"
                loop
                speed={1000}
                pagination={{ el: ".swiper-pagination", clickable: true }}
                navigation={{ nextEl: ".slider-next", prevEl: ".slider-prev" }}
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
                                }}
                            />
                            <div className="container">
                                <div className="hero-style1">
                                    {slide.subtitle && (
                                        <span className="sub-title style1" data-ani="slideinup" data-ani-delay="0.2s">
                                            {slide.subtitle}
                                        </span>
                                    )}
                                    <h1 className="hero-title" data-ani="slideinup" data-ani-delay="0.4s">
                                        {slide.title}
                                    </h1>
                                    {slide.text && (
                                        <p className="hero-text" data-ani="slideinup" data-ani-delay="0.5s">
                                            {slide.text}
                                        </p>
                                    )}
                                    <div className="btn-group" data-ani="slideinup" data-ani-delay="0.6s">
                                        {slide.primaryCta?.label && (
                                            <Link to={slide.primaryCta.url || "/tour"} className="th-btn th-icon">
                                                {slide.primaryCta.label}
                                            </Link>
                                        )}
                                        {slide.secondaryCta?.label && (
                                            <Link to={slide.secondaryCta.url || "/contact"} className="th-btn style2 th-icon">
                                                {slide.secondaryCta.label}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
                <div className="th-swiper-custom">
                    <button className="slider-arrow slider-prev" onClick={() => handleSliderNavigation("prev")}>
                        <img src="/assets/img/icon/right-arrow.svg" alt="Prev" />
                    </button>
                    <div className="swiper-pagination" />
                    <button className="slider-arrow slider-next" onClick={() => handleSliderNavigation("next")}>
                        <img src="/assets/img/icon/left-arrow.svg" alt="Next" />
                    </button>
                </div>
            </Swiper>
        </div>
    )
}

export default BannerOne
