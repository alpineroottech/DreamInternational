import React, { useState, useRef, useEffect } from "react";
import { useCollection, resolveCmsList } from "../../public-cms/hooks";
import SafeHtml from "../../public-cms/SafeHtml";

const FALLBACK = [
    {
        question: "How do I book a tour or trek with Dream International?",
        answer:
            "You can send us an enquiry through the contact form, email, or phone. Our team will confirm availability, share a tailored itinerary, and guide you through booking and payment.",
    },
    {
        question: "Do I need travel insurance for trekking in Nepal?",
        answer:
            "Yes. We strongly recommend comprehensive travel insurance that covers high-altitude trekking, medical treatment, and emergency helicopter evacuation for mountain trips.",
    },
    {
        question: "What is the best time of year to visit Nepal?",
        answer:
            "Spring (March–May) and autumn (September–November) offer the clearest skies and most stable weather for trekking and sightseeing, though Nepal can be visited year-round depending on your itinerary.",
    },
    {
        question: "Can you arrange custom or private itineraries?",
        answer:
            "Absolutely. We specialise in bespoke trips designed around your interests, schedule, fitness level, and budget — from cultural tours to challenging high-altitude expeditions.",
    },
    {
        question: "Do you handle permits, guides, and logistics?",
        answer:
            "Yes. Our local team arranges all necessary permits, licensed English-speaking guides, porters, transport, and accommodation so your journey stays smooth and hassle-free.",
    },
];

function FaqInner() {
    const [activeIndex, setActiveIndex] = useState(0);
    const contentRefs = useRef([]);

    const cms = useCollection("/public/faqs");
    const { loading, items: faqs } = resolveCmsList(cms, FALLBACK);

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
