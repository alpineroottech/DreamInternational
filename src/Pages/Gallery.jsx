import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import FooterOne from '../Components/Footer/FooterOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import GalleryInner from '../Components/Gallery/GalleryInner'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function Gallery() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                pageKey="gallery"
            title="Gallery"
            />
            <GalleryInner />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default Gallery
