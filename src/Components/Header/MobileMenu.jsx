import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BRAND_NAME, LOGO_FOOTER } from '../../brand/brandAssets';

function MobileMenu({ isOpen, onClose, nav = [] }) {
    const [activeMenu, setActiveMenu] = useState(null);
    const menuRefs = useRef({});

    const toggleMenu = (index, hasChildren, e) => {
        if (!hasChildren) return;
        e.preventDefault();
        setActiveMenu(activeMenu === index ? null : index);
    };

    useEffect(() => {
        Object.keys(menuRefs.current).forEach((key) => {
            const submenu = menuRefs.current[key];
            if (submenu) {
                submenu.style.height = activeMenu == key ? `${submenu.scrollHeight}px` : "0px";
            }
        });
    }, [activeMenu]);

    return (
        <div
            className={`th-menu-wrapper onepage-nav ${isOpen ? "th-body-visible" : ""}`}
            style={{ visibility: isOpen ? "visible" : "hidden" }}
        >
            <div className="th-menu-area text-center">
                <button className="th-menu-toggle" onClick={onClose} aria-label="Close">
                    <i className="fal fa-times" />
                </button>

                <div className="mobile-logo">
                    <Link to="/" onClick={onClose} className="di-mobile-logo-link" aria-label={BRAND_NAME}>
                        <img src={LOGO_FOOTER} alt={BRAND_NAME} className="di-logo-full di-mobile-menu-logo" />
                    </Link>
                </div>

                <div className="th-mobile-menu">
                    <ul>
                        {nav.map((item, i) => {
                            const hasChildren = item.children?.length > 0;
                            return (
                                <li
                                    key={`${item.label}-${i}`}
                                    className={hasChildren ? `menu-item-has-children th-item-has-children ${activeMenu === i ? "th-active" : ""}` : ""}
                                >
                                    {hasChildren ? (
                                        <Link to={item.url || "#"} onClick={(e) => toggleMenu(i, true, e)}>
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <Link to={item.url || "/"} onClick={onClose}>{item.label}</Link>
                                    )}
                                    {hasChildren && (
                                        <ul
                                            ref={(el) => (menuRefs.current[i] = el)}
                                            className="th-submenu"
                                            style={{ height: "0px", overflow: "hidden", transition: "height 0.3s ease-in-out" }}
                                        >
                                            {item.children.map((child, ci) => (
                                                <li key={`${child.label}-${ci}`}>
                                                    <Link to={child.url || "#"} onClick={onClose}>{child.label}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                    <div className="mobile-menu-cta mt-4 px-3">
                        <Link to="/contact" className="th-btn th-btn-accent w-100 di-header-book-btn" onClick={onClose}>
                            Book Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MobileMenu;
