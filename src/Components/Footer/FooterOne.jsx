import React from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../../public-cms/hooks'

function FooterOne() {
    const settings = useSettings();
    const socials = [
        { url: settings.facebookUrl, icon: "fab fa-facebook-f" },
        { url: settings.tripadvisorUrl, icon: "fab fa-tripadvisor" },
        { url: settings.youtubeUrl, icon: "fab fa-youtube" },
        { url: settings.instagramUrl, icon: "fab fa-instagram" },
    ].filter((s) => s.url);
    const quickLinks = (Array.isArray(settings.footerColumns) && settings.footerColumns[0]) || {
        title: "Quick Links",
        links: [
            { label: "Home", url: "/" },
            { label: "About us", url: "/about" },
            { label: "Our Service", url: "/service" },
            { label: "Contact", url: "/contact" },
        ],
    };
    return (
        <footer className="footer-wrapper footer-layout1">
            <div className="widget-area">
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-md-6 col-xl-3">
                            <div className="widget footer-widget">
                                <div className="th-widget-about">
                                    <div className="about-logo">
                                        <Link to="/">
                                            <img
                                                src="/assets/img/Logo.jpg"
                                                alt="Dream International Travel and Tours"
                                                style={{ height: "88px", width: "auto", objectFit: "contain" }}
                                            />
                                        </Link>
                                    </div>
                                    <p className="about-text">
                                        {settings.footerAbout ||
                                            "Dream International Travel and Tours — your trusted partner for trekking, cultural tours, and tailor-made journeys across Nepal."}
                                    </p>
                                    <div className="th-social">
                                        {socials.map((s, i) => (
                                            <Link key={i} to={s.url} target="_blank" rel="noopener noreferrer">
                                                <i className={s.icon} />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-auto">
                            <div className="widget widget_nav_menu footer-widget">
                                <h3 className="widget_title">{quickLinks.title || "Quick Links"}</h3>
                                <div className="menu-all-pages-container">
                                    <ul className="menu">
                                        {(quickLinks.links || []).map((l, i) => (
                                            <li key={i}>
                                                <Link to={l.url || "#"}>{l.label}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-auto">
                            <div className="widget footer-widget">
                                <h3 className="widget_title">Address</h3>
                                <div className="th-widget-contact">
                                    <div className="info-box_text">
                                        <div className="icon">
                                            <img src="/assets/img/icon/phone.svg" alt="img" />
                                        </div>
                                        <div className="details">
                                            <p>
                                                <Link to={`tel:${(settings.contactPhone || "").replace(/\s/g, "")}`} className="info-box_link">
                                                    {settings.contactPhone || "+977-1-0000000"}
                                                </Link>
                                            </p>
                                            {settings.whatsappNumber && (
                                                <p>
                                                    <Link to={`tel:${settings.whatsappNumber.replace(/\s/g, "")}`} className="info-box_link">
                                                        {settings.whatsappNumber}
                                                    </Link>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="info-box_text">
                                        <div className="icon">
                                            <img src="/assets/img/icon/envelope.svg" alt="img" />
                                        </div>
                                        <div className="details">
                                            <p>
                                                <Link
                                                    to={`mailto:${settings.contactEmail || "info@dreaminternationaltours.com"}`}
                                                    className="info-box_link"
                                                >
                                                    {settings.contactEmail || "info@dreaminternationaltours.com"}
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="info-box_text">
                                        <div className="icon">
                                            <img src="/assets/img/icon/location-dot.svg" alt="img" />
                                        </div>
                                        <div className="details">
                                            <p>{settings.address || "Kathmandu, Nepal"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-auto">
                            <div className="widget footer-widget">
                                <h3 className="widget_title">Instagram Post</h3>
                                <div className="sidebar-gallery">
                                    <div className="gallery-thumb">
                                        <img
                                            src="/assets/img/widget/gallery_1_1.jpg"
                                            alt="Gallery"
                                        />
                                        <Link
                                            target="_blank"
                                            to="https://www.instagram.com/"
                                            className="gallery-btn"
                                        >
                                            <i className="fab fa-instagram" />
                                        </Link>
                                    </div>
                                    <div className="gallery-thumb">
                                        <img
                                            src="/assets/img/widget/gallery_1_2.jpg"
                                            alt="Gallery"
                                        />
                                        <Link
                                            target="_blank"
                                            to="https://www.instagram.com/"
                                            className="gallery-btn"
                                        >
                                            <i className="fab fa-instagram" />
                                        </Link>
                                    </div>
                                    <div className="gallery-thumb">
                                        <img
                                            src="/assets/img/widget/gallery_1_3.jpg"
                                            alt="Gallery"
                                        />
                                        <Link
                                            target="_blank"
                                            to="https://www.instagram.com/"
                                            className="gallery-btn"
                                        >
                                            <i className="fab fa-instagram" />
                                        </Link>
                                    </div>
                                    <div className="gallery-thumb">
                                        <img
                                            src="/assets/img/widget/gallery_1_4.jpg"
                                            alt="Gallery"
                                        />
                                        <Link
                                            target="_blank"
                                            to="https://www.instagram.com/"
                                            className="gallery-btn"
                                        >
                                            <i className="fab fa-instagram" />
                                        </Link>
                                    </div>
                                    <div className="gallery-thumb">
                                        <img
                                            src="/assets/img/widget/gallery_1_5.jpg"
                                            alt="Gallery"
                                        />
                                        <Link
                                            target="_blank"
                                            to="https://www.instagram.com/"
                                            className="gallery-btn"
                                        >
                                            <i className="fab fa-instagram" />
                                        </Link>
                                    </div>
                                    <div className="gallery-thumb">
                                        <img
                                            src="/assets/img/widget/gallery_1_6.jpg"
                                            alt="Gallery"
                                        />
                                        <Link
                                            target="_blank"
                                            to="https://www.instagram.com/"
                                            className="gallery-btn"
                                        >
                                            <i className="fab fa-instagram" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="copyright-wrap background-image"
                style={{ backgroundImage: "url('/assets/img/bg/copyright_bg_1.jpg')" }}
            >
                <div className="container">
                    <div className="row justify-content-between align-items-center">
                        <div className="col-md-6">
                            <p className="copyright-text">
                                Copyright {new Date().getFullYear()} <Link to="/">{settings.siteTitle || "Dream International Travel and Tours"}</Link>. All Rights
                                Reserved.
                            </p>
                        </div>
                        <div className="col-md-6 text-end d-none d-md-block">
                            <div className="footer-card">
                                <span className="title">We Accept</span>
                                <img src="/assets/img/shape/cards.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </footer>

    )
}

export default FooterOne
