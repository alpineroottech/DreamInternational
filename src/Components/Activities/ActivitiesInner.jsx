import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import jsonPosts from '../data/data-activities.json';
import ActivitiesCard from './ActivitiesCard';
import { useCollection } from '../../public-cms/hooks';

const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
        const num = parseFloat(price.replace(/[^0-9.]/g, ''));
        return Number.isNaN(num) ? null : num;
    }
    return null;
};

function ActivitiesInner() {
    const [value, setValue] = useState(100);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 8;

    const cms = useCollection('/public/activities');

    const handleSliderChange = (e) => {
        setValue(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    if (cms === undefined) {
        return (
            <section className="space">
                <div className="container text-center py-5">
                    <p className="mb-0">Loading activities…</p>
                </div>
            </section>
        );
    }

    const posts = cms && cms.length
        ? cms.map((a) => ({
            id: a.slug,
            slug: a.slug,
            image: a.cardImageUrl || a.imageUrl,
            title: a.title,
            price: a.price || 'On request',
            duration: a.duration,
          }))
        : jsonPosts;

    const numericPrices = posts
        .map((p) => parsePrice(p.price))
        .filter((n) => n !== null);
    const maxPrice = numericPrices.length ? Math.ceil(Math.max(...numericPrices)) : 1000;
    const priceFrom = 0;
    const priceTo = Math.round((value / 100) * maxPrice);

    const term = searchTerm.trim().toLowerCase();
    const filteredPosts = posts.filter((p) => {
        const matchesSearch = !term || (p.title || '').toLowerCase().includes(term);
        const num = parsePrice(p.price);
        const matchesPrice = num === null || num <= priceTo;
        return matchesSearch && matchesPrice;
    });

    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage));
    const safePage = Math.min(currentPage, totalPages);
    const indexOfLastPost = safePage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    return (
        <section className="space">
            <div className="container">
                <div className="row">
                    <div className="col-xxl-8 col-lg-7">
                        <div className="row gy-24 gx-24">
                            {currentPosts.length === 0 ? (
                                <div className="col-12 text-center py-5">
                                    <p className="mb-0">No activities match your filters.</p>
                                </div>
                            ) : (
                                currentPosts.map((data, index) => (
                                    <div key={index} className="col-md-6">
                                        <ActivitiesCard
                                            activitiesID={data.id}
                                            activitiesImage={`${data.image}`}
                                            activitiesTitle={data.title}
                                            activitiesPrice={data.price}
                                            activitiesDuration={data.duration}
                                            activitiesLink={data.slug ? `/activities-details?slug=${data.slug}` : undefined}
                                        />
                                    </div>
                                ))
                            )}
                            {totalPages > 1 && (
                                <div className="th-pagination text-center mt-60 mb-0">
                                    <ul>
                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <li key={i}>
                                                <Link
                                                    className={safePage === i + 1 ? 'active' : ''}
                                                    to="#"
                                                    onClick={() => handlePageChange(i + 1)}
                                                >
                                                    {i + 1}
                                                </Link>
                                            </li>
                                        ))}
                                        {safePage < totalPages && (
                                            <li>
                                                <Link className="next-page" to="#" onClick={() => handlePageChange(safePage + 1)}>
                                                    Next <img src="/assets/img/icon/arrow-right4.svg" alt="" />
                                                </Link>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-xxl-4 col-lg-5">
                        <aside className="sidebar-area">
                            <div className="widget widget_search  ">
                                <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                    <button type="submit">
                                        <i className="far fa-search" />
                                    </button>
                                </form>
                            </div>
                            <div className="widget widget_categories  ">
                                <h3 className="widget_title">Activity Type</h3>
                                <ul>
                                    <li>
                                        <Link to="/blog">
                                            <i className="fa-light fa-square-check" />
                                            Food and drink
                                        </Link>
                                        <span>(10)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <i className="fa-light fa-square-check" />
                                            Entertainment
                                        </Link>
                                        <span>(6)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <i className="fa-light fa-square-check" />
                                            Sports
                                        </Link>
                                        <span>(2)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <i className="fa-light fa-square-check" />
                                            Nature and outdoors
                                        </Link>
                                        <span>(7)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <i className="fa-light fa-square-check" />
                                            Culture and events
                                        </Link>
                                        <span>(9)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <i className="fa-light fa-square-check" />
                                            Mountain Campaigning
                                        </Link>
                                        <span>(10)</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="widget widget_price_filter  ">
                                <h4 className="widget_title">Filter By Price</h4>
                                <div className="price_slider_wrapper">
                                    <div className="price_label">
                                        Price: <span className="from">${priceFrom}</span> — <span className="to">${priceTo}</span>
                                    </div>
                                    <div className="price_slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content">
                                        {/* Slider Range */}
                                        <div
                                            className="ui-slider-range ui-corner-all ui-widget-header"
                                            style={{ left: '0%', width: `${value}%` }}
                                        ></div>

                                        {/* First Handle */}
                                        <span
                                            tabIndex="0"
                                            className="ui-slider-handle ui-corner-all ui-state-default"
                                            style={{ left: '0%' }}
                                        ></span>

                                        {/* Second Handle */}
                                        <span
                                            tabIndex="0"
                                            className="ui-slider-handle ui-corner-all ui-state-default"
                                            style={{ left: `${value}%` }}
                                        ></span>

                                        {/* Hidden Input range to control the slider */}
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={value}
                                            onChange={handleSliderChange}
                                            className="slider-input"
                                            style={{ opacity: 0, position: 'absolute', zIndex: '1', top: '-22px', padding: '0', cursor:'pointer' }}  // Hides the input
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="widget widget_categories  ">
                                <h3 className="widget_title">Duration</h3>
                                <ul>
                                    <li>
                                        <Link to="/blog">
                                            <i className="fa-light fa-square-check" />
                                            Up to 2 hour
                                        </Link>
                                        <span>(20)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <i className="fa-light fa-square-check" />1 to 4 hour
                                        </Link>
                                        <span>(24)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <i className="fa-light fa-square-check" />4 hour to 1 day
                                        </Link>
                                        <span>(25)</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="widget widget_categories  ">
                                <h3 className="widget_title">Duration</h3>
                                <ul>
                                    <li>
                                        <Link to="/blog">
                                            <i className="fa-light fa-square-check" />
                                            Gozayan Tour, BD
                                        </Link>
                                        <span>(26)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <i className="fa-light fa-square-check" />
                                            Tourope UK
                                        </Link>
                                        <span>(27)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <i className="fa-light fa-square-check" />
                                            European Tours Limited
                                        </Link>
                                        <span>(29)</span>
                                    </li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default ActivitiesInner
