import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import FooterOne from '../Components/Footer/FooterOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import PricingPlan from '../Components/Services/PricingPlan'
import Cta from '../Components/Services/Cta'
import FaqInnerTwo from '../Components/Faq/FaqInnerTwo'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function Pricing() {
    return (
        <div>
            <HeaderOne />
            <Breadcrumb
                title="Pricing Plan"
            />
            <PricingPlan className="space"/>
            <Cta />
            <FaqInnerTwo />
            <FooterOne />
            <ScrollToTop />
        </div>
    )
}

export default Pricing
