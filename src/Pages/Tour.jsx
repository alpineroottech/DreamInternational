import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import FooterOne from '../Components/Footer/FooterOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import TourInner from '../Components/Tour/TourInner'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function Tour() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                pageKey="tours"
            title="Nepal Experiences"
            />
            <TourInner />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default Tour
