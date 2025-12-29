"use client";
import NavMenu from "./headers/Menu/NavMenu";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Offcanvas from "./headers/Menu/Offcanvas";
import UseSticky from "@/hooks/UseSticky";

const InnerHeader = () => {

    const { sticky } = UseSticky();
    const [offCanvas, setOffCanvas] = useState<boolean>(false);
    const headerRef = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState<number>(0);

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    }, []);

    return (
        <>
            <header>
                {sticky && headerHeight > 0 && <div style={{ height: `${headerHeight}px` }} aria-hidden="true" />}
                <div ref={headerRef} id="header-sticky" className={`td-header__area td-header-spacing td-header-5-wrapper td-header-about-wrapper ${sticky ? "header-sticky" : "p-relative"} z-index-1`}>
                    <div className="container-fluid container-1710">
                        <div className="row align-items-center">
                            <div className="col-xxl-2 col-xl-2 col-4">
                                <div className="logo">
                                    <Link className="logo-1" href="/"><img data-width="96" src="/assets/img/logo/inoma-logo-light.png" alt="Inoma Digital" /></Link>
                                </div>
                            </div>
                            <div className="col-xxl-8 col-xl-7 d-none d-xl-block">
                                <div className="tdmenu__wrap tdmenu-2-wrap text-center">
                                    <nav className="tdmenu__nav">
                                        <div className="tdmenu__navbar-wrap tdmenu__main-menu">
                                            <NavMenu />
                                        </div>
                                    </nav>
                                </div>
                            </div>
                            <div className="col-xxl-2 col-xl-3 col-8">
                                <div className="td-header-right text-end">
                                    <Link className="td-btn-12" href="/contact">Let&apos;s Talk</Link>
                                    <div className="d-inline-block ml-10">
                                        <div
                                            className="tdmenu-offcanvas-open-btn mobile-nav-toggler d-xl-none"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => setOffCanvas(true)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") setOffCanvas(true);
                                            }}
                                        >
                                            <div className="tdmenu-offcanvas-open-bar d-inline-block">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <Offcanvas offCanvas={offCanvas} setOffCanvas={setOffCanvas} />
        </>
    )
}

export default InnerHeader;
