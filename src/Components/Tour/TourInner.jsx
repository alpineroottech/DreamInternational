import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import TourCard from './TourCard';
import jsonPosts from '../data/data-tour.json';
import TourCardTwo from './TourCardTwo';
import { useCollection, resolveAssetUrl } from '../../public-cms/hooks';

function TourInner() {
    const [activeTab, setActiveTab] = useState('tab-grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const postsPerPage = 8;

    // Search/filter values from URL (set by the Booking widget on the homepage)
    const filterDestination = searchParams.get('destination') || '';
    const filterDuration   = searchParams.get('duration') || '';
    const [localSearch, setLocalSearch] = useState(searchParams.get('q') || '');

    const cms = useCollection('/public/tours');
    const cmsCategories = useCollection('/public/categories');
    const cmsBlogs = useCollection('/public/blog');

    // Support multiple category filters via comma-separated query param
    const filterCategoriesRaw = searchParams.get('category') || '';
    const selectedCategories = filterCategoriesRaw ? filterCategoriesRaw.split(',').filter(Boolean) : [];

    if (cms === undefined) {
        return (
            <section className="space">
                <div className="container text-center py-5">
                    <p className="mb-0">Loading tours…</p>
                </div>
            </section>
        );
    }

    const allPosts = cms && cms.length
        ? cms.map((t) => ({
            id: t.slug,
            slug: t.slug,
            image: t.featuredImageUrl,
            title: t.title,
            price: t.basePrice ? `$${t.basePrice}.00` : 'On request',
            durationDays: t.durationDays,
            categorySlug: t.category?.slug || t.categorySlug || '',
            categoryName: t.category?.name || '',
            raw: t,
        }))
        : jsonPosts.map((p) => ({ ...p, durationDays: null, categorySlug: '', categoryName: '', raw: p }));

    // Apply filters from URL params
    const posts = allPosts.filter((p) => {
        if (localSearch && !p.title.toLowerCase().includes(localSearch.toLowerCase())) return false;
        if (selectedCategories.length > 0) {
            if (!p.categorySlug || !selectedCategories.includes(p.categorySlug)) return false;
        }
        if (filterDuration && p.durationDays) {
            const d = p.durationDays;
            if (filterDuration === '1-3' && d > 3) return false;
            if (filterDuration === '4-7' && (d < 4 || d > 7)) return false;
            if (filterDuration === '8-14' && (d < 8 || d > 14)) return false;
            if (filterDuration === '15+' && d < 15) return false;
        }
        return true;
    });

    const toggleCategory = (slug) => {
        const updated = selectedCategories.includes(slug)
            ? selectedCategories.filter(s => s !== slug)
            : [...selectedCategories, slug];
        const p = new URLSearchParams(searchParams);
        if (updated.length) p.set('category', updated.join(','));
        else p.delete('category');
        setSearchParams(p);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(posts.length / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    return (
        <section className="space">
            <div className="container shape-mockup-wrap">
                <div className="th-sort-bar">
                    {/* Category filter pills */}
                    {cmsCategories && cmsCategories.length > 0 && (
                        <div className="mb-4">
                            <div className="d-flex flex-wrap gap-2 align-items-center">
                                <span className="text-muted small me-1">Filter:</span>
                                {cmsCategories.map((cat) => (
                                    <button
                                        key={cat.slug}
                                        type="button"
                                        className={`di-category-filter-btn${selectedCategories.includes(cat.slug) ? ' active' : ''}`}
                                        onClick={() => toggleCategory(cat.slug)}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                                {selectedCategories.length > 0 && (
                                    <button type="button" className="di-category-filter-btn di-category-filter-btn--clear" onClick={() => { const p = new URLSearchParams(searchParams); p.delete('category'); setSearchParams(p); setCurrentPage(1); }}>
                                        Clear filters ×
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                    {/* Active filter summary */}
                    {(filterDestination || filterDuration) && (
                        <div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
                            <span className="text-muted small">Active:</span>
                            {filterDestination && <span className="badge bg-secondary">{filterDestination} <button type="button" className="btn-close btn-close-white ms-1" style={{fontSize:'0.6rem'}} onClick={() => { const p = new URLSearchParams(searchParams); p.delete('destination'); setSearchParams(p); }} /></span>}
                            {filterDuration && <span className="badge bg-secondary">{filterDuration} days <button type="button" className="btn-close btn-close-white ms-1" style={{fontSize:'0.6rem'}} onClick={() => { const p = new URLSearchParams(searchParams); p.delete('duration'); setSearchParams(p); }} /></span>}
                        </div>
                    )}
                    <div className="row justify-content-between align-items-center">
                        <div className="col-md-4">
                            <div className="search-form-area">
                                <form className="search-form" onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); }}>
                                    <input
                                        type="text"
                                        placeholder="Search tours…"
                                        value={localSearch}
                                        onChange={(e) => { setLocalSearch(e.target.value); setCurrentPage(1); }}
                                    />
                                    <button type="submit">
                                        <i className="fa-light fa-magnifying-glass" />
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-auto">
                            <div className="sorting-filter-wrap">
                                <div className="nav" role="tablist">
                                    <Link
                                        to="#"
                                        id="tab-destination-grid"
                                        data-bs-toggle="tab"
                                        data-bs-target="#tab-grid"
                                        role="tab"
                                        aria-controls="tab-grid"
                                        aria-selected="true"
                                        className={`${activeTab === 'tab-grid' ? 'active' : ''}`}
                                        type="button"
                                        onClick={() => setActiveTab('tab-grid')}
                                    >
                                        <i className="fa-light fa-grid-2" />
                                    </Link>
                                    <Link
                                        to="#"
                                        id="tab-destination-list"
                                        data-bs-toggle="tab"
                                        data-bs-target="#tab-list"
                                        role="tab"
                                        aria-controls="tab-list"
                                        aria-selected="false"
                                        className={`${activeTab === 'tab-list' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('tab-list')}
                                    >
                                        <i className="fa-solid fa-list" />
                                    </Link>
                                </div>
                                <form className="woocommerce-ordering" method="get">
                                    <select
                                        name="orderby"
                                        className="orderby"
                                        aria-label="destination order"
                                    >
                                        <option value="menu_order" >
                                            Default Sorting
                                        </option>
                                        <option value="popularity">Sort by popularity</option>
                                        <option value="rating">Sort by average rating</option>
                                        <option value="date">Sort by latest</option>
                                        <option value="price">Sort by price: low to high</option>
                                        <option value="price-desc">Sort by price: high to low</option>
                                    </select>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xxl-8 col-lg-7">
                        <div className="tab-content" id="nav-tabContent">
                            <div
                                className={`tab-pane fade ${activeTab === 'tab-grid' ? 'show active' : ''}`} id="tab-grid" role="tabpanel"
                            >
                                <div className="row gy-24 gx-24">
                                    {currentPosts.map((data, index) => (
                                        <div key={index} className="col-md-6">
                                            <TourCard
                                                tourID={data.id}
                                                tourImage={`${data.image}`}
                                                tourTitle={data.title}
                                                tourPrice={data.price}
                                                tourDuration={data.durationDays}
                                                tourCategory={data.categoryName}
                                                tourLink={data.slug ? `/tour-details?slug=${data.slug}` : undefined}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div
                                className={`tab-pane fade ${activeTab === 'tab-list' ? 'show active' : ''}`} id="tab-list" role="tabpanel"
                            >
                                <div className="row gy-30">
                                    {currentPosts.map((data, index) => (
                                        <div key={index} className="col-12">
                                            <TourCardTwo
                                                tourID={data.id}
                                                tourImage={`${data.image}`}
                                                tourTitle={data.title}
                                                tourPrice={data.price}
                                                tourLink={data.slug ? `/tour-details?slug=${data.slug}` : undefined}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="th-pagination text-center mt-60">
                                <ul>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <li key={i}>
                                            <Link
                                                className={currentPage === i + 1 ? 'active' : ''}
                                                to="#"
                                                onClick={() => handlePageChange(i + 1)}
                                            >
                                                {i + 1}
                                            </Link>
                                        </li>
                                    ))}
                                    {currentPage < totalPages && (
                                        <li>
                                            <Link className="next-page" to="#" onClick={() => handlePageChange(currentPage + 1)}>
                                                Next <img src="/assets/img/icon/arrow-right4.svg" alt="" />
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-4 col-lg-5">
                        <aside className="sidebar-area">
                            {/* Tour categories from CMS */}
                            <div className="widget widget_categories">
                                <h3 className="widget_title">Tour Categories</h3>
                                <ul>
                                    {(cmsCategories && cmsCategories.length ? cmsCategories : []).map((cat) => (
                                        <li key={cat.slug}>
                                            <Link
                                                to="#"
                                                onClick={(e) => { e.preventDefault(); const p = new URLSearchParams(searchParams); p.set('category', cat.slug); setSearchParams(p); setCurrentPage(1); }}
                                            >
                                                <img src="/assets/img/theme-img/map.svg" alt="" />
                                                {cat.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* Recent blog posts from CMS */}
                            {cmsBlogs && cmsBlogs.length > 0 && (
                                <div className="widget">
                                    <h3 className="widget_title">Recent Posts</h3>
                                    <div className="recent-post-wrap">
                                        {cmsBlogs.slice(0, 3).map((post) => (
                                            <div className="recent-post" key={post.slug || post.id}>
                                                <div className="media-img">
                                                    <Link to={`/blog/${post.slug || post.id}`}>
                                                        <img src={resolveAssetUrl(post.coverImageUrl) || '/assets/img/blog/recent-post-1-1.jpg'} alt={post.title} />
                                                    </Link>
                                                </div>
                                                <div className="media-body">
                                                    <h4 className="post-title">
                                                        <Link className="text-inherit" to={`/blog/${post.slug || post.id}`}>{post.title}</Link>
                                                    </h4>
                                                    <div className="recent-post-meta">
                                                        <Link to="/blog">
                                                            <i className="fa-regular fa-calendar" />
                                                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Help widget */}
                            <div
                                className="widget widget_offer"
                                style={{ backgroundImage: "url(/assets/img/bg/widget_bg_1.jpg)", backgroundSize: "cover" }}
                            >
                                <div className="offer-banner">
                                    <div className="offer">
                                        <h6 className="box-title">Need Help? We Are Here To Help You</h6>
                                        <div className="offer">
                                            <h6 className="offer-title">Get Online Support</h6>
                                        </div>
                                        <Link to="/contact" className="th-btn style2 th-icon">Contact Us</Link>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
                <div
                    className="shape-mockup shape1 d-none d-xxl-block"
                    style={{ bottom: "7%", right: "-8%" }}
                >
                    <img src="/assets/img/shape/shape_1.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup shape2 d-none d-xl-block"
                    style={{ bottom: "1%", right: "-7%" }}
                >
                    <img src="/assets/img/shape/shape_2.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup shape3 d-none d-xxl-block"
                    style={{ bottom: "-2%", right: "-12%" }}
                >
                    <img src="/assets/img/shape/shape_3.png" alt="shape" />
                </div>
            </div>
        </section>

    )
}

export default TourInner
