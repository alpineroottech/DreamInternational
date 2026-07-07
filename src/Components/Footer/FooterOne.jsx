import React from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../../public-cms/hooks'
import { BRAND_NAME, LOGO_FOOTER } from '../../brand/brandAssets'

function FooterOne() {
    const settings = useSettings();
    const socials = [
        { url: settings.facebookUrl, icon: "fab fa-facebook-f", label: "Facebook" },
        { url: settings.tripadvisorUrl, icon: "fab fa-tripadvisor", label: "TripAdvisor" },
        { url: settings.youtubeUrl, icon: "fab fa-youtube", label: "YouTube" },
        { url: settings.instagramUrl, icon: "fab fa-instagram", label: "Instagram" },
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

    const phone = settings.contactPhone || "+977-1-0000000";
    const email = settings.contactEmail || "info@dreaminternationaltours.com";
    const address = settings.address || "Kathmandu, Nepal";

    return (
        <footer className="footer-wrapper footer-layout1 di-footer">
            <div className="widget-area">
                <div className="container">
                    <div className="row g-4 g-xl-5 align-items-start di-footer__grid">
                        <div className="col-lg-4 col-md-6">
                            <div className="widget footer-widget di-footer__brand">
                                <div className="th-widget-about">
                                    <div className="about-logo">
                                        <Link to="/">
                                            <img
                                                src={LOGO_FOOTER}
                                                alt={BRAND_NAME}
                                                className="di-logo-footer"
                                            />
                                        </Link>
                                    </div>
                                    <p className="about-text">
                                        {settings.footerAbout ||
                                            "Dream International Travel and Tours — your trusted partner for trekking, cultural tours, and tailor-made journeys across Nepal."}
                                    </p>
                                    {socials.length > 0 && (
                                        <div className="th-social di-footer__social">
                                            {socials.map((s) => (
                                                <Link
                                                    key={s.label}
                                                    to={s.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={s.label}
                                                >
                                                    <i className={s.icon} />
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6">
                            <div className="widget widget_nav_menu footer-widget di-footer__links">
                                <h3 className="widget_title">{quickLinks.title || "Quick Links"}</h3>
                                <ul className="menu di-footer__menu">
                                    {(quickLinks.links || []).map((l, i) => (
                                        <li key={i}>
                                            <Link to={l.url || "#"}>{l.label}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-5 col-md-12">
                            <div className="widget footer-widget di-footer__contact">
                                <h3 className="widget_title">Get in touch</h3>
                                <div className="th-widget-contact di-footer__contact-list">
                                    <div className="info-box_text">
                                        <div className="icon" aria-hidden="true">
                                            <img src="/assets/img/icon/phone.svg" alt="" />
                                        </div>
                                        <div className="details">
                                            <p className="di-footer__contact-label">Phone</p>
                                            <p>
                                                <Link to={`tel:${phone.replace(/\s/g, "")}`} className="info-box_link">
                                                    {phone}
                                                </Link>
                                            </p>
                                            {settings.whatsappNumber && (
                                                <p>
                                                    <Link
                                                        to={`tel:${settings.whatsappNumber.replace(/\s/g, "")}`}
                                                        className="info-box_link"
                                                    >
                                                        {settings.whatsappNumber}
                                                    </Link>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="info-box_text">
                                        <div className="icon" aria-hidden="true">
                                            <img src="/assets/img/icon/envelope.svg" alt="" />
                                        </div>
                                        <div className="details">
                                            <p className="di-footer__contact-label">Email</p>
                                            <p>
                                                <Link to={`mailto:${email}`} className="info-box_link">
                                                    {email}
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="info-box_text">
                                        <div className="icon" aria-hidden="true">
                                            <img src="/assets/img/icon/location-dot.svg" alt="" />
                                        </div>
                                        <div className="details">
                                            <p className="di-footer__contact-label">Address</p>
                                            <p>{address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="copyright-wrap">
                <div className="container">
                    <div className="row align-items-center gy-3">
                        <div className="col-md-7">
                            <p className="copyright-text mb-0">
                                Copyright {new Date().getFullYear()}{" "}
                                <Link to="/">{settings.siteTitle || BRAND_NAME}</Link>. All Rights Reserved.
                            </p>
                        </div>
                        <div className="col-md-5">
                            <div className="footer-card di-footer__payments">
                                <span className="title">We Accept</span>
                                <img src="/assets/img/shape/cards.png" alt="Accepted payment methods" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default FooterOne
