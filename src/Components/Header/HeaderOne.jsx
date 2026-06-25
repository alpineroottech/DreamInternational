import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MobileMenu from './MobileMenu';
import { useSettings } from '../../public-cms/hooks';

const DEFAULT_NAV = [
    { label: "Home", url: "/" },
    { label: "About", url: "/about" },
    { label: "Tours", url: "/tour" },
    { label: "Destinations", url: "/destination" },
    { label: "Activities", url: "/activities" },
    { label: "Services", url: "/service" },
    {
        label: "Ticketing",
        url: "#",
        children: [
            { label: "Domestic Flights", url: "/ticketing/domestic" },
            { label: "International Flights", url: "/ticketing/international" },
        ],
    },
    { label: "Blog", url: "/blog" },
    { label: "Contact", url: "/contact" },
];

const TICKETING_NAV = DEFAULT_NAV.find((item) => item.label === "Ticketing");

function withTicketingNav(items) {
    if (!Array.isArray(items) || !items.length) return DEFAULT_NAV;
    const hasTicketing = items.some(
        (item) =>
            item.label === "Ticketing" ||
            item.children?.some((child) => child.url?.startsWith("/ticketing"))
    );
    if (hasTicketing) return items;
    const blogIdx = items.findIndex((item) => item.label === "Blog" || item.url === "/blog");
    const insertAt = blogIdx >= 0 ? blogIdx : items.length;
    return [...items.slice(0, insertAt), TICKETING_NAV, ...items.slice(insertAt)];
}

function HeaderOne() {
    const settings = useSettings();
    const nav = withTicketingNav(
        Array.isArray(settings.headerNav) && settings.headerNav.length ? settings.headerNav : DEFAULT_NAV
    );
    const [isSticky, setIsSticky] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 500) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            {/*============================== Header Area ==============================*/}
            <header className="th-header header-layout1">
                <div className="header-top">
                    <div className="container th-container">
                        <div className="row justify-content-center justify-content-xl-between align-items-center">
                            <div className="col-auto d-none d-md-block">
                                <div className="header-links">
                                    <ul>
                                        <li className="d-none d-xl-inline-block">
                                            <i className="fa-sharp fa-regular  fa-location-dot" />
                                            <span>{settings.address || "Kathmandu, Nepal"}</span>
                                        </li>
                                        <li className="d-none d-xl-inline-block">
                                            <i className="fa-regular fa-clock" />
                                            <span>{settings.officeHours || "Sun to Fri: 8:00 am - 7:00 pm"}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-auto">
                                <div className="header-right">
                                    <div className="header-links">
                                        <ul>
                                            <li className="d-none d-md-inline-block">
                                                <Link to="/faq">FAQ</Link>
                                            </li>
                                            <li className="d-none d-md-inline-block">
                                                <Link to="/contact">Support</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`sticky-wrapper ${isSticky ? "sticky" : ""}`}>
                    {/* Main Menu Area */}
                    <div className="menu-area">
                        <div className="container th-container">
                            <div className="row align-items-center justify-content-between">
                                <div className="col-auto">
                                    <div className="header-logo">
                                        <Link
                                            to="/"
                                            style={{
                                                display: "inline-flex",
                                                flexDirection: "column",
                                                lineHeight: 1,
                                                textDecoration: "none",
                                                whiteSpace: "nowrap"
                                            }}
                                            aria-label="Dream International Travel and Tours"
                                        >
                                            <span className="di-logo-main">
                                                Dream International
                                            </span>
                                            <span className="di-logo-sub">
                                                Travel and Tours
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-auto me-xxl-auto">
                                    <nav className="main-menu d-none d-xxl-inline-block">
                                        <ul>
                                            {nav.map((item, i) => (
                                                <li key={i} className={item.children?.length ? "menu-item-has-children" : ""}>
                                                    <Link to={item.url || "#"}>{item.label}</Link>
                                                    {item.children?.length > 0 && (
                                                        <ul className="sub-menu">
                                                            {item.children.map((child, ci) => (
                                                                <li key={ci}>
                                                                    <Link to={child.url || "#"}>{child.label}</Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </nav>
                                    <button
                                        type="button"
                                        className="th-menu-toggle d-block d-xxl-none"
                                        onClick={() => setIsMobileMenuOpen(true)}
                                    >
                                        <i className="far fa-bars" />
                                    </button>
                                </div>
                                <div className="col-auto d-none d-xxl-block">
                                    <div className="header-button">
                                        <Link to="/contact" className="th-btn style3 th-icon">
                                            Book Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="logo-bg bg-mask"
                            style={{
                                WebkitMaskImage: "url(/assets/img/logo_bg_mask.png)",
                                maskImage: "url()"
                            }} />
                    </div>
                </div>
            </header>
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} nav={nav} />
        </>

    )
}

export default HeaderOne
