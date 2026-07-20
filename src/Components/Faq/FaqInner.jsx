import React, { useState, useRef, useEffect } from "react";
import { useCollection, resolveCmsList } from "../../public-cms/hooks";
import SafeHtml from "../../public-cms/SafeHtml";

function FaqInner() {
    const [activeIndex, setActiveIndex] = useState(0);
    const contentRefs = useRef([]);

    const cms = useCollection("/public/faqs");
    const { loading, items: faqs } = resolveCmsList(cms);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    useEffect(() => {
        contentRefs.current.forEach((ref, index) => {
            if (ref) {
                ref.style.maxHeight = activeIndex === index ? `${ref.scrollHeight}px` : "0px";
            }
        });
    }, [activeIndex, faqs]);

    if (loading) return null;

    return (
        <div className="space-top space-extra-bottom">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-7">
                        <div className="title-area text-center">
                            <span className="sub-title">FAQ</span>
                            <h2 className="sec-title">Frequently Asked Questions</h2>
                            <p>Have questions you want answers to?</p>
                        </div>
                    </div>
                </div>
                {faqs.length === 0 ? (
                    <div className="row">
                        <div className="col-12 text-center">
                            <p className="mb-0">No FAQs published yet.</p>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-lg-10 offset-lg-1">
                            <div className="accordion-area mb-30">
                                {faqs.map((faq, index) => (
                                    <div
                                        key={faq.id || index}
                                        className={`accordion-card style2 ${activeIndex === index ? "active" : ""}`}
                                    >
                                        <div className="accordion-header">
                                            <button
                                                className={`accordion-button ${activeIndex === index ? "" : "collapsed"}`}
                                                onClick={() => toggleAccordion(index)}
                                            >
                                                Q{index + 1}. {faq.question}
                                            </button>
                                        </div>
                                        <div
                                            ref={(el) => (contentRefs.current[index] = el)}
                                            className="accordion-collapse"
                                        >
                                            <div className="accordion-body">
                                                <SafeHtml className="faq-text" html={faq.answer} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FaqInner;
