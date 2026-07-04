import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import FooterOne from '../Components/Footer/FooterOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import AboutFour from '../Components/About/AboutFour'
import TourGuide from '../Components/Guide/TourGuide'
import TestimonialOne from '../Components/Testimonials/TestimonialOne'
import BrandOne from '../Components/Brand/BrandOne'
import GalleryOne from '../Components/Gallery/GalleryOne'
import ScrollToTop from '../Components/ScrollToTop'

function About() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb pageKey="about" title="About Dream International Travel and Tours" />
            <AboutFour />
            <TourGuide />
            <TestimonialOne />
            <BrandOne />
            <GalleryOne />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default About
