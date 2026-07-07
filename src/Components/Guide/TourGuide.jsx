import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { useCollection, resolveAssetUrl, resolveCmsList } from "../../public-cms/hooks";

const FALLBACK = [
  { id: 1, name: "Jacob Jones", photoUrl: "/assets/img/team/team_1_1.jpg", role: "Team Member" },
  { id: 2, name: "Jane Cooper", photoUrl: "/assets/img/team/team_1_2.jpg", role: "Team Member" },
  { id: 3, name: "Guy Hawkins", photoUrl: "/assets/img/team/team_1_3.jpg", role: "Team Member" },
  { id: 4, name: "Jenny Wilson", photoUrl: "/assets/img/team/team_1_4.jpg", role: "Team Member" },
];

function TourGuide({ data = {} }) {
  const cms = useCollection("/public/team");
  const { loading, items: guides } = resolveCmsList(cms, FALLBACK);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const paginationRef = useRef(null);

  useEffect(() => {
    if (swiperInstance && paginationRef.current) {
      swiperInstance.params.pagination.el = paginationRef.current;
      swiperInstance.pagination.init();
      swiperInstance.pagination.update();
    }
  }, [swiperInstance]);

  if (loading) return null;

  return (
    <section className="di-team-section space overflow-hidden">
      <div className="container z-index-common">
        <div className="title-area text-center">
          <span className="sub-title">{data.subTitle || "Our Team"}</span>
          <h2 className="sec-title">{data.title || "Meet Our Team"}</h2>
        </div>
        <div className="slider-area">
          <Swiper
            modules={[Pagination, Autoplay]}
            slidesPerView={1}
            spaceBetween={20}
            speed={1200}
            breakpoints={{
              576: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            className="th-slider teamSlider1 has-shadow"
            onSwiper={setSwiperInstance}
          >
            {guides.map((guide) => {
              const socials = guide.socials || {};
              return (
                <SwiperSlide key={guide.id || guide.slug}>
                  <div className="th-team team-box">
                    <div className="team-img">
                      <img src={resolveAssetUrl(guide.photoUrl) || "/assets/img/team/team_1_1.jpg"} alt={guide.name} />
                    </div>
                    <div className="team-content">
                      <div className="media-body">
                        <h3 className="box-title">
                          <Link to={guide.slug ? `/tour-guide/${guide.slug}` : "/tour-guide/1"}>{guide.name}</Link>
                        </h3>
                        <span className="team-desig">{guide.role || "Team Member"}</span>
                        <div className="th-social">
                          {["facebook", "twitter", "instagram", "linkedin"].map((platform) => (
                            <Link key={platform} target="_blank" rel="noopener noreferrer" to={socials[platform] || `https://${platform}.com/`}>
                              <i className={`fab fa-${platform}`} />
                            </Link>
                          ))}
                        </div>
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

export default TourGuide;
