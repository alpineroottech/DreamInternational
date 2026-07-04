import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import FooterOne from '../Components/Footer/FooterOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import CartInner from '../Components/Shop/CartInner'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function Cart() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                pageKey="cart"
            title='Cart Page'
            />
            <CartInner />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default Cart
