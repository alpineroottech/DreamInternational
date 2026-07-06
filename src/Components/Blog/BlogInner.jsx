import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BlogPost from './BlogPost';
import jsonPosts from '../data/data-post.json';
import { useCollection, resolveAssetUrl } from '../../public-cms/hooks';

function BlogInner() {
    const [currentPage, setCurrentPage] = useState(1);
    const cms = useCollection('/public/blog');

    if (cms === undefined) {
        return (
            <section className="th-blog-wrapper space-top space-extra-bottom">
                <div className="container text-center py-5">
                    <p className="mb-0">Loading articles…</p>
                </div>
            </section>
        );
    }

    const usingCms = cms && cms.length > 0;
    const postsPerPage = usingCms ? 6 : 1;
    const posts = usingCms ? cms : jsonPosts;
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const recentPosts = usingCms
        ? [...cms]
            .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
            .slice(0, 3)
        : [];

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <section className="th-blog-wrapper space-top space-extra-bottom">
            <div className="container">
                <div className="row">
                    <div className="col-xxl-8 col-lg-7">
                        {usingCms
                            ? currentPosts.map((data) => (
                                <div key={data.slug} className="th-blog blog-single has-post-thumbnail mb-4">
                                    {data.coverImageUrl && (
                                        <div className="blog-img">
                                            <Link to={`/blog/${data.slug}`}>
                                                <img src={resolveAssetUrl(data.coverImageUrl)} alt={data.title} />
                                            </Link>
                                        </div>
                                    )}
                                    <div className="blog-content">
                                        <div className="blog-meta">
                                            <Link to={`/blog/${data.slug}`}>
                                                <i className="fa-solid fa-calendar-days" />
                                                {data.publishedAt ? new Date(data.publishedAt).toLocaleDateString() : ''}
                                            </Link>
                                        </div>
                                        <h2 className="blog-title">
                                            <Link to={`/blog/${data.slug}`}>{data.title}</Link>
                                        </h2>
                                        {data.excerpt && <p className="blog-text">{data.excerpt}</p>}
                                        <Link to={`/blog/${data.slug}`} className="th-btn style4 th-icon">Read More</Link>
                                    </div>
                                </div>
                            ))
                            : currentPosts.map((data) => (
                                <BlogPost
                                    key={data.id}
                                    blogID={data.id}
                                    blogImage={data.image}
                                    blogTitle={data.title}
                                />
                            ))}
                        <div className="th-pagination">
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
                    <div className="col-xxl-4 col-lg-5">
                        <aside className="sidebar-area">
                            <div className="widget widget_search  ">
                                <form className="search-form">
                                    <input type="text" placeholder="Search" />
                                    <button type="submit">
                                        <i className="far fa-search" />
                                    </button>
                                </form>
                            </div>
                            <div className="widget widget_categories  ">
                                <h3 className="widget_title">Categories</h3>
                                <ul>
                                    <li>
                                        <Link to="/blog">
                                            <img src="assets/img/theme-img/map.svg" alt="" />
                                            City Tour
                                        </Link>
                                        <span>(8)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="assets/img/theme-img/map.svg" alt="" />
                                            Beach Tours
                                        </Link>
                                        <span>(6)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="assets/img/theme-img/map.svg" alt="" />
                                            Wildlife Tours
                                        </Link>
                                        <span>(2)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="assets/img/theme-img/map.svg" alt="" />
                                            News &amp; Tips
                                        </Link>
                                        <span>(7)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="assets/img/theme-img/map.svg" alt="" />
                                            Adventure Tours
                                        </Link>
                                        <span>(9)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="assets/img/theme-img/map.svg" alt="" />
                                            Mountain Tours
                                        </Link>
                                        <span>(10)</span>
                                    </li>
                                </ul>
                            </div>
                            {recentPosts.length > 0 && (
                                <div className="widget">
                                    <h3 className="widget_title">Recent Posts</h3>
                                    <div className="recent-post-wrap">
                                        {recentPosts.map((post) => (
                                            <div className="recent-post" key={post.slug || post.id}>
                                                {post.coverImageUrl && (
                                                    <div className="media-img">
                                                        <Link to={`/blog/${post.slug}`}>
                                                            <img
                                                                src={resolveAssetUrl(post.coverImageUrl)}
                                                                alt={post.coverImageAlt || post.title}
                                                            />
                                                        </Link>
                                                    </div>
                                                )}
                                                <div className="media-body">
                                                    <h4 className="post-title">
                                                        <Link className="text-inherit" to={`/blog/${post.slug}`}>
                                                            {post.title}
                                                        </Link>
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
                            <div className="widget widget_tag_cloud  ">
                                <h3 className="widget_title">Popular Tags</h3>
                                <div className="tagcloud">
                                    <Link to="/blog">Tour</Link>
                                    <Link to="/blog">Adventure</Link>
                                    <Link to="/blog">Rent</Link>
                                    <Link to="/blog">Innovate</Link>
                                    <Link to="/blog">Hotel</Link>
                                    <Link to="/blog">Modern</Link>
                                    <Link to="/blog">Luxury</Link>
                                    <Link to="/blog">Travel</Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BlogInner;
