"use client";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import {
    IconXmark,
    IconAngleRight,
    IconFacebookF,
    IconInstagram,
    IconLinkedinIn,
    IconBehance
} from "@/components/icons";

// Use tracked public assets (do not depend on gitignored `extras/`).
const LOGO_ON_LIGHT_BG_SRC = "/assets/img/logo/inoma-logo-dark.png";

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
                                src={LOGO_ON_LIGHT_BG_SRC}
                                alt="Inoma Digital"
                                width={180}
                                height={40}
                                loading="eager"
                                decoding="async"
                            />
                        </Link>
                    </div>
                    <div className="tdmobile__menu-outer">
                        <MobileMenu onNavigate={() => setOffCanvas(false)} />
                    </div>
                    <div className="mt-30 ml-25 mr-25">
                        <Link href="/contact" onClick={() => setOffCanvas(false)} className="td-btn td-btn-menu-black w-100 d-inline-block td-btn-switch-animation ml-10">
                            <span className="d-flex align-items-center justify-content-center">
                                <span className="btn-text"> Contact Us </span>
                                <span className="btn-icon"><IconAngleRight /></span>
                                <span className="btn-icon"><IconAngleRight /></span>
                            </span>
                        </Link>
                    </div>
                    <div className="social-links">
                        <ul className="list-wrap">
                            <li><Link href="https://www.facebook.com/inomadigital" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><IconFacebookF aria-hidden="true" /></Link></li>
                            <li><Link href="https://www.instagram.com/inomadigital/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><IconInstagram aria-hidden="true" /></Link></li>
                            <li><Link href="https://www.linkedin.com/company/inoma-digital" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><IconLinkedinIn aria-hidden="true" /></Link></li>
                            <li><Link href="https://www.behance.net/inoma" target="_blank" rel="noopener noreferrer" aria-label="Behance"><IconBehance aria-hidden="true" /></Link></li>
                        </ul>
                    </div>
                </nav>
            </div>
            <div onClick={() => setOffCanvas(false)} className="tdmobile__menu-backdrop"></div>
        </div>
    );
};

export default Offcanvas;
