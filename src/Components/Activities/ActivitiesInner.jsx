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
                <div className="ticketing-toolbar mb-4">
                    <div>
                        <h2 className="ticketing-section-title">Activities</h2>
                        <p className="text-muted mb-0">
                            {filteredPosts.length} activit{filteredPosts.length === 1 ? 'y' : 'ies'}
                        </p>
                    </div>
                    <form className="search-form-area" onSubmit={(e) => e.preventDefault()}>
                        <div className="search-form">
                            <input
                                type="text"
                                placeholder="Search activities…"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <button type="submit" aria-label="Search">
                                <i className="fa-light fa-magnifying-glass" />
                            </button>
                        </div>
                    </form>
                </div>

                <div className="row gy-24 gx-24">
                    {currentPosts.length === 0 ? (
                        <div className="col-12 text-center py-5">
                            <p className="mb-0">No activities match your search.</p>
                        </div>
                    ) : (
                        currentPosts.map((data) => (
                            <div className="col-md-6 col-lg-4" key={data.id || data.slug}>
                                <ActivitiesCard
                                    activitiesID={data.id}
                                    activitiesImage={data.image}
                                    activitiesTitle={data.title}
                                    activitiesDuration={data.duration}
                                    activitiesLink={data.slug ? `/activities/${data.slug}` : undefined}
                                />
                            </div>
                        ))
                    )}
                </div>

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
        </section>
    )
}

export default ActivitiesInner
