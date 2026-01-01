import Image from "next/image";

const Choose = () => {
    return (
        <div className="td-chose-area pt-155">
            <div className="container">
                <div className="row">
                    <div className="col-lg-7">
                        <div className="td-chose-6-title-wrap">
                            <h2 className="td-section-6-title mb-70 td-text-opacity">We are result driven,
                                customer oriented digital
                                media agency with years of
                                combined experience.</h2>
                        </div>
                    </div>
                    <div className="col-xl-7 col-lg-6">
                        <div className="td-chose-6-thumb mr-110 mb-30 wow fadeInLeft" data-wow-delay=".4s" data-wow-duration="1s">
                            <Image
                                className="w-100"
                                src="/assets/img/chose/chose-6/thumb.jpg"
                                alt=""
                                width={645}
                                height={320}
                                sizes="(max-width: 991px) 100vw, 60vw"
                                style={{ height: "auto" }}
                            />
                        </div>
                    </div>
                    <div className="col-xl-5 col-lg-6">
                        <div className="td-chose-3-list-wrap td-chose-6-list-wrap mr-110 mb-30 wow fadeInRight" data-wow-delay=".4s" data-wow-duration="1s">
                            <div className="td-chose-3-list mb-35">
                                <h3 className="mb-20">We drive positive change.</h3>
                                <p>We are excited for our work and how it positively
                                    impacts clients. With over of experience<br />
                                    we have been constantly</p>
                            </div>
                            <div className="td-chose-3-list  mb-35">
                                <h3 className="mb-20">We are rational together.</h3>
                                <p>We are excited for our work and how it positively
                                    impacts clients. With over of experience<br />
                                    we have been constantly</p>
                            </div>
                            <div className="td-chose-3-list">
                                <h3 className="mb-20">Management Expertise</h3>
                                <p>We are excited for our work and how it positively
                                    impacts clients. With over of experience<br />
                                    we have been constantly</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Choose;
