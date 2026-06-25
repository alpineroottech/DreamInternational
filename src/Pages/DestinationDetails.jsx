import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import FooterOne from '../Components/Footer/FooterOne'
import DestinationDetailsMain from '../Components/Destination/DestinationDetailsMain'
import ScrollToTop from '../Components/ScrollToTop'

function DestinationDetails() {
    return (
        <>
            <HeaderOne />
            <DestinationDetailsMain />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default DestinationDetails
