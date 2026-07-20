import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCollection, resolveCmsList } from '../../public-cms/hooks';
import { tourDetailPath } from '../../lib/tourUrls';

const MAX_PER_COLUMN = 5;

function groupToursByCategory(tours) {
    const map = new Map();
    tours.forEach((t) => {
        const key = t.category?.name || 'More Tours';
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(t);
    });
    return Array.from(map.entries()).map(([name, items]) => ({ name, items }));
}

/** Loads and groups mega-menu columns for a Nepal/International tour market. */
export function useTourMegaMenu(market) {
    const cms = useCollection('/public/tours', { market });
    const { items: tours } = resolveCmsList(cms, []);
    return useMemo(() => groupToursByCategory(tours), [tours]);
}

/** Activities have no CMS category relation, so they render as one column. */
export function useActivitiesMegaMenu() {
    const cms = useCollection('/public/activities');
    const { items } = resolveCmsList(cms, []);
    return useMemo(
        () => (items.length ? [{ name: 'Popular Activities', items }] : []),
        [items]
    );
}

function groupRentalsByCategory(rentals) {
    const map = new Map();
    rentals.forEach((r) => {
        const key = r.category?.name || 'More Vehicles';
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(r);
    });
    // "Hire a Driver" always renders last so it reads as a distinct add-on.
    return Array.from(map.entries())
        .map(([name, items]) => ({ name, items }))
        .sort((a, b) => (a.name === 'Hire a Driver') - (b.name === 'Hire a Driver'));
}

/** Vehicle rentals group by their CMS category (Cars, Jeeps/SUVs, Vans & Minibuses, Buses, Hire a Driver). */
export function useVehicleRentalsMegaMenu() {
    const cms = useCollection('/public/vehicle-rentals');
    const { items } = resolveCmsList(cms, []);
    return useMemo(() => groupRentalsByCategory(items), [items]);
}

function itemDetailPath(item, market, isVehicle, isActivity) {
    if (!item.slug) return null;
    if (isActivity || market === 'activities') return `/activities/${item.slug}`;
    if (isVehicle) return `/vehicle-rentals/${item.slug}`;
    return tourDetailPath(item, market);
}

/** Flattens mega-menu columns into the generic { label, url } shape MobileMenu understands. */
export function megaColumnsToMobileChildren(columns, market, viewAllLabel, viewAllUrl, isVehicle, isActivity) {
    const children = [];
    columns.forEach((col) => {
        children.push({ label: col.name, isHeading: true });
        col.items.slice(0, MAX_PER_COLUMN).forEach((item) => {
            children.push({
                label: item.title,
                url: itemDetailPath(item, market, isVehicle, isActivity) || '#',
            });
        });
    });
    children.push({ label: viewAllLabel, url: viewAllUrl, isViewAll: true });
    return children;
}

function categoryFilterUrl(viewAllUrl, categorySlug) {
    if (!categorySlug) return viewAllUrl;
    const sep = viewAllUrl.includes('?') ? '&' : '?';
    return `${viewAllUrl}${sep}category=${encodeURIComponent(categorySlug)}`;
}

function MegaMenu({ columns, market, viewAllLabel, viewAllUrl, isVehicle, isActivity }) {
    if (!columns || !columns.length) return null;
    return (
        <div className="di-mega-menu">
            <div className="di-mega-menu__inner">
                <div className="di-mega-menu__columns">
                    {columns.map((col) => {
                        const moreUrl = categoryFilterUrl(viewAllUrl, col.items[0]?.category?.slug || col.items[0]?.categorySlug);
                        return (
                            <div className="di-mega-menu__col" key={col.name}>
                                <div className="di-mega-menu__col-title">{col.name}</div>
                                <ul>
                                    {col.items.slice(0, MAX_PER_COLUMN).map((item) => (
                                        <li key={item.id || item.slug}>
                                            <Link to={itemDetailPath(item, market, isVehicle, isActivity) || viewAllUrl}>
                                                <span className="di-mega-menu__label">{item.title}</span>
                                                {isVehicle && item.showPricing !== false && item.pricePerDay ? (
                                                    <span className="di-mega-menu__price">${item.pricePerDay}/day</span>
                                                ) : null}
                                            </Link>
                                        </li>
                                    ))}
                                    {col.items.length > MAX_PER_COLUMN && (
                                        <li>
                                            <Link to={moreUrl} className="di-mega-menu__more">
                                                View all {col.items.length} {isVehicle ? 'vehicles' : 'packages'}
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        );
                    })}
                    <div className="di-mega-menu__cta-row">
                        <Link to={viewAllUrl} className="th-btn th-btn-accent di-mega-menu__cta">
                            {viewAllLabel}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MegaMenu;
