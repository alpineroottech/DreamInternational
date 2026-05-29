import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import Posts from '../data/data-destination.json';
import Modal from '../Gallery/Modal';
import api from '../../admin/api/client';
import SafeHtml from '../../public-cms/SafeHtml';

const API_ORIGIN = (process.env.REACT_APP_API_URL || "http://localhost:4000/api").replace(/\/api$/, "");
function resolveUrl(url) {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("/assets")) return url;
    if (url.startsWith("/uploads")) return `${API_ORIGIN}${url}`;
    return url;
}

function DestinationDetailsMain() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState("");
    const { id } = useParams();
    const [cms, setCms] = useState(null);
    const [loading, setLoading] = useState(true);

    // API-first: treat the URL param as a slug and load published content from the CMS.
    useEffect(() => {
        let active = true;
        setLoading(true);
        api.get(`/public/destinations/${id}`)
            .then(({ data }) => { if (active) setCms(data); })
            .catch(() => { if (active) setCms(null); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [id]);

    // Fallback to bundled demo JSON for non-CMS (numeric) demo links.
    const destinationPost = Posts.find(post => post.id === parseInt(id)) || null;

    if (loading) {
        return <section className="space"><div className="container">Loading…</div></section>;
    }

    if (!cms && !destinationPost) {
        return <section className="space"><div className="container">Destination not found.</div></section>;
    }

    // Display model: prefer CMS content, fall back to demo JSON.
    const view = {
        name: cms?.name || destinationPost?.title || "Destination",
        bannerImg: cms?.heroImage?.url
            ? resolveUrl(cms.heroImage.url)
            : (destinationPost?.bannerImg?.startsWith("/")
                ? destinationPost.bannerImg
                : `/assets/img/destination/${destinationPost?.bannerImg}`),
        descriptionHtml: cms?.descriptionHtml || null,
        shortDescription: cms?.shortDescription || null,
        bestTimeToVisit: cms?.bestTimeToVisit || null,
        gettingThere: cms?.gettingThere || null,
        tips: cms?.tips || null,
        thingsToDo: cms?.thingsToDo || [],
        price: destinationPost?.price || "On request",
    };

    const openModal = (imageSrc, event) => {
        event.preventDefault();
        setModalImage(imageSrc);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);
    return (
        <section className="space">
            <div className="container">
                <div className="row">
                    <div className="col-xxl-8 col-lg-7">
                        <div className="page-single">
                            <div className="service-img">
                                <img src={view.bannerImg} alt={view.name} />
                            </div>
                            <div className="page-content d-block">
                                <div className="page-meta mt-50 mb-45">
                                    <Link className="page-tag mr-5" to="/tour">
                                        Featured
                                    </Link>
                                    <span className="ratting">
                                        <i className="fa-sharp fa-solid fa-star" />
                                        <span>4.8</span>
                                    </span>
                                </div>
                                <h2 className="box-title">
                                    Explore the Beauty of {view.name}
                                </h2>
                                {view.descriptionHtml ? (
                                    <SafeHtml className="blog-text mb-35" html={view.descriptionHtml} />
                                ) : (
                                    <p className="blog-text mb-30">{view.shortDescription}</p>
                                )}
                                <h2 className="box-title">Basic Information</h2>
                                <p className="blog-text mb-35">
                                    Pokhara lies in Kaski District at roughly 822 m elevation, with a mild
                                    climate compared to Kathmandu. The city is well connected by road (6–7
                                    hours from Kathmandu) and by short flights to Pokhara Airport. Lakeside
                                    remains the main tourist hub for hotels, restaurants, and tour operators.
                                </p>
                                <div className="destination-checklist">
                                    <div className="checklist style2">
                                        <ul>
                                            <li>Destination</li>
                                            <li>Visa Requirements</li>
                                            <li>Language</li>
                                            <li>Currency Used</li>
                                            <li>Elevation</li>
                                            <li>Best Season</li>
                                            <li>Sample Package</li>
                                        </ul>
                                    </div>
                                    <div className="checklist style2">
                                        <ul>
                                            <li>Pokhara, Nepal</li>
                                            <li>Tourist visa on arrival (most nationalities)</li>
                                            <li>Nepali, English widely spoken</li>
                                            <li>Nepalese Rupee (NPR)</li>
                                            <li>822 m (city centre)</li>
                                            <li>Mar–May, Sep–Nov</li>
                                            <li>{destinationPost.price}</li>
                                        </ul>
                                    </div>
                                </div>
                                <blockquote>
                                    <p>
                                        Pokhara gave us the perfect mix of lake views and mountain scenery.
                                        Sarangkot sunrise and a boat ride on Phewa Lake were highlights—we
                                        would book again with Dream International.
                                    </p>
                                    <cite>Guest review, Dream International Travel and Tours</cite>
                                </blockquote>
                                <p className="blog-text mb-35">
                                    <strong>Getting there:</strong> Tourist buses and private cars run daily
                                    from Kathmandu. Flights take about 25 minutes. We arrange airport
                                    transfers, Lakeside hotel check-in, and optional rafting or paragliding
                                    bookings.
                                </p>
                                <p className="blog-text mb-35">
                                    <strong>Where to stay:</strong> Lakeside (Baidam) has the widest choice of
                                    hotels from budget guesthouses to 4-star properties. For quieter stays,
                                    consider Damside or hillside lodges near the Peace Pagoda with valley views.
                                </p>
                                <h3 className="">
                                    Top experiences in and around Pokhara
                                </h3>
                                <p className="mb-35">
                                    Most visitors spend 2–4 nights in Pokhara before or after a trek. Popular
                                    add-ons include ultralight flights, zip-lining, mountain biking, and
                                    cultural visits to the International Mountain Museum and old bazaar areas.
                                </p>
                                <div className="service-inner-img mb-40">
                                    <img
                                        src="/assets/img/hero/R.jpg"
                                        alt="Phewa Lake and Annapurna range near Pokhara"
                                    />
                                </div>
                                <h2 className="box-title">Highlights</h2>
                                <div className="checklist">
                                    <ul>
                                        {(view.thingsToDo && view.thingsToDo.length > 0
                                            ? view.thingsToDo
                                            : [
                                                "Phewa Lake boating with views of Machhapuchhre",
                                                "Sarangkot sunrise over the Annapurna Himalayas",
                                                "World Peace Pagoda (Shanti Stupa) hill hike or drive",
                                              ]
                                        ).map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="destination-gallery-wrapper">
                                <h3 className="page-title mt-30 mb-30">From our gallery</h3>
                                <div className="row gy-4 gallery-row filter-active">
                                    <div className="col-xxl-auto filter-item">
                                        <div className="gallery-box style3">
                                            <div className="gallery-img global-img">
                                                <img
                                                    src="/assets/img/gallery/gallery_6_1.jpg"
                                                    alt="gallery"
                                                    onClick={(e) => openModal('/assets/img/gallery/gallery_6_1.jpg', e)}
                                                />
                                                <Link
                                                    to="/assets/img/gallery/gallery_6_1.jpg"
                                                    className="icon-btn popup-image"
                                                    onClick={(e) => openModal('/assets/img/gallery/gallery_6_1.jpg', e)}
                                                >
                                                    <i className="fal fa-magnifying-glass-plus" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xxl-auto filter-item">
                                        <div className="gallery-box style3">
                                            <div className="gallery-img global-img">
                                                <img
                                                    src="/assets/img/gallery/gallery_6_2.jpg"
                                                    alt="gallery"
                                                    onClick={(e) => openModal('/assets/img/gallery/gallery_6_2.jpg', e)}
                                                />
                                                <Link
                                                    to="/assets/img/gallery/gallery_6_2.jpg"
                                                    className="icon-btn popup-image"
                                                    onClick={(e) => openModal('/assets/img/gallery/gallery_6_2.jpg', e)}
                                                >
                                                    <i className="fal fa-magnifying-glass-plus" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xxl-auto filter-item">
                                        <div className="gallery-box style3">
                                            <div className="gallery-img global-img">
                                                <img
                                                    src="/assets/img/gallery/gallery_6_3.jpg"
                                                    alt="gallery"
                                                    onClick={(e) => openModal('/assets/img/gallery/gallery_6_3.jpg', e)}
                                                />
                                                <Link
                                                    to="/assets/img/gallery/gallery_6_3.jpg"
                                                    className="icon-btn popup-image"
                                                    onClick={(e) => openModal('/assets/img/gallery/gallery_6_3.jpg', e)}
                                                >
                                                    <i className="fal fa-magnifying-glass-plus" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xxl-auto filter-item">
                                        <div className="gallery-box style3">
                                            <div className="gallery-img global-img">
                                                <img
                                                    src="/assets/img/gallery/gallery_6_4.jpg"
                                                    alt="gallery"
                                                    onClick={(e) => openModal('/assets/img/gallery/gallery_6_4.jpg', e)}
                                                />
                                                <Link
                                                    to="/assets/img/gallery/gallery_6_4.jpg"
                                                    className="icon-btn popup-image"
                                                    onClick={(e) => openModal('/assets/img/gallery/gallery_6_4.jpg', e)}
                                                >
                                                    <i className="fal fa-magnifying-glass-plus" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="th-comments-wrap style2 ">
                                <h2 className="blog-inner-title h4">Reviews (3)</h2>
                                <ul className="comment-list">
                                    <li className="th-comment-item">
                                        <div className="th-post-comment">
                                            <div className="comment-avater">
                                                <img
                                                    src="/assets/img/blog/comment-author-1.jpg"
                                                    alt="Comment Author"
                                                />
                                            </div>
                                            <div className="comment-content">
                                                <h3 className="name">Adam Jhon</h3>
                                                <div className="commented-wrapp">
                                                    <span className="commented-on">20 Jun, 2024</span>
                                                    <span className="commented-time">08:56pm </span>
                                                    <span className="comment-review">
                                                        <i className="fa-solid fa-star" />
                                                        <i className="fa-solid fa-star" />
                                                        <i className="fa-solid fa-star" />
                                                        <i className="fa-solid fa-star" />
                                                        <i className="fa-solid fa-star" />
                                                    </span>
                                                </div>
                                                <p className="text">
                                                    Credibly pontificate transparent quality vectors with
                                                    quality mindshare. Efficiently architect worldwide
                                                    strategic theme areas after user.
                                                </p>
                                                <div className="reply_and_edit">
                                                    <i className="fa-solid fa-thumbs-up" />
                                                </div>
                                            </div>
                                        </div>
                                        <ul className="children">
                                            <li className="th-comment-item">
                                                <div className="th-post-comment">
                                                    <div className="comment-avater">
                                                        <img
                                                            src="/assets/img/blog/comment-author-4.jpg"
                                                            alt="Comment Author"
                                                        />
                                                    </div>
                                                    <div className="comment-content">
                                                        <div className="">
                                                            <h3 className="name">Maria Willson</h3>
                                                            <div className="commented-wrapp">
                                                                <span className="commented-on">23 Jun, 2024</span>
                                                                <span className="commented-time">08:56pm </span>
                                                                <span className="comment-review">
                                                                    <i className="fa-solid fa-star" />
                                                                    <i className="fa-solid fa-star" />
                                                                    <i className="fa-solid fa-star" />
                                                                    <i className="fa-solid fa-star" />
                                                                    <i className="fa-solid fa-star" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text">
                                                            It is different from airport transfer or port
                                                            transfer, which are services that pick you up
                                                        </p>
                                                        <div className="reply_and_edit">
                                                            <i className="fa-solid fa-thumbs-up" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="th-comment-item">
                                        <div className="th-post-comment">
                                            <div className="comment-avater">
                                                <img
                                                    src="/assets/img/blog/comment-author-5.jpg"
                                                    alt="Comment Author"
                                                />
                                            </div>
                                            <div className="comment-content">
                                                <div className="">
                                                    <h3 className="name">Michel Edwards</h3>
                                                    <div className="commented-wrapp">
                                                        <span className="commented-on">27 Jun, 2024</span>
                                                        <span className="commented-time">08:56pm </span>
                                                        <span className="comment-review">
                                                            <i className="fa-solid fa-star" />
                                                            <i className="fa-solid fa-star" />
                                                            <i className="fa-solid fa-star" />
                                                            <i className="fa-solid fa-star" />
                                                            <i className="fa-solid fa-star" />
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text">
                                                    Credibly pontificate transparent quality vectors with
                                                    quality mindshare. Efficiently architect worldwide
                                                    strategic theme areas after user.
                                                </p>
                                                <div className="reply_and_edit">
                                                    <i className="fa-solid fa-thumbs-up" />
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>{" "}
                            {/* Comment end */} {/* Comment Form */}
                            <div className="th-comment-form ">
                                <div className="row">
                                    <h3 className="blog-inner-title h4 mb-2">Leave a Reply</h3>
                                    <p className="mb-25">
                                        Your email address will not be published. Required fields are
                                        marked
                                    </p>
                                    <div className="col-md-6 form-group">
                                        <input
                                            type="text"
                                            placeholder="Full Name*"
                                            className="form-control"
                                            required=""
                                        />
                                        <i className="far fa-user" />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <input
                                            type="text"
                                            placeholder="Your Email*"
                                            className="form-control"
                                            required=""
                                        />
                                        <i className="far fa-envelope" />
                                    </div>
                                    <div className="col-12 form-group">
                                        <input
                                            type="text"
                                            placeholder="Website"
                                            className="form-control"
                                            required=""
                                        />
                                        <i className="far fa-globe" />
                                    </div>
                                    <div className="col-12 form-group">
                                        <textarea
                                            placeholder="Comment*"
                                            className="form-control"
                                            defaultValue={""}
                                        />
                                        <i className="far fa-pencil" />
                                    </div>
                                    <div className="col-12 form-group">
                                        <input type="checkbox" id="html" />
                                        <label htmlFor="html">
                                            Save my name, email, and website in this browser for the next
                                            time I comment.
                                        </label>
                                    </div>
                                    <div className="col-12 form-group mb-0">
                                        <button className="th-btn">
                                            Send Message
                                            <img src="/assets/img/icon/plane2.svg" alt="" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-4 col-lg-5">
                        <aside className="sidebar-area style3">
                            <div className="widget widget_search  ">
                                <form className="search-form">
                                    <input type="text" placeholder="Search" />
                                    <button type="submit">
                                        <i className="far fa-search" />
                                    </button>
                                </form>
                            </div>
                            <div className="widget widget_categories  ">
                                <h3 className="widget_title">Categories</h3>
                                <ul>
                                    <li>
                                        <Link to="/blog">
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            City Tour
                                        </Link>
                                        <span>(8)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            Beach Tours
                                        </Link>
                                        <span>(6)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            Wildlife Tours
                                        </Link>
                                        <span>(2)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            News &amp; Tips
                                        </Link>
                                        <span>(7)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            Adventure Tours
                                        </Link>
                                        <span>(9)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            Mountain Tours
                                        </Link>
                                        <span>(10)</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="widget  ">
                                <h3 className="widget_title">Recent Posts</h3>
                                <div className="recent-post-wrap">
                                    <div className="recent-post">
                                        <div className="media-img">
                                            <Link to="/blog/1">
                                                <img
                                                    src="/assets/img/blog/recent-post-1-1.jpg"
                                                    alt="Blog"
                                                />
                                            </Link>
                                        </div>
                                        <div className="media-body">
                                            <h4 className="post-title">
                                                <Link className="text-inherit" to="/blog/1">
                                                    Best time to visit Pokhara: weather and festivals
                                                </Link>
                                            </h4>
                                            <div className="recent-post-meta">
                                                <Link to="/blog">
                                                    <i className="fa-regular fa-calendar" />
                                                    22/6/ 2025
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="recent-post">
                                        <div className="media-img">
                                            <Link to="/blog/1">
                                                <img
                                                    src="/assets/img/blog/recent-post-1-2.jpg"
                                                    alt="Blog"
                                                />
                                            </Link>
                                        </div>
                                        <div className="media-body">
                                            <h4 className="post-title">
                                                <Link className="text-inherit" to="/blog/1">
                                                    Harmony With Nature Of Belgium Tour and travle
                                                </Link>
                                            </h4>
                                            <div className="recent-post-meta">
                                                <Link to="/blog">
                                                    <i className="fa-regular fa-calendar" />
                                                    25/6/ 2025
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="recent-post">
                                        <div className="media-img">
                                            <Link to="/blog/1">
                                                <img
                                                    src="/assets/img/blog/recent-post-1-3.jpg"
                                                    alt="Blog"
                                                />
                                            </Link>
                                        </div>
                                        <div className="media-body">
                                            <h4 className="post-title">
                                                <Link className="text-inherit" to="/blog/1">
                                                    Exploring The Green Spaces Of Realar Residence
                                                </Link>
                                            </h4>
                                            <div className="recent-post-meta">
                                                <Link to="/blog">
                                                    <i className="fa-regular fa-calendar" />
                                                    27/6/ 2025
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="widget widget_tag_cloud  ">
                                <h3 className="widget_title">Popular Tags</h3>
                                <div className="tagcloud">
                                    <Link to="/blog">Tour</Link>
                                    <Link to="/blog">Adventure</Link>
                                    <Link to="/blog">Rent</Link>
                                    <Link to="/blog">Innovate</Link>
                                    <Link to="/blog">Hotel</Link>
                                    <Link to="/blog">Modern</Link>
                                    <Link to="/blog">Luxury</Link>
                                    <Link to="/blog">Travel</Link>
                                </div>
                            </div>
                            <div
                                className="widget widget_offer" style={{ background: 'url(/assets/img/bg/widget_bg_1.jpg)', backgroundRepeat: "no-repeat", backgroundSize:"cover" }}
                            >
                                <div className="offer-banner">
                                    <div className="offer">
                                        <h6 className="box-title">
                                            Need Help? We Are Here To Help You
                                        </h6>
                                        <div className="banner-logo">
                                            <img src="/assets/img/logo2.svg" alt="Dream International Travel and Tours" />
                                        </div>
                                        <div className="offer">
                                            <h6 className="offer-title">You Get Online support</h6>
                                            <Link className="offter-num" to={+256214203215}>
                                                +256 214 203 215
                                            </Link>
                                        </div>
                                        <Link to="/contact" className="th-btn style2 th-icon">
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
            <Modal isOpen={isModalOpen} closeModal={closeModal} imageSrc={modalImage} />
        </section>
    )
}

export default DestinationDetailsMain
