import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import FooterOne from '../Components/Footer/FooterOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import VehicleRentalsInner from '../Components/VehicleRentals/VehicleRentalsInner'
import ScrollToTop from '../Components/ScrollToTop'

function VehicleRentals() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                pageKey="vehicle-rentals"
                title="Vehicle Rentals"
            />
            <VehicleRentalsInner />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default VehicleRentals
