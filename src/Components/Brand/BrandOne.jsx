import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Link } from "react-router-dom";
import { useCollection, resolveAssetUrl } from "../../public-cms/hooks";

const FALLBACK = [
  "brand_1_1.svg", "brand_1_2.svg", "brand_1_3.svg", "brand_1_4.svg",
  "brand_1_5.svg", "brand_1_6.svg", "brand_1_7.svg", "brand_1_8.svg",
].map((f) => ({ logoUrl: `/assets/img/brand/${f}`, url: "#", name: "Brand" }));

function BrandOne({ className }) {
  const cms = useCollection("/public/brands");
  const brands = cms && cms.length ? cms : FALLBACK;
  return (
    <div className={`brand-area overflow-hidden ${className}`}>
      <div className="container th-container">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          speed={1000}
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 3 },
            1200: { slidesPerView: 6 },
            1400: { slidesPerView: 8 },
          }}
          className="brandSlider1"
        >
          {brands.map((brand, index) => {
            const src = resolveAssetUrl(brand.logoUrl);
            return (
              <SwiperSlide key={index}>
                <div className="brand-box">
                  <Link to={brand.url || "#"}>
                    <img className="original" src={src} alt={brand.name || "Brand Logo"} />
                    <img className="gray" src={src} alt={brand.name || "Brand Logo"} />
                  </Link>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

export default BrandOne;
