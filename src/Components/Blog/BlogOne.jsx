import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useCollection, resolveAssetUrl, resolveCmsList } from "../../public-cms/hooks";

const FALLBACK = [
  { id: 1, date: "", readTime: "6 min read", title: "Top treks in Nepal for first-timers", image: "/assets/img/blog/blog_1_1.jpg", detailsLink: "/blog/1" },
  { id: 2, date: "", readTime: "7 min read", title: "A cultural guide to Kathmandu Valley", image: "/assets/img/blog/blog_1_2.jpg", detailsLink: "/blog/1" },
  { id: 3, date: "", readTime: "8 min read", title: "Best destinations for adventure seekers", image: "/assets/img/blog/blog_1_3.jpg", detailsLink: "/blog/1" },
];

function BlogOne({ data = {} }) {
  const cms = useCollection("/public/blog");
  const { loading, items: blogPosts } = resolveCmsList(cms, FALLBACK);
  const posts = cms && cms.length
    ? cms.map((p) => ({
        id: p.slug,
        date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : "",
        readTime: "",
        title: p.title,
        image: resolveAssetUrl(p.coverImageUrl),
        detailsLink: `/blog/${p.slug}`,
      }))
    : blogPosts;
  if (loading) return null;
  return (
    <section className="bg-smoke overflow-hidden space overflow-hidden" id="blog-sec">
      <div className="container shape-mockup-wrap">
        <div className="mb-30 text-center text-md-start">
          <div className="row align-items-center justify-content-between">
            <div className="col-md-7">
              <div className="title-area mb-md-0">
                <span className="sub-title">{data.subTitle || "Our Blog"}</span>
                <h2 className="sec-title">{data.title || "News & Articles From Dream International"}</h2>
              </div>
            </div>
            <div className="col-md-auto">
              <Link to="/blog" className="th-btn style4 th-icon" aria-label="See more travel articles and guides">
                See More Articles
              </Link>
            </div>
          </div>
        </div>

        {/* Swiper Slider */}
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          breakpoints={{
            576: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            992: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
          className="swiper th-slider has-shadow"
        >
          {posts.map((post) => (
            <SwiperSlide key={post.id}>
              <div className="blog-box th-ani">
                {post.image && (
                  <div className="blog-img global-img">
                    <img src={post.image} alt={post.title || 'Dream International blog article'} width="424" height="274" loading="lazy" decoding="async" />
                  </div>
                )}
                <div className="blog-box_content">
                  {(post.date || post.readTime) && (
                    <div className="blog-meta">
                      {post.date && (
                        <Link className="author" to={post.detailsLink} aria-label={`Published ${post.date}`}>
                          {post.date}
                        </Link>
                      )}
                      {post.readTime && (
                        <Link to={post.detailsLink} aria-label={`Reading time ${post.readTime}`}>{post.readTime}</Link>
                      )}
                    </div>
                  )}
                  <h3 className="box-title">
                    <Link to={post.detailsLink}>{post.title}</Link>
                  </h3>
                  <Link to={post.detailsLink} className="th-btn style4 th-icon" aria-label={`Read more: ${post.title}`}>
                    Read More
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Decorative Shapes */}
        <div className="shape-mockup shape1 d-none d-xxl-block" style={{bottom:"20%", left:"-17%"}} aria-hidden="true">
          <img src="/assets/img/shape/shape_1.png" alt="" width="120" height="120" loading="lazy" decoding="async" />
        </div>
        <div className="shape-mockup shape2 d-none d-xl-block" style={{bottom:"5%", left:"-17%"}} aria-hidden="true">
          <img src="/assets/img/shape/shape_2.png" alt="" width="120" height="120" loading="lazy" decoding="async" />
        </div>
        <div className="shape-mockup shape3 d-none d-xxl-block" style={{bottom:"12%", left:"-10%"}} aria-hidden="true">
          <img src="/assets/img/shape/shape_3.png" alt="" width="120" height="120" loading="lazy" decoding="async" />
        </div>
      </div>
    </section>
  );
}

export default BlogOne;
