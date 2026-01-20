"use client";
import type { JSX } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

interface DataType {
    id: number;
    count: number;
    count_text?: string;
    title: JSX.Element;
}

const counter_data: DataType[] = [
    {
        id: 1,
        count: 625,
        count_text: "+",
        title: (<>Projects<br /> Delivered</>),
    },
    {
        id: 2,
        count: 90,
        count_text: "%",
        title: (<>Client Retention<br /> Rate</>),
    },
    {
        id: 3,
        count: 25,
        count_text: "+",
        title: (<>Industries<br /> Served</>),
    },
    {
        id: 4,
        count: 7,
        count_text: "+",
        title: (<>Years of<br /> Experience</>),
    },
];

const Counter = () => {
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true,
    });

    return (
        <div className="td-counter-area pt-155 pb-140" ref={ref}>
            <div className="container">
                <div className="row align-items-end mb-70">
                    <div className="col-lg-8">
                        <div className="td-service-6-title-wrap mb-30">
                            <span className="td-section-6-subtitle mb-20 d-inline-block">OUR TRACK RECORD</span>
                            <h2 className="td-section-6-bigtitle td-text-opacity">WHAT WE&apos;VE<br /> BUILT SO FAR</h2>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="td-service-6-title-text mr-80 mb-35">
                            <p className="td-section-6-text mb-0">
                                Our progress is measured by consistency, long-term client relationships, and work that compounds over time. Every number here reflects real execution, real businesses, and real outcomes.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-12 ">
                    <div className="td-counter-6-wrap">
                        {counter_data.map((item) => (
                            <div key={item.id} className="td-counter-6-item wow fadeInLeft" data-wow-delay=".3s" data-wow-duration="1s">
                                <h3 className="count d-flex align-items-center justify-content-center">
                                    <span className="odometer">
                                        {inView ? <CountUp end={item.count} duration={2} /> : 0}
                                    </span>
                                    {item.count_text}
                                </h3>
                                <span className="text">{item.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Counter;
