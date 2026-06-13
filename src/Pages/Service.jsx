import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import FooterOne from '../Components/Footer/FooterOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import ServiceInner from '../Components/Services/ServiceInner'
import TestimonialOne from '../Components/Testimonials/TestimonialOne'
import ScrollToTop from '../Components/ScrollToTop'

function Service() {
    return (
        <div>
            <HeaderOne />
            <Breadcrumb title="Our Services" />
            <ServiceInner />
            <TestimonialOne />
            <FooterOne />
            <ScrollToTop />
        </div>
    )
}

export default Service
