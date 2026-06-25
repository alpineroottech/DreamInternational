import React from 'react'
import { Link } from 'react-router-dom'
import { resolveAssetUrl } from '../../public-cms/hooks'
import SafeHtml from '../../public-cms/SafeHtml'

function AboutOne({ data = {} }) {
    const img1 = resolveAssetUrl(data.image) || "/assets/img/normal/temple.webp";
    const img2 = resolveAssetUrl(data.image2) || "/assets/img/normal/lake.jpg";
    const img3 = resolveAssetUrl(data.image3) || "/assets/img/normal/boudha.jpg";
    const ctaLabel = data.ctaLabel || "Learn More";
    const ctaUrl = data.ctaUrl || "/about";
    const featureOneTitle = data.featureOneTitle || "Custom Itineraries";
    const featureOneText = data.featureOneText || "Tailor-made tours designed around your travel style, timeline, and comfort preference.";
    const featureTwoTitle = data.featureTwoTitle || "Licensed Local Guides";
    const featureTwoText = data.featureTwoText || "Explore with knowledgeable, safety-focused guides who know Nepal deeply.";

    return (
        <div className="about-area position-relative overflow-hidden space" id="about-sec">
            <div className="container">
                <div className="row gy-4 align-items-center">
                    {/* Image collage column */}
                    <div className="col-lg-6 d-flex justify-content-center">
                        <div className="di-about-imgs">
                            <img className="di-about-imgs__primary" src={img1} alt="Nepal travel" />
                            <div className="di-about-imgs__secondary-wrap">
                                <img src={img2} alt="Nepal landscape" />
                                <img src={img3} alt="Nepal temple" />
                            </div>
                        </div>
                    </div>
                    {/* Text column */}
                    <div className="col-lg-6">
                        <span className="sub-title style1">{data.subTitle || "About Dream International"}</span>
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
                        <Link to={ctaUrl} className="th-btn style3 th-icon">
                            {ctaLabel}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutOne;
