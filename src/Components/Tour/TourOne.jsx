import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';
import { useCollection, resolveAssetUrl } from '../../public-cms/hooks';

const FALLBACK = [
  { slug: 'greece-tour-package', title: 'Greece Tour Package', featuredImageUrl: '/assets/img/tour/tour_box_1.jpg', basePrice: 980, durationDays: 7 },
  { slug: 'italy-tour-package', title: 'Italy Tour Package', featuredImageUrl: '/assets/img/tour/tour_box_2.jpg', basePrice: 980, durationDays: 7 },
  { slug: 'dubai-tour-package', title: 'Dubai Tour Package', featuredImageUrl: '/assets/img/tour/tour_box_3.jpg', basePrice: 980, durationDays: 7 },
  { slug: 'switzerland-tour', title: 'Switzerland Tour', featuredImageUrl: '/assets/img/tour/tour_box_4.jpg', basePrice: 980, durationDays: 7 },
];

function TourOne({ data = {} }) {
  const cms = useCollection('/public/tours', { featured: true });
  const tours = cms && cms.length ? cms : FALLBACK;

  return (
    <section className="tour-area position-relative overflow-hidden space" id="service-sec">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="title-area text-center">
              <span className="sub-title">{data.subTitle || 'Best Place For You'}</span>
              <h2 className="sec-title">{data.title || 'Most Popular Tour'}</h2>
              {data.text && <p className="sec-text">{data.text}</p>}
            </div>
          </div>
        </div>
        <div className="slider-area tour-slider">
          <Swiper
            breakpoints={{
              0: { slidesPerView: 1 },
              576: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
              1300: { slidesPerView: 4 },
            }}
            spaceBetween={24}
            grabCursor
            className="swiper th-slider has-shadow slider-drag-wrap"
          >
            {tours.map((tour) => {
              const to = `/tour-details?slug=${tour.slug}`;
              const catName = tour.category?.name;
              const catSlug = tour.category?.slug;
              return (
                <SwiperSlide key={tour.slug || tour.id}>
                  <div className="tour-box th-ani gsap-cursor">
                    <div className="tour-box_img global-img">
                      <img src={resolveAssetUrl(tour.featuredImageUrl) || '/assets/img/tour/tour_box_1.jpg'} alt={tour.title} />
                      {catName && (
                        <Link
                          to={catSlug ? `/tour?category=${catSlug}` : '/tour'}
                          className="di-tour-tag"
                        >
                          {catName}
                        </Link>
                      )}
                    </div>
                    <div className="tour-content">
                      <h3 className="box-title">
                        <Link to={to}>{tour.title}</Link>
                      </h3>
                      <div className="tour-rating">
                        <div className="star-rating" role="img" aria-label="Rated 4.8 out of 5">
                          <span style={{ width: '96%' }}>Rated <strong className="rating">4.8</strong> out of 5</span>
                        </div>
                      </div>
                      <h4 className="tour-box_price">
                        <span className="currency">{tour.basePrice ? `$${tour.basePrice}` : 'On request'}</span>
                        {tour.basePrice ? <span style={{ fontWeight: 400, fontSize: '0.85em' }}>/Person</span> : ''}
                      </h4>
                      <div className="tour-action">
                        <span>
                          <i className="fa-light fa-clock" />
                          {tour.durationDays ? ` ${tour.durationDays} Days` : ' Flexible'}
                        </span>
                        <Link to={to} className="th-btn style4 th-icon">View Details</Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default TourOne;
