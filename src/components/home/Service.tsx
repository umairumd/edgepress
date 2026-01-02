import Link from "next/link";
import type { JSX } from "react";

interface DataType {
    id: number;
    title: JSX.Element;
    desc: string;
}

const service_data: DataType[] = [
    {
        id: 1,
        title: (<>Digital Marketing</>),
        desc: "Campaigns built to drive measurable growth across channels."
    },
    {
        id: 2,
        title: (<>Graphics Designing</>),
        desc: "Clear, consistent visuals that strengthen your brand presence."
    },
    {
        id: 3,
        title: (<>SEO Services</>),
        desc: "Sustainable search visibility that compounds over time."
    },
    {
        id: 4,
        title: (<>Web Development</>),
        desc: "Fast, scalable websites built for performance and conversion."
    },
];

const Service = () => {
    return (
        <div className="td-service-6-area">
            <div className="container">
                <div className="row align-items-end">
                    <div className="col-lg-8">
                        <div className="td-service-6-title-wrap mb-30">
                            <span className="td-section-6-subtitle mb-20 d-inline-block">OUR SERVICES</span>
                            <h2 className="td-section-6-bigtitle td-text-opacity">EXPLORE<br /> OUR SERVICE</h2>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="td-service-6-title-text mr-80 mb-35">
                            <p className="td-section-6-text mb-30">
                                A focused set of services designed to support business growth — from strategy to execution.
                            </p>
                            <p className="td-section-6-text">
                                Explore what we do best and how we help brands build, market, and scale with clarity.
                            </p>
                        </div>
                    </div>
                    <div className="col-12 pt-55">
                        {service_data.map((item, i) => (
                            <div key={item.id} className="td-service-6-item">
                                <div className="row">
                                    <div className="col-lg-5">
                                        <div className="td-service-6-item-title mb-15">
                                            <span className="d-inline-block mr-80">0{i + 1}</span>
                                            <h3>{item.title}</h3>
                                        </div>
                                    </div>
                                    <div className="col-lg-5">
                                        <div className="td-service-6-text mb-15">
                                            <p>{item.desc}</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-2">
                                        <div className="td-service-6-btn text-lg-center mb-15">
                                            <Link href="/service" aria-label="View services">
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M1 1H13V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="d-flex justify-content-center mt-50">
                            <Link className="td-btn-12 td-home-services-cta" href="/service">
                                Explore All Services
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Service;
