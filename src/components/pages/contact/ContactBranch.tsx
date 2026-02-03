import Link from "next/link";
import Image from "next/image";

const ContactBranch = () => {
    return (
        <div className="td-contact-branch-area pb-140">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="text-center wow fadeInUp" data-wow-delay=".5s" data-wow-duration="1s">
                            <h2 className="td-section-page-title mb-105">Our <span>Offices</span></h2>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="td-contact-branch-item td-contact-branch-border wow fadeInUp" data-wow-delay=".5s" data-wow-duration="1s">
                            <div className="row">
                                <div className="col-lg-3 col-md-6 col-sm-6">
                                    <h3 className="td-contact-branch-name mb-20">Pakistan</h3>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-6">
                                    <div className="td-contact-branch-thumb mb-20">
                                        <Image
                                            className="w-100 td-rounded-10"
                                            src="/assets/img/contact/pakistan.jpg"
                                            alt="Okara Office"
                                            width={320}
                                            height={242}
                                            sizes="(max-width: 992px) 100vw, 25vw"
                                            style={{ height: "auto" }}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-6">
                                    <div className="td-contact-branch-lucation ml-40 mb-20">
                                        <h5 className="td-contact-branch-lucation-title">Okara Office</h5>
                                        <Link className="lucation mb-110" href="#">M.A Jinnah Road, Okara</Link>
                                        <Link className="map" href="https://www.google.com/maps?cid=0xa3d289e5fa228a2" target="_blank" rel="noopener noreferrer">Google Maps</Link>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-6">
                                    <div className="td-contact-branch-number ml-40 mb-20">
                                        <Link className="mb-30" href="tel:+923142551400">+92-314-2551400</Link>
                                        <Link className="link" href="mailto:info@inomadigital.com">info@inomadigital.com</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="td-contact-branch-item td-contact-branch-border wow fadeInUp" data-wow-delay=".7s" data-wow-duration="1s">
                            <div className="row">
                                <div className="col-lg-3 col-md-6 col-sm-6">
                                    <h3 className="td-contact-branch-name mb-20">UAE</h3>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-6">
                                    <div className="td-contact-branch-thumb mb-20">
                                        <Image
                                            className="w-100 td-rounded-10"
                                            src="/assets/img/contact/uae.jpg"
                                            alt="Dubai Office"
                                            width={320}
                                            height={242}
                                            sizes="(max-width: 992px) 100vw, 25vw"
                                            style={{ height: "auto" }}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-6">
                                    <div className="td-contact-branch-lucation ml-40 mb-20">
                                        <h5 className="td-contact-branch-lucation-title">Dubai Office</h5>
                                        <Link className="lucation mb-110" href="#">Al-Shoala Building, Deira, Dubai</Link>
                                        <Link className="map" href="https://www.google.com/maps/search/?api=1&query=Al-Shoala%20Building%2C%20Deira%2C%20Dubai" target="_blank" rel="noopener noreferrer">Google Maps</Link>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-6">
                                    <div className="td-contact-branch-number ml-40 mb-20">
                                        <Link className="mb-30" href="tel:+923142551400">+92-314-2551400</Link>
                                        <Link className="link" href="mailto:info@inomadigital.com">info@inomadigital.com</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="td-contact-branch-item wow fadeInUp" data-wow-delay=".9s" data-wow-duration="1s">
                            <div className="row">
                                <div className="col-lg-3 col-md-6 col-sm-6">
                                    <h3 className="td-contact-branch-name mb-20">USA</h3>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-6">
                                    <div className="td-contact-branch-thumb mb-20">
                                        <Image
                                            className="w-100 td-rounded-10"
                                            src="/assets/img/contact/usa.webp"
                                            alt="USA Office"
                                            width={320}
                                            height={242}
                                            sizes="(max-width: 992px) 100vw, 25vw"
                                            style={{ height: "auto" }}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-6">
                                    <div className="td-contact-branch-lucation ml-40 mb-20">
                                        <h5 className="td-contact-branch-lucation-title">USA (Registered Office)</h5>
                                        <Link className="lucation mb-110" href="#">Inoma LLC, 30 N Gould St #51443, Sheridan, WY 82801, United States</Link>
                                        <Link className="map" href="https://www.google.com/maps/search/?api=1&query=30+N+Gould+St+%2351443%2C+Sheridan%2C+WY+82801%2C+United+States" target="_blank" rel="noopener noreferrer">Google Maps</Link>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-6">
                                    <div className="td-contact-branch-number ml-40 mb-20">
                                        <Link className="mb-30" href="tel:+13073103534">+1 307 310 3534</Link>
                                        <Link className="link" href="mailto:info@inomadigital.com">info@inomadigital.com</Link>
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

export default ContactBranch;

