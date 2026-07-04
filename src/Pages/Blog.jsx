import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import FooterOne from '../Components/Footer/FooterOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import BlogInner from '../Components/Blog/BlogInner'
import ScrollToTop from '../Components/ScrollToTop'
import FooterFour from '../Components/Footer/FooterFour'

function Blog() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                pageKey="blog"
            title="Blog Lists View"
            />
            <BlogInner />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default Blog
