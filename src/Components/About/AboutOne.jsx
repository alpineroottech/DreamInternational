import React from 'react'
import { Link } from 'react-router-dom'
import { resolveAssetUrl } from '../../public-cms/hooks'
import SafeHtml from '../../public-cms/SafeHtml'

function AboutOne({ data = {} }) {
    const aboutImg = resolveAssetUrl(data.image);
    const image2 = resolveAssetUrl(data.image2) || "/assets/img/normal/lake.jpg";
    const image3 = resolveAssetUrl(data.image3) || "/assets/img/normal/boudha.jpg";
    const ctaLabel = data.ctaLabel || "Learn More";
    const ctaUrl = data.ctaUrl || "/about";
    const featureOneTitle = data.featureOneTitle || "Custom Itineraries";
    const featureOneText = data.featureOneText || "Tailor-made tours designed around your travel style, timeline, and comfort preference.";
    const featureTwoTitle = data.featureTwoTitle || "Licensed Local Guides";
    const featureTwoText = data.featureTwoText || "Explore with knowledgeable, safety-focused guides who know Nepal deeply.";
    return (
        <div
            className="about-area position-relative overflow-hidden space"
            id="about-sec"
        >
            <div className="container shape-mockup-wrap">
                <div className="row">
                    <div className="col-xl-6">
                        <div className="img-box1">
                            <div className="img1">
                                <img src={aboutImg || "/assets/img/normal/temple.webp"} alt="About" />
                            </div>
                            <div className="img2">
                                <img src={image2} alt="About" />
                            </div>
                            <div className="img3">
                                <img src={image3} alt="About" />
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="ps-xl-4 ms-xl-2">
                            <div className="title-area mb-20 pe-xl-5 me-xl-5">
                                <span className="sub-title style1 ">{data.subTitle || "About Dream International"}</span>
                                <h2 className="sec-title mb-20 pe-xl-5 me-xl-5 heading">
                                    {data.title || "Plan Your Nepal Journey With Us"}
                                </h2>
                                {data.text ? (
                                    <SafeHtml className="sec-text mb-30" html={data.text} />
                                ) : (
                                    <p className="sec-text mb-30">
                                        We are a Kathmandu-based travel and tour company providing
                                        trekking, cultural, and customized holiday experiences across
                                        Nepal with experienced local guides and dedicated support.
                                    </p>
                                )}
                            </div>
                            <div className="about-item-wrap">
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
                            <div className="mt-35">
                                <Link to={ctaUrl} className="th-btn style3 th-icon">
                                    {ctaLabel}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="shape-mockup shape1 d-none d-xl-block"
                    style={{
                        top: "12%",
                        left: "-16%",
                    }}
                >
                    <img src="/assets/img/shape/shape_1.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup shape2 d-none d-xl-block"
                    style={{
                        top: "20%",
                        left: "-16%",
                    }}
                >
                    <img src="/assets/img/shape/shape_2.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup shape3 d-none d-xl-block"
                    style={{
                        top: "14%",
                        left: "-10%",
                    }}
                >
                    <img src="/assets/img/shape/shape_3.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup about-shape movingX d-none d-xxl-block"
                    style={{
                        bottom: "0%",
                        right: "-11%",
                    }}
                >
                    <img src="/assets/img/normal/about-slide-img.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup about-rating d-none d-xxl-block"
                    style={{
                        bottom: "50%",
                        right: "-20%",
                    }}
                >
                    <i className="fa-sharp fa-solid fa-star" />
                    <span>4.9k</span>
                </div>
                <div
                    className="shape-mockup about-emoji d-none d-xxl-block"
                    style={{
                        bottom: "25%",
                        right: "5%",
                    }}
                >
                    <img src="/assets/img/icon/emoji.png" alt="" />
                </div>
            </div>
        </div>

    )
}

export default AboutOne
