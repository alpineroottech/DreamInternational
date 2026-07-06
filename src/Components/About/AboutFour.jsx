import { Link } from 'react-router-dom'
import { resolveAssetUrl, useSettings } from '../../public-cms/hooks'
import SafeHtml from '../../public-cms/SafeHtml'

function AboutFour() {
   const settings = useSettings();
   const img1 = settings.aboutImage1 ? resolveAssetUrl(settings.aboutImage1) : "";
   const img2 = settings.aboutImage2 ? resolveAssetUrl(settings.aboutImage2) : "";
   const img3 = settings.aboutImage3 ? resolveAssetUrl(settings.aboutImage3) : "";
   const hasCollage = Boolean(img1 || img2 || img3);
   const subTitle = settings.aboutSubtitle || "Welcome To Dream International";
   const title = settings.aboutTitle || "Trusted Nepal travel specialists for adventure, culture, and comfort";
   const text1 =
      settings.aboutText1 ||
      "Dream International is a Kathmandu-based travel company helping guests experience Nepal through curated trekking, cultural, pilgrimage, and nature journeys.";
   const text2 =
      settings.aboutText2 ||
      "From airport arrival to final departure, our local team manages permits, logistics, and support so your trip stays smooth, safe, and meaningful.";
   const featureOneTitle = settings.aboutFeatureOneTitle || "Custom Itineraries";
   const featureOneText =
      settings.aboutFeatureOneText ||
      "Personalized travel plans designed around your schedule, budget, and comfort level.";
   const featureTwoTitle = settings.aboutFeatureTwoTitle || "Safety First Always";
   const featureTwoText =
      settings.aboutFeatureTwoText ||
      "Experienced guides, practical altitude planning, and responsive support throughout your trip.";
   const featureThreeTitle = settings.aboutFeatureThreeTitle || "Professional Guide";
   const featureThreeText =
      settings.aboutFeatureThreeText ||
      "Licensed local guides who bring destinations, culture, and history to life.";
   const ctaLabel = settings.aboutCtaLabel || "Contact With Us";
   const ctaUrl = settings.aboutCtaUrl || "/contact";

   return (
      <div className="about-area position-relative overflow-hidden overflow-hidden space" id="about-sec">
         <div className="container shape-mockup-wrap">
            <div className="row gy-4 align-items-center">
               {hasCollage && (
                  <div className="col-xl-7">
                     <div className="img-box3">
                        {img1 && (
                           <div className="img1">
                              <img src={img1} alt="About Dream International" />
                           </div>
                        )}
                        {img2 && (
                           <div className="img2">
                              <img src={img2} alt="Nepal travel" />
                           </div>
                        )}
                        {img3 && (
                           <div className="img3 movingX">
                              <img src={img3} alt="Nepal destination" />
                           </div>
                        )}
                     </div>
                  </div>
               )}
               <div className={hasCollage ? "col-xl-5" : "col-xl-10 col-lg-11 mx-auto"}>
                  <div className={hasCollage ? "ps-xl-4" : ""}>
                     <div className="title-area mb-20">
                        <span className="sub-title style1 ">{subTitle}</span>
                        <h2 className="sec-title mb-20 pe-xl-5 me-xl-5 heading">
                           {title}
                        </h2>
                     </div>
                     <SafeHtml className="pe-xl-5" html={`<p>${text1}</p>`} />
                     <SafeHtml className="mb-30 pe-xl-5" html={`<p>${text2}</p>`} />
                     <div className="about-item-wrap">
                        <div className="about-item style2">
                           <div className="about-item_img">
                              <img src="/assets/img/icon/about_1_1.svg" alt="" />
                           </div>
                           <div className="about-item_centent">
                              <h5 className="box-title">{featureOneTitle}</h5>
                              <p className="about-item_text">{featureOneText}</p>
                           </div>
                        </div>
                        <div className="about-item style2">
                           <div className="about-item_img">
                              <img src="/assets/img/icon/about_1_2.svg" alt="" />
                           </div>
                           <div className="about-item_centent">
                              <h5 className="box-title">{featureTwoTitle}</h5>
                              <p className="about-item_text">{featureTwoText}</p>
                           </div>
                        </div>
                        <div className="about-item style2">
                           <div className="about-item_img">
                              <img src="/assets/img/icon/about_1_3.svg" alt="" />
                           </div>
                           <div className="about-item_centent">
                              <h5 className="box-title">{featureThreeTitle}</h5>
                              <p className="about-item_text">{featureThreeText}</p>
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
               className="shape-mockup movingX d-none d-xxl-block"
               style={{ top: '0%', left: '-18%' }}
            >
               <img src="/assets/img/shape/shape_2_1.png" alt="" />
            </div>
            <div
               className="shape-mockup jump d-none d-xxl-block"
               style={{ top: '28%', right: '-15%' }}
            >
               <img src="/assets/img/shape/shape_2_2.png" alt="" />
            </div>
            <div
               className="shape-mockup spin d-none d-xxl-block"
               style={{ top: '18%', left: '-112%' }}
            >
               <img src="/assets/img/shape/shape_2_3.png" alt="" />
            </div>
            <div
               className="shape-mockup movixgX d-none d-xxl-block"
               style={{ bottom: '18%', right: '-12%' }}
            >
               <img src="/assets/img/shape/shape_2_4.png" alt="" />
            </div>
         </div>
      </div>
   )
}

export default AboutFour
