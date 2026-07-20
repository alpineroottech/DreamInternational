import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ActivitiesCard from './ActivitiesCard';
import { useCollection } from '../../public-cms/hooks';

function ActivitiesInner() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 8;

    const cms = useCollection('/public/activities');

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

    const posts = Array.isArray(cms)
        ? cms.map((a) => ({
            id: a.slug,
            slug: a.slug,
            image: a.cardImageUrl || a.imageUrl,
            title: a.title,
            price: a.price || 'On request',
            duration: a.duration,
          }))
        : [];

    const term = searchTerm.trim().toLowerCase();
    const filteredPosts = posts.filter((p) =>
        !term || (p.title || '').toLowerCase().includes(term)
    );

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
                                            activitiesLink={data.slug ? `/activities/${data.slug}` : undefined}
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
