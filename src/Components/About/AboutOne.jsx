import React from 'react'
import { Link } from 'react-router-dom'
import SafeHtml from '../../public-cms/SafeHtml'
import { cmsImage } from '../../public-cms/cmsImage'

const DEFAULT_IMAGES = {
    image: "/assets/img/normal/temple.webp",
    image2: "/assets/img/normal/lake.jpg",
    image3: "/assets/img/normal/boudha.jpg",
};

function AboutOne({ data = {} }) {
    const img1 = cmsImage(data.image, DEFAULT_IMAGES.image);
    const hasImage = Boolean(img1);
    const ctaLabel = data.ctaLabel || "Learn More";
    const ctaUrl = data.ctaUrl || "/about";
    const featureOneTitle = data.featureOneTitle || "Custom Itineraries";
    const featureOneText = data.featureOneText || "Tailor-made tours designed around your travel style, timeline, and comfort preference.";
    const featureTwoTitle = data.featureTwoTitle || "Licensed Local Guides";
    const featureTwoText = data.featureTwoText || "Explore with knowledgeable, safety-focused guides who know Nepal deeply.";
    const featureThreeTitle = data.featureThreeTitle || "24/7 Traveler Support";
    const featureThreeText = data.featureThreeText || "Round-the-clock assistance before, during, and after your trip — whenever you need us.";
    const featureFourTitle = "Best Price Guarantee";
    const featureFourText = "Transparent pricing with no hidden fees, matched against the best local rates.";

    return (
        <div className="about-area di-about-section position-relative space" id="about-sec">
            <div className="container">
                <div className="row gy-4 align-items-center">
                    {hasImage && (
                        <div className="col-lg-6">
                            <div className="di-about-imgs di-about-imgs--single">
                                <img
                                    className="di-about-imgs__primary"
                                    src={img1}
                                    alt={data.imageAlt || "About Dream International"}
                                    width="600"
                                    height="720"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </div>
                    )}
                    <div className={hasImage ? "col-lg-6 di-about-content" : "col-lg-10 col-xl-9 mx-auto di-about-content"}>
                        <span className="sub-title style1 di-section-script">{data.subTitle || "About Dream International"}</span>
                        <h2 className="sec-title mb-20">
                            {data.title || "Your Trusted Travel Partner in Nepal"}
                        </h2>
                        {data.text ? (
                            <SafeHtml className="sec-text mb-30" html={data.text} />
                        ) : (
                            <p className="sec-text mb-30">
                                We are a Kathmandu-based travel and tour company providing trekking,
                                cultural, and customized holiday experiences across Nepal with
                                experienced local guides and dedicated support.
                            </p>
                        )}
                        <div className="about-item-wrap mb-4">
                            <div className="about-item">
                                <div className="about-item_img" aria-hidden="true">
                                    <img src="/assets/img/icon/map3.svg" alt="" width="48" height="48" loading="lazy" decoding="async" />
                                </div>
                                <div className="about-item_centent">
                                    <h3 className="box-title">{featureOneTitle}</h3>
                                    <p className="about-item_text">{featureOneText}</p>
                                </div>
                            </div>
                            <div className="about-item">
                                <div className="about-item_img" aria-hidden="true">
                                    <img src="/assets/img/icon/guide.svg" alt="" width="48" height="48" loading="lazy" decoding="async" />
                                </div>
                                <div className="about-item_centent">
                                    <h3 className="box-title">{featureTwoTitle}</h3>
                                    <p className="about-item_text">{featureTwoText}</p>
                                </div>
                            </div>
                            <div className="about-item">
                                <div className="about-item_img" aria-hidden="true">
                                    <i className="fa-light fa-headset" aria-hidden="true" />
                                </div>
                                <div className="about-item_centent">
                                    <h3 className="box-title">{featureThreeTitle}</h3>
                                    <p className="about-item_text">{featureThreeText}</p>
                                </div>
                            </div>
                            <div className="about-item">
                                <div className="about-item_img" aria-hidden="true">
                                    <i className="fa-light fa-badge-percent" aria-hidden="true" />
                                </div>
                                <div className="about-item_centent">
                                    <h3 className="box-title">{featureFourTitle}</h3>
                                    <p className="about-item_text">{featureFourText}</p>
                                </div>
                            </div>
                        </div>
                        <Link
                            to={ctaUrl}
                            className="di-about-link"
                            aria-label={`${ctaLabel} about Dream International Travel and Tours`}
                        >
                            {ctaLabel} <i className="fa-regular fa-arrow-right" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutOne;
