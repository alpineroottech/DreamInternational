import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import FooterOne from '../Components/Footer/FooterOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import ServiceDetailsMain from '../Components/Services/ServiceDetailsMain'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function ServiceDetails() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                pageKey="service-details"
            title="Service Details"
            />
            <ServiceDetailsMain />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default ServiceDetails
