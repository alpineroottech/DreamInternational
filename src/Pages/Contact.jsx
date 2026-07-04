import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import FooterOne from '../Components/Footer/FooterOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import GetInTouch from '../Components/Contact/GetInTouch'
import BookATour from '../Components/Contact/BookATour'
import ContactMap from '../Components/Contact/ContactMap'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function Contact() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                pageKey="contact"
            title='Contact Us'
            />
            <GetInTouch />
            <BookATour />
            <ContactMap />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default Contact
