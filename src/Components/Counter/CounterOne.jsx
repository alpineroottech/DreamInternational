import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { useCollection, resolveCmsList } from "../../public-cms/hooks";

const FALLBACK = [
    { value: 12, suffix: "+", title: "Years of Experience", icon: "fa-light fa-award" },
    { value: 3568, suffix: "", title: "Happy Customers", icon: "fa-light fa-face-smile" },
    { value: 20, suffix: "+", title: "Tour Destinations", icon: "fa-light fa-map-location-dot" },
    { value: 25, suffix: "", title: "Professional Guides", icon: "fa-light fa-user-group" },
];

const CounterOne = () => {
    const cms = useCollection("/public/counters");
    const { loading, items: fallbackCounters } = resolveCmsList(cms, FALLBACK);
    const counters =
        cms && cms.length
            ? cms.map((c, i) => {
                const num = parseInt(String(c.value).replace(/[^0-9]/g, ""), 10);
                const fb = FALLBACK[i % FALLBACK.length];
                return {
                    value: Number.isNaN(num) ? 0 : num,
                    suffix: c.suffix || "",
                    title: c.label,
                    icon: c.icon || fb.icon,
                };
            })
            : fallbackCounters;

    const { ref, inView } = useInView({ triggerOnce: true });

    if (loading) return null;

    return (
        <section className="counter-area space di-stats-section" ref={ref}>
            <div className="container">
                <div className="row g-4 justify-content-center">
                    {counters.map((counter, index) => (
                        <div key={index} className="col-6 col-lg-3">
                            <div className="di-stat-card">
                                <div className="di-stat-card__icon" aria-hidden="true">
                                    {String(counter.icon || "").startsWith("fa") ? (
                                        <i className={counter.icon} />
                                    ) : counter.icon ? (
                                        <img src={counter.icon} alt="" />
                                    ) : (
                                        <i className="fa-light fa-star" />
                                    )}
                                </div>
                                <div className="di-stat-card__value">
                                    {inView && (
                                        <CountUp
                                            start={0}
                                            end={counter.value}
                                            duration={2}
                                            separator=","
                                        />
                                    )}
                                    {counter.suffix}
                                </div>
                                <p className="di-stat-card__label">{counter.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CounterOne;
