import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import FooterOne from '../Components/Footer/FooterOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import ScrollToTop from '../Components/ScrollToTop'
import { useSettings } from '../public-cms/hooks'
import DOMPurify from 'dompurify'

/** Generic static/legal page (Privacy Policy, Terms, Cancellation Policy). */
function LegalPage({ pageKey, title, settingsKey, fallback }) {
    const settings = useSettings();
    const raw = settings[settingsKey] || fallback;
    const html = DOMPurify.sanitize(raw);

    return (
        <>
            <HeaderOne />
            <Breadcrumb pageKey={pageKey} title={title} />
            <section className="space">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-9">
                            <div className="di-legal-content" dangerouslySetInnerHTML={{ __html: html }} />
                        </div>
                    </div>
                </div>
            </section>
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default LegalPage
