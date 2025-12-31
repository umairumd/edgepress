const Awards = () => {
    const highlights = [
        "8+ years of hands-on digital experience",
        "Proven success with international clients",
        "Clear communication and accountability",
        "Outcome-focused approach, not task selling",
        "Experience across multiple industries and businesses",
        "Experience across multiple industries and business models",
    ];

    return (
        <div className="td-awards-area td-awards-about-wrap pt-120 pb-130">
            <div className="container">
                <div className="row mb-40">
                    <div className="col-lg-6">
                        <div className="td-awards-5-title-wrap mb-30">
                            <h2 className="td-testimonial-title mb-25 td-text-invert">Key <span>Highlights</span></h2>
                            <span className="td-awards-5-btn">Built Through Consistency</span>
                        </div>
                    </div>
                    <div className="col-lg-6 wow fadeInRight" data-wow-delay=".5s" data-wow-duration="1s">
                        <div className="td-awards-5-text mt-140 mb-30 mr-80">
                            <p className="mb-0">
                                We measure success through long-term client relationships, consistent delivery, and real business impact. Over the years, our work has been shaped by trust, repeat partnerships, and results that continue to compound for the brands we support.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6 wow fadeInLeft" data-wow-delay=".5s" data-wow-duration="1s">
                        <div className="td-awards-5-thumb text-center pt-0 mb-30">
                            <img
                                src="/assets/img/awards/awards-5/inoma-pattern2.jpg"
                                alt=""
                                style={{ width: "70%", height: "auto" }}
                            />
                        </div>
                    </div>
                    <div className="col-lg-6 wow fadeInRight" data-wow-delay=".5s" data-wow-duration="1s">
                        <div className="td-awards-5-list mb-30">
                            {highlights.map((text) => (
                                <div key={text} className="td-awards-5-list-item d-flex justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <span className="mr-60">•</span>
                                        <span>{text}</span>
                                    </div>
                                    <span></span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Awards;
