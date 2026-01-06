"use client";
import Link from "next/link";
import Image from "next/image";
import { IconPhone, IconEnvelope } from "@/components/icons";

interface FooterSixProps {
    style?: boolean;
}

const FooterSix = ({ style }: FooterSixProps = {}) => {
    return (
        <footer>
            <div className={`td-footer-area td-footer-6-wrap ${style ? "td-footer-spacing" : "pt-120"} td-testimonial-6-bg `}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="td-footer-logo mb-30">
                                <Link href="/">
                                        <Image
                                            src="/assets/img/logo/inoma-logo-geometry.png"
                                            alt="Inoma Digital"
                                            width={321}
                                            height={503}
                                            sizes="160px"
                                            style={{ width: "160px", height: "auto" }}
                                        />
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-6 col-sm-6">
                            <div className="td-footer-widget mb-30">
                                <h3 className="td-footer-title mb-30">Quick Link</h3>
                                <ul className="td-footer-widget-list">
                                    <li><Link href="/about">About</Link></li>
                                    <li><Link href="/team">Team</Link></li>
                                    <li><Link href="/portfolio">Portfolio</Link></li>
                                    <li><Link href="/contact">Contact</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="td-footer-widget ml-80 mb-30">
                                <h3 className="td-footer-title mb-30">Services</h3>
                                <ul className="td-footer-widget-list">
                                    <li><Link href="/service">All Services</Link></li>
                                    <li><Link href="/pricing">Pricing</Link></li>
                                    <li><Link href="/blog">Blog</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="td-footer-widget mr-30 mb-30">
                                    <h3 className="td-footer-title mb-30">Connect</h3>
                                    <div className="td-footer-connect mb-45">
                                        <div className="d-flex align-items-center mb-10">
                                            <IconPhone className="mr-10" aria-hidden="true" />
                                            <Link href="tel:+923142551400">+92-314-2551400</Link>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <IconEnvelope className="mr-10" aria-hidden="true" />
                                            <Link href="mailto:info@inomadigital.com">info@inomadigital.com</Link>
                                        </div>
                                    </div>
                                <div className="td-footer-form p-relative">
                                    <form onSubmit={(e) => e.preventDefault()}>
                                        <input type="email" placeholder="example@gmail.com" aria-label="Email address" suppressHydrationWarning />
                                        <button type="submit" aria-label="Submit email">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 11L11 1" stroke="#1C1D1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M1 1H11V11" stroke="#1C1D1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="td-footer-separator" aria-hidden="true"></div>
                            <div className="td-footer-bottom">
                                <div className="row align-items-center">
                                    <div className="col-lg-6 col-md-8">
                                        <div className="td-footer-copyright mb-20">
                                            <p>© 2025 <Link href="/">Inoma Digital.</Link> All Rights Reserved.</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-4">
                                        <div className="td-footer-social text-md-end mb-20">
                                            <Link href="https://www.facebook.com/inomadigital" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                                                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17 8.5C17 3.80558 13.1944 0 8.5 0C3.80558 0 0 3.80558 0 8.5C0 12.7426 3.10833 16.2591 7.17188 16.8967V10.957H5.01367V8.5H7.17188V6.62734C7.17188 4.49703 8.44087 3.32031 10.3825 3.32031C11.3124 3.32031 12.2852 3.48633 12.2852 3.48633V5.57813H11.2133C10.1574 5.57813 9.82812 6.23334 9.82812 6.90554V8.5H12.1855L11.8087 10.957H9.82812V16.8967C13.8917 16.2591 17 12.7426 17 8.5Z" fill="currentColor" />
                                                </svg>
                                            </Link>
                                            <Link href="https://www.instagram.com/inomadigital/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11.5 1H4.5C2.567 1 1 2.567 1 4.5V11.5C1 13.433 2.567 15 4.5 15H11.5C13.433 15 15 13.433 15 11.5V4.5C15 2.567 13.433 1 11.5 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M10.7963 7.55921C10.8827 8.14178 10.7832 8.73676 10.5119 9.25952C10.2407 9.78228 9.81148 10.2062 9.28542 10.471C8.75935 10.7358 8.16319 10.8279 7.58173 10.7344C7.00027 10.6408 6.46311 10.3663 6.04667 9.94982C5.63022 9.53338 5.35569 8.99622 5.26213 8.41476C5.16856 7.8333 5.26073 7.23714 5.52551 6.71107C5.79029 6.18501 6.21421 5.75583 6.73697 5.48458C7.25973 5.21333 7.85471 5.11382 8.43728 5.20021C9.03152 5.28833 9.58167 5.56524 10.0065 5.99003C10.4313 6.41482 10.7082 6.96496 10.7963 7.55921Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M11.8477 4.15039H11.8577" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </Link>
                                            <Link href="https://www.linkedin.com/company/inoma-digital" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10.2579 4.7373C11.5141 4.7373 12.7188 5.23632 13.6071 6.12458C14.4954 7.01283 14.9944 8.21757 14.9944 9.47375V14.9996H11.8367V9.47375C11.8367 9.05502 11.6704 8.65344 11.3743 8.35736C11.0782 8.06127 10.6767 7.89493 10.2579 7.89493C9.8392 7.89493 9.43762 8.06127 9.14154 8.35736C8.84545 8.65344 8.67911 9.05502 8.67911 9.47375V14.9996H5.52148V9.47375C5.52148 8.21757 6.0205 7.01283 6.90876 6.12458C7.79701 5.23632 9.00174 4.7373 10.2579 4.7373Z" fill="currentColor" />
                                                    <path d="M3.15763 5.52734H0V15.0002H3.15763V5.52734Z" fill="currentColor" />
                                                    <path d="M1.57881 3.15763C2.45077 3.15763 3.15763 2.45077 3.15763 1.57881C3.15763 0.706859 2.45077 0 1.57881 0C0.706859 0 0 0.706859 0 1.57881C0 2.45077 0.706859 3.15763 1.57881 3.15763Z" fill="currentColor" />
                                                </svg>
                                            </Link>
                                            <Link href="https://www.behance.net/inoma" aria-label="Behance" target="_blank" rel="noopener noreferrer">
                                                <svg width="16" height="16" viewBox="0 0 576 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M232 237.2c31.8-15.2 48.4-38.2 48.4-74 0-70.6-52.6-87.8-113.3-87.8H0v354.4h171.8c64.4 0 124.9-30.9 124.9-102.9 0-44.5-21.1-77.4-64.7-89.7zM77.9 135.9H151c28.1 0 53.4 7.9 53.4 40.5 0 30.1-19.7 42.2-47.5 42.2h-79v-82.7zm83.3 233.7H77.9V277h84.8c34.3 0 56 14.3 56 50.6 0 35.8-25.9 42-57.5 42zm358.5-240.7H376V94h143.7v34.9zM576 305.2c0-75.9-44.4-139.2-124.9-139.2-78.2 0-131.3 58.8-131.3 135.8 0 79.9 50.3 134.7 131.3 134.7 61.3 0 101-27.6 120.1-86.3H509c-6.7 21.9-34.3 33.5-55.7 33.5-41.3 0-63-24.2-63-65.3h185.1c.3-4.2.6-8.7.6-13.2zM390.4 274c2.3-33.7 24.7-54.8 58.5-54.8 35.4 0 53.2 20.8 56.2 54.8H390.4z" fill="currentColor" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default FooterSix;
