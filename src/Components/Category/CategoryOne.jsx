import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { useCollection, resolveAssetUrl, resolveCmsList } from "../../public-cms/hooks";

const CategoryOne = ({ data = {} }) => {
  const swiperRef = useRef(null);
  const cms = useCollection("/public/categories");
  const { loading, items: categories } = resolveCmsList(cms);

  const displayCategories = categories.map((c) => ({
    id: c.slug,
    title: c.name,
    imgSrc: resolveAssetUrl(c.imageUrl) || "/assets/img/category/category_1_1.jpg",
    slug: c.slug,
  }));

  // Swiper disables looping/autoplay whenever the slide track already fits
  // every slide on screen (e.g. 5 categories at slidesPerView 6), so at
  // larger breakpoints the carousel would sit still. Repeat the set just
  // enough (2x the largest slidesPerView) so there are always enough
  // slides for a smooth, continuous loop no matter the viewport or count.
  const MIN_SLIDES_FOR_LOOP = 12;
  let loopSlides = displayCategories;
  if (displayCategories.length && displayCategories.length < MIN_SLIDES_FOR_LOOP) {
    loopSlides = [];
    while (loopSlides.length < MIN_SLIDES_FOR_LOOP) {
      loopSlides.push(...displayCategories);
    }
  }

  useEffect(() => {
    if (!swiperRef.current) return;

    const swiperInstance = swiperRef.current.swiper;

    // ✅ Start autoplay properly
    if (swiperInstance && swiperInstance.autoplay) {
      swiperInstance.autoplay.start();
    }
    // ✅ Custom pagination with numbers
    if (swiperInstance.pagination) {
      swiperInstance.pagination.renderBullet = function (index, className) {
        let formattedNumber = index + 1 < 10 ? "0" + (index + 1) : index + 1;
        return `<span class="${className} number">${formattedNumber}</span>`;
      };
      swiperInstance.pagination.init();
      swiperInstance.pagination.update();
    }
    // ✅ Custom wheel effect for category slider
    const multiplier = {
      translate: 0.1,
      rotate: 0.01,
    };

    const calculateWheel = () => {
      const slides = document.querySelectorAll(".single");
      slides.forEach((slide) => {
        const rect = slide.getBoundingClientRect();
        const r = window.innerWidth * 0.5 - (rect.x + rect.width * 0.5);
        let ty = Math.abs(r) * multiplier.translate - rect.width * multiplier.translate;

        if (ty < 0) {
          ty = 0;
        }
        const transformOrigin = r < 0 ? "left top" : "right top";
        slide.style.transform = `translate(0, ${ty}px) rotate(${-r * multiplier.rotate}deg)`;
        slide.style.transformOrigin = transformOrigin;
      });
    };

    const raf = () => {
      requestAnimationFrame(raf);
      calculateWheel();
    };

    raf();

    return () => cancelAnimationFrame(raf);
  }, [displayCategories.length]);

  if (loading || displayCategories.length === 0) return null;

  return (
    <section className="category-area bg-top-center">
      <div className="container th-container">
        <div className="title-area text-center">
          <span className="sub-title di-section-script">{data.subTitle || "Tour Categories"}</span>
          <h2 className="sec-title">{data.title || "Browse by Experience"}</h2>
        </div>

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
          loop={true}
          watchOverflow={false}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          speed={1000}
          pagination={{
            clickable: true,
            el: ".swiper-pagination",
            type: "bullets"
          }} // ✅ Defined renderBullet inside pagination
          className="th-slider has-shadow categorySlider"
        >
          {loopSlides.map((category, index) => (
            <SwiperSlide key={`${category.id}-${index}`}>
              <div className="category-card single">
                <div className="box-img global-img">
                  <img src={category.imgSrc} alt={category.title} width="424" height="530" loading="lazy" decoding="async" />
                </div>
                <h3 className="box-title">
                  <Link to={category.slug ? `/tour?category=${category.slug}` : "/tour"}>
                    {category.title}
                  </Link>
                </h3>
                <Link
                  className="line-btn"
                  to={category.slug ? `/tour?category=${category.slug}` : "/tour"}
                  aria-label={`See more ${category.title} tours`}
                >
                  See more
                </Link>
              </div>
            </SwiperSlide>
          ))}
          <div className="slider-controller w-100 justify-content-center">
            <div className="swiper-pagination" style={{maxWidth:"100%"}}></div>
          </div>
        </Swiper>

      </div>
    </section>
  );
};

export default CategoryOne;
