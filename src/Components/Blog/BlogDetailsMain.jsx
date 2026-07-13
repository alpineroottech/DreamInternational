import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { publicApi, resolveAssetUrl } from '../../public-cms/hooks';
import SafeHtml from '../../public-cms/SafeHtml';

function BlogDetailsMain() {
    const { id } = useParams();
    const [cms, setCms] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        setLoading(true);
        publicApi.get(`/public/blog/${id}`)
            .then(({ data }) => active && setCms(data))
            .catch(() => active && setCms(null))
            .finally(() => active && setLoading(false));
        return () => { active = false; };
    }, [id]);

    if (loading) {
        return <section className="space"><div className="container">Loading…</div></section>;
    }

    if (!cms) {
        return (
            <section className="space">
                <div className="container text-center py-5">
                    <h3>Article not found</h3>
                    <p className="text-muted mb-4">This article may have been removed or is not published yet.</p>
                    <Link to="/blog" className="th-btn style3 th-icon">Back to Blog</Link>
                </div>
            </section>
        );
    }

    return (
        <section className="th-blog-wrapper blog-details space-top space-extra-bottom">
            <div className="container">
                <div className="row">
                    <div className="col-12 col-lg-9 mx-auto">
                        <div className="th-blog blog-single">
                            {cms.coverImageUrl && (
                                <div className="blog-img">
                                    <img src={resolveAssetUrl(cms.coverImageUrl)} alt={cms.coverImageAlt || cms.title} />
                                </div>
                            )}
                            <div className="blog-content">
                                <div className="blog-meta">
                                    <Link to="/blog">
                                        <i className="fa-regular fa-calendar" />
                                        {cms.publishedAt ? new Date(cms.publishedAt).toLocaleDateString() : ''}
                                    </Link>
                                </div>
                                <h2 className="blog-title">{cms.title}</h2>
                                {cms.excerpt && <p className="blog-text mb-30">{cms.excerpt}</p>}
                                <SafeHtml className="blog-text" html={cms.content} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BlogDetailsMain
