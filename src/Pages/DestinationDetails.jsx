import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import DestinationDetailsMain from '../Components/Destination/DestinationDetailsMain'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function DestinationDetails() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Pokhara City"
            />
            <DestinationDetailsMain />
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default DestinationDetails
