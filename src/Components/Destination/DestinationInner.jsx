import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import DestinationCard from './DestinationCard';
import DestinationCardTwo from './DestinationCardTwo';
import { useCollection, resolveAssetUrl } from '../../public-cms/hooks';
import RecentPostsWidget from '../Sidebar/RecentPostsWidget';
import SidebarHelpWidget from '../Sidebar/SidebarHelpWidget';

function DestinationInner() {
    const [activeTab, setActiveTab] = useState('tab-grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const filterSlug = searchParams.get('destination') || '';
    const postsPerPage = 9;

    const cmsDestinations = useCollection('/public/destinations');

    if (cmsDestinations === undefined) {
        return (
            <section className="space">
                <div className="container text-center py-5">
                    <p className="mb-0">Loading destinations…</p>
                </div>
            </section>
        );
    }

    const allPosts = cmsDestinations && cmsDestinations.length
        ? cmsDestinations.map((d) => ({
            id: d.slug,
            slug: d.slug,
            title: d.name,
            image: resolveAssetUrl(d.cardImageUrl || d.cardImage?.url || d.heroImageUrl || d.heroImage?.url) || '',
            price: d.price || (d.basePrice != null ? `From $${d.basePrice}` : null),
            shortDescription: d.shortDescription,
          }))
        : [];

    const posts = filterSlug
        ? allPosts.filter((p) => p.slug === filterSlug)
        : allPosts;

    const totalPages = Math.max(1, Math.ceil(posts.length / postsPerPage));
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const setDestinationFilter = (slug) => {
        const p = new URLSearchParams(searchParams);
        if (slug) p.set('destination', slug);
        else p.delete('destination');
        setSearchParams(p);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <section className="space">
            <div className="container">
                <div className="th-sort-bar">
                    <div className="row justify-content-between align-items-center">
                        <div className="col-md-4">
                            {filterSlug && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => setDestinationFilter('')}
                                >
                                    Clear filter
                                </button>
                            )}
                        </div>
                        <div className="col-md-auto">
                            <div className="sorting-filter-wrap">
                                <div className="nav" role="tablist">
                                    <Link
                                        to="#"
                                        className={`${activeTab === 'tab-grid' ? 'active' : ''}`}
                                        onClick={(e) => { e.preventDefault(); setActiveTab('tab-grid'); }}
                                    >
                                        <i className="fa-light fa-grid-2" />
                                    </Link>
                                    <Link
                                        to="#"
                                        className={`${activeTab === 'tab-list' ? 'active' : ''}`}
                                        onClick={(e) => { e.preventDefault(); setActiveTab('tab-list'); }}
                                    >
                                        <i className="fa-solid fa-list" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xxl-9 col-lg-8">
                        {posts.length === 0 ? (
                            <p className="text-muted py-4">No destinations match this filter.</p>
                        ) : (
                            <>
                                <div className="tab-content" id="nav-tabContent">
                                    <div className={`tab-pane fade ${activeTab === 'tab-grid' ? 'show active' : ''}`} id="tab-grid" role="tabpanel">
                                        <div className="row gy-30">
                                            {currentPosts.map((data) => (
                                                <div key={data.slug || data.id} className="col-xxl-4 col-xl-6">
                                                    <DestinationCard
                                                        destinationID={data.slug || data.id}
                                                        destinationImage={data.image}
                                                        destinationTitle={data.title}
                                                        destinationPrice={data.price}
                                                        destinationSubtitle={data.shortDescription}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className={`tab-pane fade ${activeTab === 'tab-list' ? 'show active' : ''}`} id="tab-list" role="tabpanel">
                                        <div className="row gy-30">
                                            {currentPosts.map((data) => (
                                                <div key={data.slug || data.id} className="col-12">
                                                    <DestinationCardTwo
                                                        destinationID={data.slug || data.id}
                                                        destinationImage={data.image}
                                                        destinationTitle={data.title}
                                                        destinationPrice={data.price}
                                                        destinationSubtitle={data.shortDescription}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {totalPages > 1 && (
                                    <div className="th-pagination text-center mt-60 mb-0">
                                        <ul>
                                            {Array.from({ length: totalPages }, (_, i) => (
                                                <li key={i}>
                                                    <Link
                                                        className={currentPage === i + 1 ? 'active' : ''}
                                                        to="#"
                                                        onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}
                                                    >
                                                        {i + 1}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="col-xxl-3 col-lg-4">
                        <aside className="sidebar-area style2">
                            <div className="widget widget_categories">
                                <h3 className="widget_title">Destinations</h3>
                                <ul>
                                    <li>
                                        <Link
                                            to="#"
                                            onClick={(e) => { e.preventDefault(); setDestinationFilter(''); }}
                                            className={!filterSlug ? 'fw-semibold' : ''}
                                        >
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            All destinations
                                        </Link>
                                    </li>
                                    {allPosts.map((d) => (
                                        <li key={d.slug}>
                                            <Link
                                                to="#"
                                                onClick={(e) => { e.preventDefault(); setDestinationFilter(d.slug); }}
                                                className={filterSlug === d.slug ? 'fw-semibold' : ''}
                                            >
                                                <img src="/assets/img/theme-img/map.svg" alt="" />
                                                {d.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <RecentPostsWidget />
                            <SidebarHelpWidget />
                        </aside>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DestinationInner
