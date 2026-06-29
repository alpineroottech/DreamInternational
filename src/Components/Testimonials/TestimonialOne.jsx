import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useCollection, resolveAssetUrl, resolveCmsList } from "../../public-cms/hooks";

const FALLBACK = [
  { name: "Maria Doe", designation: "Traveller", image: "/assets/img/testimonial/testi_1_1.jpg", text: "An unforgettable trip — superbly organised from start to finish.", rating: 5 },
  { name: "Andrew Simon", designation: "Traveller", image: "/assets/img/testimonial/testi_1_2.jpg", text: "Knowledgeable guides and seamless logistics. Highly recommended.", rating: 5 },
  { name: "Alex Jordan", designation: "Traveller", image: "/assets/img/testimonial/testi_1_1.jpg", text: "Great value and a wonderful experience across Nepal.", rating: 5 },
];

function TestimonialOne({ data = {} }) {
  const cms = useCollection("/public/reviews", { featured: "true" });
  const { loading, items: fallbackItems } = resolveCmsList(cms, FALLBACK);
  const testimonials =
    cms && cms.length
      ? cms.map((r) => ({
          name: r.reviewerName,
          designation: r.reviewerCountry || "Traveller",
          image: resolveAssetUrl(r.reviewerPhoto) || "/assets/img/testimonial/testi_1_1.jpg",
          text: r.reviewText,
          rating: r.rating || 5,
        }))
      : fallbackItems;
  if (loading) return null;

  const useCarousel = testimonials.length > 3;

  return (
    <section className="di-testimonials space" id="testi-sec">
      <div className="container">
        <div className="title-area text-center mb-40">
          <span className="sub-title">{data.subTitle || "Testimonials"}</span>
          <h2 className="sec-title">{data.title || "What Clients Say About Us"}</h2>
        </div>

        {useCarousel ? (
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
            className="di-testimonials__slider"
          >
            {testimonials.map((item, index) => (
              <SwiperSlide key={`${item.name}-${index}`}>
                <TestimonialTile item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="di-testimonials__grid">
            {testimonials.map((item, index) => (
              <TestimonialTile key={`${item.name}-${index}`} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TestimonialTile({ item }) {
  const stars = Math.min(5, Math.max(1, Number(item.rating) || 5));
  return (
    <article className="di-testimonial-card">
      <div className="di-testimonial-card__quote" aria-hidden="true">
        <i className="fa-solid fa-quote-left" />
      </div>
      <p className="di-testimonial-card__text">{item.text}</p>
      <div className="di-testimonial-card__stars">
        {[...Array(stars)].map((_, i) => (
          <i key={i} className="fa-solid fa-star" />
        ))}
      </div>
      <div className="di-testimonial-card__profile">
        <img src={item.image} alt={item.name} />
        <div>
          <h3 className="di-testimonial-card__name">{item.name}</h3>
          <span className="di-testimonial-card__role">{item.designation}</span>
        </div>
      </div>
    </article>
  );
}

export default TestimonialOne;
