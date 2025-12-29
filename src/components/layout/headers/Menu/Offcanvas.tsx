"use client";
import Link from "next/link";
import MobileMenu from "./MobileMenu";

interface OffcanvasProps {
    offCanvas: boolean;
    setOffCanvas: (value: boolean) => void;
}

const Offcanvas = ({ offCanvas, setOffCanvas }: OffcanvasProps) => {
    return (
        <div className={offCanvas ? "mobile-menu-visible" : ""}>
            <div className="tdmobile__menu td-menu-large">
                <nav className="tdmobile__menu-box">
                    <div onClick={() => setOffCanvas(false)} className="close-btn">
                        <i className="fa-solid fa-xmark"></i>
                    </div>
                    <div className="nav-logo">
                        <Link href="/"><img data-width="96" src="/assets/img/logo/inoma-logo-light.png" alt="Inoma Digital" /></Link>
                    </div>
                    <div className="tdmobile__search">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <input type="text" placeholder="Search here..." />
                            <button><i className="fas fa-search"></i></button>
                        </form>
                    </div>
                    <div className="tdmobile__menu-outer">
                        <MobileMenu />
                    </div>
                    <div className="mt-30 ml-25 mr-25">
                        <Link href="/contact" className="td-btn td-btn-menu-black w-100 d-inline-block td-btn-switch-animation ml-10">
                            <span className="d-flex align-items-center justify-content-center">
                                <span className="btn-text"> Contact Us </span>
                                <span className="btn-icon"><i className="fa-sharp fa-solid fa-angle-right"></i></span>
                                <span className="btn-icon"><i className="fa-sharp fa-solid fa-angle-right"></i></span>
                            </span>
                        </Link>
                    </div>
                    <div className="social-links">
                        <ul className="list-wrap">
                            <li><Link href="#"><i className="fab fa-facebook-f"></i></Link></li>
                            <li><Link href="#"><i className="fab fa-twitter"></i></Link></li>
                            <li><Link href="#"><i className="fab fa-instagram"></i></Link></li>
                            <li><Link href="#"><i className="fab fa-linkedin-in"></i></Link></li>
                            <li><Link href="#"><i className="fab fa-youtube"></i></Link></li>
                        </ul>
                    </div>
                </nav>
            </div>
            <div onClick={() => setOffCanvas(false)} className="tdmobile__menu-backdrop"></div>
        </div>
    );
};

export default Offcanvas;
