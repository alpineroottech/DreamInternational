import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { useCollection, resolveCmsList } from "../../public-cms/hooks";

const SKELETON_COUNT = 4;

const CounterOne = () => {
    const cms = useCollection("/public/counters");
    const { loading, items: cmsCounters } = resolveCmsList(cms);
    const counters = cmsCounters.map((c) => {
        const num = parseInt(String(c.value).replace(/[^0-9]/g, ""), 10);
        return {
            value: Number.isNaN(num) ? 0 : num,
            suffix: c.suffix || "",
            title: c.label,
            icon: c.icon || "fa-light fa-star",
        };
    });

    const { ref, inView } = useInView({ triggerOnce: true });

    if (loading) {
        return (
            <section className="counter-area space di-stats-section" ref={ref}>
                <div className="container">
                    <div className="row g-4 justify-content-center">
                        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                            <div key={index} className="col-6 col-lg-3">
                                <div className="di-stat-card di-skeleton-card">
                                    <div className="di-skeleton di-skeleton-circle" />
                                    <div className="di-skeleton di-skeleton-line di-skeleton-line--lg" />
                                    <div className="di-skeleton di-skeleton-line di-skeleton-line--sm" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (counters.length === 0) return null;

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
