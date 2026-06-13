import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import FooterOne from '../Components/Footer/FooterOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import ActivitiesDetailsMain from '../Components/Activities/ActivitiesDetailsMain'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function ActivitiesDetails() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Activities Details"
            />
            <ActivitiesDetailsMain />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default ActivitiesDetails
