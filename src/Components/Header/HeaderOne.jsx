import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import NiceSelect from './NiceSelect';
import MobileMenu from './MobileMenu';
import LoginForm from './LoginForm';
import { useSettings } from '../../public-cms/hooks';

const DEFAULT_NAV = [
    { label: "Home", url: "/" },
    { label: "About", url: "/about" },
    { label: "Tours", url: "/tour" },
    { label: "Destinations", url: "/destination" },
    { label: "Activities", url: "/activities" },
    { label: "Services", url: "/service" },
    { label: "Blog", url: "/blog" },
    { label: "Contact", url: "/contact" },
];

function HeaderOne() {
    const settings = useSettings();
    const nav = Array.isArray(settings.headerNav) && settings.headerNav.length ? settings.headerNav : DEFAULT_NAV;
    const languageOptions = [
        { value: "language", label: "Language" },
        { value: "CNY", label: "CNY" },
        { value: "EUR", label: "EUR" },
        { value: "AUD", label: "AUD" },
    ];
    const [isSticky, setIsSticky] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);

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
                                    <div className="currency-menu">
                                        <NiceSelect options={languageOptions} defaultValue="Language" />
                                    </div>

                                    <div className="header-links">
                                        <ul>
                                            <li className="d-none d-md-inline-block">
                                                <Link to="/faq">FAQ</Link>
                                            </li>
                                            <li className="d-none d-md-inline-block">
                                                <Link to="/contact">Support</Link>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsLoginFormOpen(true)}
                                                >
                                                    Sign In / Register
                                                    <i className="fa-regular fa-user" />
                                                </button>
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
                                            <span
                                                style={{
                                                    fontFamily: "'Montez', cursive",
                                                    fontSize: "54px",
                                                    fontWeight: 600,
                                                    color: "#1CA8CB",
                                                    letterSpacing: "0.5px"
                                                }}
                                            >
                                                Dream International
                                            </span>
                                            <span
                                                style={{
                                                    fontFamily: "'Manrope', sans-serif",
                                                    fontSize: "19px",
                                                    fontWeight: 800,
                                                    color: "#113D48",
                                                    letterSpacing: "1.2px",
                                                    textTransform: "uppercase",
                                                    marginTop: "4px"
                                                }}
                                            >
                                                Travel and Tours
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-auto me-xl-auto">
                                    <nav className="main-menu d-none d-xl-inline-block">
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
                                        className="th-menu-toggle d-block d-xl-none"
                                        onClick={() => setIsMobileMenuOpen(true)}
                                    >
                                        <i className="far fa-bars" />
                                    </button>
                                </div>
                                <div className="col-auto d-none d-xl-block">
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
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
            <LoginForm isOpen={isLoginFormOpen} onClose={() => setIsLoginFormOpen(false)} />
        </>

    )
}

export default HeaderOne
