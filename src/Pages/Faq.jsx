import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import FooterOne from '../Components/Footer/FooterOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import FaqInner from '../Components/Faq/FaqInner'
import ElementSection from '../Components/Elements/ElementSection'
import FaqContact from '../Components/Faq/FaqContact'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function Faq() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                pageKey="faq"
            title="FAQs"
            />
            <FaqInner />
            <ElementSection />
            <FaqContact />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default Faq
