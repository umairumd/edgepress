import Image from "next/image";

const ServiceDetailsArea = () => {
    return (
        <div className="td-service-area td-breadcrumb-spacing pb-45">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="td-breadcrumb-wrap ">
                            <h2 className="td-section-page-title mb-35 wow fadeInLeft" data-wow-delay=".5s" data-wow-duration="1s">Web and product <span>development </span></h2>
                            <div className="td-service-hero-thumb-2 fix td-rounded-10 pt-105 mb-30">
                                <Image
                                    data-speed=".9"
                                    className="td-rounded-10"
                                    src="/assets/img/service/hero/thumb-2.jpg"
                                    alt="Service detail hero image"
                                    width={563}
                                    height={690}
                                    priority
                                    sizes="(max-width: 992px) 100vw, 40vw"
                                    style={{ height: "auto" }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="td-service-hero-wrap">
                            <div className="td-service-hero-content ml-110 wow fadeInRight" data-wow-delay=".5s" data-wow-duration="1s">
                                <p className="mb-40">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspe
                                    ndisse  varius enim in eros elementum Duis cursus, mi quis
                                    interdum nulla, ut commodo diam libero vitae erat.</p>
                                <div className="td-service-hero-border mb-60"></div>
                                <div className="td-about-main-feature-list">
                                    <ul>
                                        <li>Art direction</li>
                                        <li>Branding</li>
                                        <li>Content Production</li>
                                        <li>User Interface Design</li>
                                        <li>Animation</li>
                                        <li>Brand Identity</li>
                                        <li>User Interface</li>
                                        <li>User Experience</li>
                                        <li>Responsive Design</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="td-service-hero-thumb fix td-rounded-10 pt-200">
                                <Image
                                    data-speed=".9"
                                    className="td-rounded-10"
                                    src="/assets/img/service/hero/thumb.jpg"
                                    alt="Service detail hero image"
                                    width={645}
                                    height={430}
                                    priority
                                    sizes="(max-width: 992px) 100vw, 40vw"
                                    style={{ height: "auto" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServiceDetailsArea;
