import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSettings, useCollection, resolveCmsList, publicApi } from '../../public-cms/hooks'
import { BRAND_NAME, LOGO_FOOTER } from '../../brand/brandAssets'
import { tourDetailPath } from '../../lib/tourUrls'
import BrandOne from '../Brand/BrandOne'

const POPULAR_TOURS_FALLBACK = [
    { title: 'Annapurna Base Camp Trek', slug: 'annapurna-base-camp-trek', market: 'nepal' },
    { title: 'Everest Base Camp Trek', slug: 'everest-base-camp-trek', market: 'nepal' },
    { title: 'Kathmandu Valley Cultural Tour', slug: 'kathmandu-valley-cultural-tour', market: 'nepal' },
    { title: 'Chitwan Jungle Safari', slug: 'chitwan-jungle-safari', market: 'nepal' },
];

const COMPANY_LINKS = [
    { label: 'FAQ', url: '/faq' },
    { label: 'Terms & Conditions', url: '/terms-and-conditions' },
    { label: 'Privacy Policy', url: '/privacy-policy' },
    { label: 'Cancellation Policy', url: '/cancellation-policy' },
];

function Newsletter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ state: 'idle', msg: '' });

    const submit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setStatus({ state: 'sending', msg: '' });
        try {
            await publicApi.post('/public/inquiries', {
                name: 'Newsletter Subscriber',
                email,
                message: 'Newsletter signup — please add this address to travel deals & updates.',
            });
            setStatus({ state: 'success', msg: "You're subscribed! Watch your inbox for deals." });
            setEmail('');
        } catch {
            setStatus({ state: 'error', msg: 'Something went wrong. Please try again.' });
        }
    };

    return (
        <div className="di-footer__newsletter">
            <div className="container">
                <div className="di-footer__newsletter-inner">
                    <div className="di-footer__newsletter-copy">
                        <h4>Get travel deals &amp; updates</h4>
                        <p>Trekking offers, seasonal packages, and travel tips — straight to your inbox.</p>
                    </div>
                    <form className="di-footer__newsletter-form" onSubmit={submit} noValidate>
                        <input
                            type="email"
                            required
                            placeholder="Your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-label="Email address"
                        />
                        <button type="submit" className="th-btn th-btn-accent" disabled={status.state === 'sending'}>
                            {status.state === 'sending' ? 'Subscribing…' : 'Subscribe'}
                        </button>
                    </form>
                </div>
                {status.state === 'success' && <p className="di-footer__newsletter-msg success">{status.msg}</p>}
                {status.state === 'error' && <p className="di-footer__newsletter-msg error">{status.msg}</p>}
            </div>
        </div>
    );
}

function FooterOne() {
    const settings = useSettings();
    const socials = [
        { url: settings.facebookUrl, icon: "fab fa-facebook-f", label: "Facebook" },
        { url: settings.instagramUrl, icon: "fab fa-instagram", label: "Instagram" },
        { url: settings.youtubeUrl, icon: "fab fa-youtube", label: "YouTube" },
        { url: settings.tripadvisorUrl, icon: "fab fa-tripadvisor", label: "TripAdvisor" },
    ].filter((s) => s.url);
    const quickLinks = (Array.isArray(settings.footerColumns) && settings.footerColumns[0]) || {
        title: "Quick Links",
        links: [
            { label: "Home", url: "/" },
            { label: "About Us", url: "/about" },
            { label: "Nepal Experiences", url: "/tour" },
            { label: "International Holidays", url: "/international-holidays" },
            { label: "Services", url: "/service" },
            { label: "Contact", url: "/contact" },
        ],
    };

    const popularToursCms = useCollection('/public/tours', { featured: true, market: 'nepal' });
    const { items: popularTours } = resolveCmsList(popularToursCms, POPULAR_TOURS_FALLBACK);

    const phone = settings.contactPhone || "+977-1-0000000";
    const email = settings.contactEmail || "info@dreaminternationaltours.com";
    const address = settings.address || "Kathmandu, Nepal";
    const officeHours = settings.officeHours || "Sun to Fri: 8:00 am - 7:00 pm";
    const whatsapp = settings.whatsappNumber || phone;
    const waHref = `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`;

    return (
        <footer className="footer-wrapper footer-layout1 di-footer">
            <Newsletter />

            <div className="widget-area">
                <div className="container">
                    <div className="row g-4 g-xl-5 align-items-start di-footer__grid di-footer__grid--expanded">
                        <div className="col-lg-3 col-md-6">
                            <div className="widget footer-widget di-footer__brand">
                                <div className="th-widget-about">
                                    <div className="about-logo">
                                        <Link to="/">
                                            <img
                                                src={LOGO_FOOTER}
                                                alt={BRAND_NAME}
                                                className="di-logo-footer"
                                                width="1080"
                                                height="1080"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </Link>
                                    </div>
                                    <p className="about-text">
                                        {settings.footerAbout ||
                                            "Dream International Travel and Tours — your trusted partner for trekking, cultural tours, and tailor-made journeys across Nepal."}
                                    </p>
                                    <p className="di-footer__iata">
                                        <i className="fa-solid fa-award" aria-hidden="true" /> IATA Accredited Travel Company
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

                        <div className="col-lg-2 col-md-6">
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

                        <div className="col-lg-2 col-md-6">
                            <div className="widget widget_nav_menu footer-widget di-footer__links">
                                <h3 className="widget_title">Popular Tours</h3>
                                <ul className="menu di-footer__menu">
                                    {popularTours.slice(0, 5).map((t, i) => (
                                        <li key={t.slug || i}>
                                            <Link to={t.slug ? tourDetailPath(t, t.market || 'nepal') : '/tour'}>
                                                {t.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-2 col-md-6">
                            <div className="widget widget_nav_menu footer-widget di-footer__links">
                                <h3 className="widget_title">Support</h3>
                                <ul className="menu di-footer__menu">
                                    {COMPANY_LINKS.map((l, i) => (
                                        <li key={i}>
                                            <Link to={l.url}>{l.label}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6">
                            <div className="widget footer-widget di-footer__contact">
                                <h3 className="widget_title">Contact</h3>
                                <div className="th-widget-contact di-footer__contact-list">
                                    <div className="info-box_text">
                                        <div className="icon" aria-hidden="true">
                                            <img src="/assets/img/icon/location-dot.svg" alt="" width="18" height="18" loading="lazy" decoding="async" />
                                        </div>
                                        <div className="details">
                                            <p>{address}</p>
                                        </div>
                                    </div>
                                    <div className="info-box_text">
                                        <div className="icon" aria-hidden="true">
                                            <img src="/assets/img/icon/envelope.svg" alt="" width="18" height="18" loading="lazy" decoding="async" />
                                        </div>
                                        <div className="details">
                                            <p>
                                                <Link to={`mailto:${email}`} className="info-box_link">
                                                    {email}
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="info-box_text">
                                        <div className="icon" aria-hidden="true">
                                            <img src="/assets/img/icon/phone.svg" alt="" width="18" height="18" loading="lazy" decoding="async" />
                                        </div>
                                        <div className="details">
                                            <p>
                                                <Link to={`tel:${phone.replace(/\s/g, "")}`} className="info-box_link">
                                                    {phone}
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="info-box_text">
                                        <div className="icon" aria-hidden="true">
                                            <i className="fab fa-whatsapp" />
                                        </div>
                                        <div className="details">
                                            <p>
                                                <a href={waHref} target="_blank" rel="noopener noreferrer" className="info-box_link">
                                                    WhatsApp: {whatsapp}
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="info-box_text">
                                        <div className="icon" aria-hidden="true">
                                            <i className="fa-regular fa-clock" />
                                        </div>
                                        <div className="details">
                                            <p>{officeHours}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BrandOne className="di-footer__brands" />

            <div className="copyright-wrap">
                <div className="container">
                    <div className="row align-items-center gy-3">
                        <div className="col-md-5">
                            <p className="copyright-text mb-0">
                                Copyright {new Date().getFullYear()}{" "}
                                <Link to="/">{settings.siteTitle || BRAND_NAME}</Link>. All Rights Reserved.
                            </p>
                        </div>
                        <div className="col-md-3">
                            <div className="di-footer__legal-links">
                                <Link to="/privacy-policy">Privacy Policy</Link>
                                <span aria-hidden="true">·</span>
                                <Link to="/terms-and-conditions">Terms</Link>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="footer-card di-footer__payments">
                                <img src="/assets/img/shape/cards.png" alt="Accepted payment methods" width="240" height="32" loading="lazy" decoding="async" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default FooterOne
