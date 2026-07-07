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
    const img2 = cmsImage(data.image2, DEFAULT_IMAGES.image2);
    const img3 = cmsImage(data.image3, DEFAULT_IMAGES.image3);
    const hasCollage = Boolean(img1 || img2 || img3);
    const ctaLabel = data.ctaLabel || "Learn More";
    const ctaUrl = data.ctaUrl || "/about";
    const featureOneTitle = data.featureOneTitle || "Custom Itineraries";
    const featureOneText = data.featureOneText || "Tailor-made tours designed around your travel style, timeline, and comfort preference.";
    const featureTwoTitle = data.featureTwoTitle || "Licensed Local Guides";
    const featureTwoText = data.featureTwoText || "Explore with knowledgeable, safety-focused guides who know Nepal deeply.";

    return (
        <div className="about-area di-about-section position-relative overflow-hidden space" id="about-sec">
            <div className="container">
                <div className="row gy-4 align-items-center">
                    {hasCollage && (
                        <div className="col-lg-6 d-flex justify-content-center">
                            <div className="di-about-imgs">
                                {img1 && (
                                    <img
                                        className="di-about-imgs__primary"
                                        src={img1}
                                        alt={data.imageAlt || "About Dream International"}
                                    />
                                )}
                                {(img2 || img3) && (
                                    <div className="di-about-imgs__secondary-wrap">
                                        {img2 && (
                                            <img src={img2} alt={data.image2Alt || "Nepal landscape"} />
                                        )}
                                        {img3 && (
                                            <img src={img3} alt={data.image3Alt || "Nepal culture"} />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div className={hasCollage ? "col-lg-6" : "col-lg-10 col-xl-9 mx-auto"}>
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
                                <div className="about-item_img">
                                    <img src="/assets/img/icon/map3.svg" alt="" />
                                </div>
                                <div className="about-item_centent">
                                    <h5 className="box-title">{featureOneTitle}</h5>
                                    <p className="about-item_text">{featureOneText}</p>
                                </div>
                            </div>
                            <div className="about-item">
                                <div className="about-item_img">
                                    <img src="/assets/img/icon/guide.svg" alt="" />
                                </div>
                                <div className="about-item_centent">
                                    <h5 className="box-title">{featureTwoTitle}</h5>
                                    <p className="about-item_text">{featureTwoText}</p>
                                </div>
                            </div>
                        </div>
                        <Link to={ctaUrl} className="di-about-link">
                            {ctaLabel} <i className="fa-regular fa-arrow-right" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutOne;
