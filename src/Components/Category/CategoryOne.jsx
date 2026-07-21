import React, { useEffect, useRef, useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import {
  useCollection,
  resolveAssetUrl,
  resolveCmsList,
} from "../../public-cms/hooks";

// Below this width the carousel is controlled with tap arrows instead of
// swipe/drag gestures (matches the 768px breakpoint used by the slider).
const MOBILE_BREAKPOINT = 768;
const MIN_SLIDES_FOR_LOOP = 12;

function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handleChange = (e) => setIsMobile(e.matches);
    handleChange(mql);
    if (mql.addEventListener) mql.addEventListener("change", handleChange);
    else mql.addListener(handleChange);
    return () => {
      if (mql.removeEventListener)
        mql.removeEventListener("change", handleChange);
      else mql.removeListener(handleChange);
    };
  }, [breakpoint]);

  return isMobile;
}

const CategoryOne = ({ data = {} }) => {
  const swiperRef = useRef(null);
  const isMobile = useIsMobile();
  const cms = useCollection("/public/categories");
  const { loading, items: categories } = resolveCmsList(cms);

  const displayCategories = categories
    .map((c) => ({
      id: c.slug,
      title: c.name,
      imgSrc: resolveAssetUrl(c.imageUrl) || "",
      slug: c.slug,
    }))
    .filter((c) => c.imgSrc);

  const loopSlides = useMemo(() => {
    if (isMobile) return displayCategories;
    if (
      !displayCategories.length ||
      displayCategories.length >= MIN_SLIDES_FOR_LOOP
    ) {
      return displayCategories;
    }
    const slides = [];
    while (slides.length < MIN_SLIDES_FOR_LOOP) {
      slides.push(...displayCategories);
    }
    return slides;
  }, [displayCategories, isMobile]);

  useEffect(() => {
    if (!swiperRef.current) return undefined;

    const swiperInstance = swiperRef.current.swiper;

    if (swiperInstance?.pagination) {
      swiperInstance.pagination.renderBullet = function (index, className) {
        const formattedNumber = index + 1 < 10 ? `0${index + 1}` : index + 1;
        return `<span class="${className} number">${formattedNumber}</span>`;
      };
      swiperInstance.pagination.init();
      swiperInstance.pagination.update();
    }

    if (isMobile) {
      if (swiperInstance?.autoplay) swiperInstance.autoplay.stop();
      return undefined;
    }

    if (swiperInstance?.autoplay) {
      swiperInstance.autoplay.start();
    }

    const multiplier = { translate: 0.1, rotate: 0.01 };
    const sliderRoot = swiperRef.current?.el;

    const calculateWheel = () => {
      if (!sliderRoot) return;
      const slides = sliderRoot.querySelectorAll(".single");
      slides.forEach((slide) => {
        const rect = slide.getBoundingClientRect();
        const r = window.innerWidth * 0.5 - (rect.x + rect.width * 0.5);
        let ty =
          Math.abs(r) * multiplier.translate - rect.width * multiplier.translate;
        if (ty < 0) ty = 0;
        const transformOrigin = r < 0 ? "left top" : "right top";
        slide.style.transform = `translate(0, ${ty}px) rotate(${-r * multiplier.rotate}deg)`;
        slide.style.transformOrigin = transformOrigin;
      });
    };

    let frameId = 0;
    const raf = () => {
      calculateWheel();
      frameId = requestAnimationFrame(raf);
    };
    frameId = requestAnimationFrame(raf);

    return () => cancelAnimationFrame(frameId);
  }, [displayCategories.length, isMobile]);

  if (loading || displayCategories.length === 0) return null;

  const slide = (dir) => {
    const swiper = swiperRef.current?.swiper;
    if (!swiper) return;
    if (dir === "prev") swiper.slidePrev();
    else swiper.slideNext();
  };

  return (
    <section className="category-area bg-top-center">
      <div className="container th-container">
        <div className="title-area text-center">
          <span className="sub-title di-section-script">
            {data.subTitle || "Tour Categories"}
          </span>
          <h2 className="sec-title">{data.title || "Browse by Experience"}</h2>
        </div>

        <div className="di-category-slider-wrap">
          <button
            type="button"
            className="di-category-slider-arrow di-category-slider-arrow--prev d-md-none"
            onClick={() => slide("prev")}
            aria-label="Previous categories"
          >
            <i className="fa-regular fa-arrow-left" aria-hidden="true" />
          </button>

          <Swiper
            ref={swiperRef}
            modules={[Pagination, Autoplay]}
            slidesPerView={1}
            breakpoints={{
              576: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
              1400: { slidesPerView: 6 },
            }}
            spaceBetween={28}
            loop={!isMobile && loopSlides.length > 1}
            watchOverflow={false}
            autoplay={
              isMobile
                ? false
                : { delay: 3000, disableOnInteraction: false }
            }
            speed={isMobile ? 350 : 1000}
            allowTouchMove={!isMobile}
            simulateTouch={!isMobile}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
              type: "bullets",
            }} // ✅ Defined renderBullet inside pagination
            className="th-slider has-shadow categorySlider"
          >
            {loopSlides.map((category, index) => (
              <SwiperSlide key={`${category.id}-${index}`}>
                <div className="category-card single">
                  <div className="box-img global-img">
                    <img
                      src={category.imgSrc}
                      alt={category.title}
                      width="424"
                      height="530"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <h3 className="box-title">
                    <Link
                      to={
                        category.slug
                          ? `/tour?category=${category.slug}`
                          : "/tour"
                      }
                    >
                      {category.title}
                    </Link>
                  </h3>
                  <Link
                    className="line-btn"
                    to={
                      category.slug
                        ? `/tour?category=${category.slug}`
                        : "/tour"
                    }
                    aria-label={`See more ${category.title} tours`}
                  >
                    See more
                  </Link>
                </div>
              </SwiperSlide>
            ))}
            <div className="slider-controller w-100 justify-content-center">
              <div
                className="swiper-pagination"
                style={{ maxWidth: "100%" }}
              ></div>
            </div>
          </Swiper>

          <button
            type="button"
            className="di-category-slider-arrow di-category-slider-arrow--next d-md-none"
            onClick={() => slide("next")}
            aria-label="Next categories"
          >
            <i className="fa-regular fa-arrow-right" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryOne;
