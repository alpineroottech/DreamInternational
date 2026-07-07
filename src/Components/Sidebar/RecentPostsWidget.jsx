import React from "react";
import { Link } from "react-router-dom";
import { useCollection, resolveAssetUrl } from "../../public-cms/hooks";

export default function RecentPostsWidget({ limit = 3 }) {
  const cmsBlogs = useCollection("/public/blog");

  if (cmsBlogs === undefined) return null;

  const posts = cmsBlogs && cmsBlogs.length
    ? [...cmsBlogs]
        .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
        .slice(0, limit)
    : [];

  if (!posts.length) return null;

  return (
    <div className="widget">
      <h3 className="widget_title">Recent Posts</h3>
      <div className="recent-post-wrap">
        {posts.map((post) => (
          <div className="recent-post" key={post.slug || post.id}>
            {post.coverImageUrl && (
              <div className="media-img">
                <Link to={`/blog/${post.slug}`}>
                  <img src={resolveAssetUrl(post.coverImageUrl)} alt={post.coverImageAlt || post.title} />
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
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
