import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MobileMenu from './MobileMenu';
import MegaMenu, { useTourMegaMenu, useActivitiesMegaMenu, useVehicleRentalsMegaMenu, megaColumnsToMobileChildren } from './MegaMenu';
import { useSettings } from '../../public-cms/hooks';
import { BRAND_NAME, LOGO_TITLE } from '../../brand/brandAssets';
import { DEFAULT_HEADER_NAV } from '../../lib/sitePages';

/** Only these archive nav items get a mega menu; everything else is a plain link. */
function getMegaType(item) {
    const url = (item.url || '').replace(/\/$/, '');
    if (url === '/tour') return 'nepal';
    if (url === '/international-holidays') return 'international';
    if (url === '/activities') return 'activities';
    if (url === '/vehicle-rentals') return 'vehicle-rentals';
    return null;
}

const DEFAULT_NAV = DEFAULT_HEADER_NAV;

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

/**
 * Contact is handled by the Book Now CTA, and Services now lives in the
 * footer's Quick Links column — keep both out of the main nav.
 */
function navForHeader(items) {
    return withTicketingNav(items).filter((item) => {
        if (item.children?.length) return true;
        const url = (item.url || "").replace(/\/$/, "");
        const label = (item.label || "").toLowerCase();
        return !(url === "/contact" || label === "contact" || url === "/service" || label === "services");
    });
}

function HeaderOne() {
    const settings = useSettings();
    const nav = navForHeader(
        Array.isArray(settings.headerNav) && settings.headerNav.length ? settings.headerNav : DEFAULT_NAV
    );
    const [isSticky, setIsSticky] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const nepalColumns = useTourMegaMenu('nepal');
    const intlColumns = useTourMegaMenu('international');
    const activityColumns = useActivitiesMegaMenu();
    const vehicleColumns = useVehicleRentalsMegaMenu();
    const megaDataByType = {
        nepal: { columns: nepalColumns, market: 'nepal', viewAllLabel: 'View All Nepal Experiences', viewAllUrl: '/tour' },
        international: { columns: intlColumns, market: 'international', viewAllLabel: 'View All International Holidays', viewAllUrl: '/international-holidays' },
        activities: { columns: activityColumns, market: 'activities', viewAllLabel: 'View All Activities', viewAllUrl: '/activities', isActivity: true },
        'vehicle-rentals': { columns: vehicleColumns, market: undefined, viewAllLabel: 'View All Vehicle Rentals', viewAllUrl: '/vehicle-rentals', isVehicle: true },
    };

    const mobileNav = nav.map((item) => {
        const type = getMegaType(item);
        const data = type && megaDataByType[type];
        if (!data || !data.columns.length) return item;
        return {
            ...item,
            children: megaColumnsToMobileChildren(data.columns, data.market, data.viewAllLabel, data.viewAllUrl, data.isVehicle, data.isActivity),
        };
    });

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 500);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header className="th-header header-layout1">
                <div className="header-top">
                    <div className="container th-container">
                        <div className="row justify-content-center justify-content-xl-between align-items-center">
                            <div className="col-auto d-none d-md-block">
                                <div className="header-links">
                                    <ul>
                                        <li className="d-none d-xl-inline-block">
                                            <i className="fa-sharp fa-regular fa-location-dot" />
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
                    <div className="menu-area">
                        <div className="container th-container">
                            <div className="di-header-bar">
                                <div className="di-header-bar__logo">
                                    <Link
                                        to="/"
                                        className="di-header-logo-link"
                                        aria-label={BRAND_NAME}
                                    >
                                        <img
                                            src={LOGO_TITLE}
                                            alt={BRAND_NAME}
                                            className="di-header-logo-img"
                                            width="1850"
                                            height="303"
                                            decoding="async"
                                        />
                                    </Link>
                                </div>

                                <nav className="main-menu di-header-bar__nav d-none d-xl-block">
                                    <ul>
                                        {nav.map((item, i) => {
                                            const megaType = getMegaType(item);
                                            const megaData = megaType && megaDataByType[megaType];
                                            if (megaData && megaData.columns.length) {
                                                return (
                                                    <li key={i} className="menu-item-has-children di-mega-menu-item">
                                                        <Link to={item.url || "#"}>{item.label}</Link>
                                                        <MegaMenu
                                                            columns={megaData.columns}
                                                            market={megaData.market}
                                                            viewAllLabel={megaData.viewAllLabel}
                                                            viewAllUrl={megaData.viewAllUrl}
                                                            isVehicle={megaData.isVehicle}
                                                            isActivity={megaData.isActivity}
                                                        />
                                                    </li>
                                                );
                                            }
                                            return (
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
                                            );
                                        })}
                                    </ul>
                                </nav>

                                <div className="di-header-bar__actions">
                                    <div className="header-button d-none d-xl-block">
                                        <Link to="/contact" className="th-btn th-btn-accent di-header-book-btn">
                                            Book Now
                                        </Link>
                                    </div>
                                    <button
                                        type="button"
                                        className="th-menu-toggle d-block d-xl-none"
                                        onClick={() => setIsMobileMenuOpen(true)}
                                        aria-label="Open menu"
                                    >
                                        <i className="far fa-bars" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div
                            className="logo-bg bg-mask"
                            style={{
                                WebkitMaskImage: "url(/assets/img/logo_bg_mask.png)",
                                maskImage: "url()",
                            }}
                        />
                    </div>
                </div>
            </header>
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} nav={mobileNav} />
        </>
    );
}

export default HeaderOne;
