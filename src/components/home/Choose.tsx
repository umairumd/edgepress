import Image from "next/image";
import { IconBullseye, IconUsers, IconGears } from "@/components/icons";

const Choose = () => {
    return (
        <div className="td-chose-area pt-155">
            <div className="container">
                <div className="row">
                    <div className="col-lg-7">
                        <div className="td-chose-6-title-wrap">
                            <h2 className="td-section-6-title mb-70 td-text-opacity">
                            BUILT FOR BUSINESSES THAT THINK LONG-TERM.
                            </h2>
                        </div>
                    </div>
                    <div className="col-xl-7 col-lg-6">
                        <div className="td-chose-6-thumb mr-110 mb-30 wow fadeInLeft" data-wow-delay=".4s" data-wow-duration="1s">
                            <Image
                                className="w-100"
                                src="/assets/img/chose/chose-6/inoma-home-3.jpg"
                                alt="Strategic business planning and digital execution at Inoma Digital"
                                width={645}
                                height={320}
                                sizes="(max-width: 991px) 100vw, 60vw"
                                style={{ width: "100%", height: "auto" }}
                            />
                        </div>
                    </div>
                    <div className="col-xl-5 col-lg-6">
                        <div className="td-chose-3-list-wrap td-chose-6-list-wrap mr-110 mb-30 wow fadeInRight" data-wow-delay=".4s" data-wow-duration="1s">
                            <div className="td-chose-3-list mb-35">
                                <h3 className="mb-20 td-home-value-title">
                                    <IconBullseye className="svg-icon-fw td-home-value-icon" aria-hidden="true" />
                                    Measurable Outcomes
                                </h3>
                                <p>
                                    Every decision we make is tied to business goals from visibility and leads to conversions and retention. We focus on what moves the needle, not vanity metrics.
                                </p>
                            </div>
                            <div className="td-chose-3-list  mb-35">
                                <h3 className="mb-20 td-home-value-title">
                                    <IconUsers className="svg-icon-fw td-home-value-icon" aria-hidden="true" />
                                    Strategic Partners
                                </h3>
                                <p>
                                    We collaborate closely with our clients, bringing structure, logic, and clarity to every engagement. No guesswork. No disconnected execution.
                                </p>
                            </div>
                            <div className="td-chose-3-list">
                                <h3 className="mb-20 td-home-value-title">
                                    <IconGears className="svg-icon-fw td-home-value-icon" aria-hidden="true" />
                                    Operational Discipline
                                </h3>
                                <p>
                                    With defined processes, clear ownership, and experienced leadership, we ensure consistent delivery across strategy, design, development, and marketing.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Choose;
