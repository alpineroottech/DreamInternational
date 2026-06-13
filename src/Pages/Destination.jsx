import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import FooterOne from '../Components/Footer/FooterOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import DestinationInner from '../Components/Destination/DestinationInner'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function Destination() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Destination"
            />
            <DestinationInner />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default Destination
