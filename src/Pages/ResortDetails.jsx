import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import FooterOne from '../Components/Footer/FooterOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import ResortDetailsMain from '../Components/Resort/ResortDetailsMain'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function ResortDetails() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                pageKey="resort-details"
            title="Resort Details"
            />
            <ResortDetailsMain />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default ResortDetails
