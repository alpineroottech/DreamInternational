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

/** Flattens mega-menu columns into the generic { label, url } shape MobileMenu understands. */
export function megaColumnsToMobileChildren(columns, market, viewAllLabel, viewAllUrl) {
    const children = [];
    columns.forEach((col) => {
        children.push({ label: col.name, isHeading: true });
        col.items.slice(0, MAX_PER_COLUMN).forEach((item) => {
            children.push({
                label: item.title,
                url: item.slug ? tourDetailPath(item, market) : '#',
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

function MegaMenu({ columns, market, viewAllLabel, viewAllUrl }) {
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
                                            <Link to={item.slug ? tourDetailPath(item, market) : viewAllUrl}>
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                    {col.items.length > MAX_PER_COLUMN && (
                                        <li>
                                            <Link to={moreUrl} className="di-mega-menu__more">
                                                View all {col.items.length} packages
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
