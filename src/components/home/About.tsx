import Image from "next/image";

const About = () => {
    return (
        <div className="td-about-area pt-140 pb-125">
            <div className="container">
                <div className="row">
                    <div className="col-lg-5">
                        <div className="td-about-6-subtitle mb-20">
                            <span className="td-section-6-subtitle">WHO WE ARE</span>
                        </div>
                    </div>
                    <div className="col-lg-7">
                        <div className="td-about-6-title-wrap mb-50">
                            <h2 className="td-section-6-title mb-20 td-text-opacity">
                                Where Business Strategy Meets
                                
                                Digital Execution
                            </h2>
                            <p className="td-section-6-text">Some definitions of marketing highlight marketing&apos;s ability to produce value to shareholders
                                of the firm as well. In this context, marketing can be defined as &quot;the management
                                that seeks to maximise returns to shareholders</p>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="td-about-6-thumb text-end p-relative z-index-1 mb-30">
                            <Image
                                className="shape td-live-anim-spin d-none d-lg-inline-block"
                                src="/assets/img/about/shape.png"
                                alt=""
                                width={140}
                                height={140}
                                sizes="140px"
                                aria-hidden="true"
                            />
                            <Image
                                src="/assets/img/about/about-6/thumb.jpg"
                                alt=""
                                className="w-100"
                                width={450}
                                height={430}
                                sizes="(max-width: 991px) 100vw, 450px"
                                style={{ width: "100%", height: "auto" }}
                            />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="td-about-6-author ml-115 mb-30">
                            <div className="td-about-6-author-top mb-40">
                                <Image
                                    className="mb-25"
                                    src="/assets/img/about/about-6/avatar.png"
                                    alt=""
                                    width={177}
                                    height={60}
                                    sizes="177px"
                                    style={{ height: "auto" }}
                                />
                                <p className="mb-25">Driven by a passion for innovation, we specialize in<br />
                                    delivering top-quality design solutions</p>
                            </div>
                            <div className="td-about-6-author-count">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <div className="td-about-6-author-single">
                                            <h2 className="mb-10">98%</h2>
                                            <p>Clients Satisfied and<br /> Repeating</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <div className="td-about-6-author-single">
                                            <h2 className="mb-10">125+</h2>
                                            <p>Projects Completed in<br /> 24 Countries</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About;
