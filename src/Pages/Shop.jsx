import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import FooterOne from '../Components/Footer/FooterOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import ShopInner from '../Components/Shop/ShopInner'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function Shop() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Shops"
            />
            <ShopInner />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default Shop
