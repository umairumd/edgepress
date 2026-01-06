"use client";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import logoLight from "../../../../../extras/inoma-logo-for-dark.png";
import {
    IconXmark,
    IconSearch,
    IconAngleRight,
    IconFacebookF,
    IconTwitter,
    IconInstagram,
    IconLinkedinIn,
    IconYoutube
} from "@/components/icons";

interface OffcanvasProps {
    offCanvas: boolean;
    setOffCanvas: (value: boolean) => void;
}

const Offcanvas = ({ offCanvas, setOffCanvas }: OffcanvasProps) => {
    return (
        <div className={offCanvas ? "mobile-menu-visible" : ""}>
            <div className="tdmobile__menu td-menu-large">
                <nav id="tdmobile-menu" className="tdmobile__menu-box" aria-label="Mobile navigation">
                    <button type="button" onClick={() => setOffCanvas(false)} className="close-btn" aria-label="Close menu">
                        <IconXmark aria-hidden="true" />
                    </button>
                    <div className="nav-logo">
                        <Link href="/">
                            <img
                                src={logoLight.src}
                                alt="Inoma Digital"
                                width={logoLight.width}
                                height={logoLight.height}
                                loading="eager"
                                decoding="async"
                            />
                        </Link>
                    </div>
                    <div className="tdmobile__search">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <input type="text" placeholder="Search here..." aria-label="Search" />
                            <button type="submit" aria-label="Search">
                                <IconSearch aria-hidden="true" />
                            </button>
                        </form>
                    </div>
                    <div className="tdmobile__menu-outer">
                        <MobileMenu />
                    </div>
                    <div className="mt-30 ml-25 mr-25">
                        <Link href="/contact" className="td-btn td-btn-menu-black w-100 d-inline-block td-btn-switch-animation ml-10">
                            <span className="d-flex align-items-center justify-content-center">
                                <span className="btn-text"> Contact Us </span>
                                <span className="btn-icon"><IconAngleRight /></span>
                                <span className="btn-icon"><IconAngleRight /></span>
                            </span>
                        </Link>
                    </div>
                    <div className="social-links">
                        <ul className="list-wrap">
                            <li><Link href="#" aria-label="Facebook"><IconFacebookF aria-hidden="true" /></Link></li>
                            <li><Link href="#" aria-label="Twitter"><IconTwitter aria-hidden="true" /></Link></li>
                            <li><Link href="#" aria-label="Instagram"><IconInstagram aria-hidden="true" /></Link></li>
                            <li><Link href="#" aria-label="LinkedIn"><IconLinkedinIn aria-hidden="true" /></Link></li>
                            <li><Link href="#" aria-label="YouTube"><IconYoutube aria-hidden="true" /></Link></li>
                        </ul>
                    </div>
                </nav>
            </div>
            <div onClick={() => setOffCanvas(false)} className="tdmobile__menu-backdrop"></div>
        </div>
    );
};

export default Offcanvas;
