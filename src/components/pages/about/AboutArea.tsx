import Link from "next/link";
import Image from "next/image";

const AboutArea = () => {
    return (
        <div className="td-about-area td-about-main-spacing pb-140">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="td-about-main-wrapper pb-90">
                            <h2 className="td-section-page-title td-title-anim text-center">
                                We&apos;re full service <span className="about-accent">digital agency</span> <br />
                                <span style={{ fontFamily: "var(--td-ff-dm)", fontStyle: "italic", fontWeight: 400 }}>
                                    helping businesses grow
                                </span>
                            </h2>
                        </div>
                    </div>
                    <div className="col-lg-5">
                        <div className="td-about-main-thumb mb-40 fix td-rounded-10 wow fadeInLeft" data-wow-delay=".5s" data-wow-duration="1s">
                            <Image
                                data-speed=".9"
                                className="w-100 td-rounded-10"
                                src="/assets/img/about/main/thumb.jpg"
                                alt="About Inoma Digital"
                                width={650}
                                height={650}
                                priority
                                sizes="(max-width: 992px) 100vw, 40vw"
                                style={{ height: "auto" }}
                            />
                        </div>
                    </div>
                    <div className="col-lg-7">
                        <div className="td-about-main-content ml-110 mb-40 wow fadeInRight" data-wow-delay=".5s" data-wow-duration="1s">
                            <h3 className="td-about-main-title mb-20">Driving sustainable business growth through technology</h3>
                            <div className="row">
                                <div className="col-lg-5 col-md-5">
                                    <div className="td-about-main-bigtext">
                                        <h2>8+</h2>
                                        <span>Years of experience</span>
                                    </div>
                                </div>
                                <div className="col-lg-7 col-md-7">
                                    <div className="td-about-main-text mt-30">
                                        <p className="mb-30">A digital agency built on systems, clarity, and long-term results. Helping businesses through strategy, design, technology, and marketing.</p>
                                        <div className="td-btn-group">
                                            <Link className="td-btn-circle about-brand-circle" href="/contact">
                                                <i className="fa-solid fa-arrow-right"></i>
                                            </Link>
                                            <Link className="td-btn-2 td-btn-primary about-brand-btn" href="/contact">EXPLORE MORE</Link>
                                            <Link className="td-btn-circle about-brand-circle" href="/contact">
                                                <i className="fa-solid fa-arrow-right"></i>
                                            </Link>
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

export default AboutArea;
