import React from "react";
import { useParams } from "react-router-dom";
import HeaderOne from "../Components/Header/HeaderOne";
import FooterOne from "../Components/Footer/FooterOne";
import Breadcrumb from "../Components/BreadCrumb/Breadcrumb";
import BlogDetailsMain from "../Components/Blog/BlogDetailsMain";
import ScrollToTop from "../Components/ScrollToTop";
import { useSlugItem, resolveAssetUrl } from "../public-cms/hooks";

function BlogDetails() {
  const { id } = useParams();
  const { data: post } = useSlugItem("/public/blog", id);
  const title = post?.title || "Blog";
  const bgImage = resolveAssetUrl(post?.coverImageUrl) || "";

  return (
    <>
      <HeaderOne />
      <Breadcrumb
        title={title}
        pageKey="blog-details"
        bgImage={bgImage}
        parent={{ label: "Blog", url: "/blog" }}
      />
      <BlogDetailsMain />
      <FooterOne />
      <ScrollToTop />
    </>
  );
}

export default BlogDetails;
