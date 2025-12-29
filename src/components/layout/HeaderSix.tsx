"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import NavMenu from "./headers/Menu/NavMenu";
import Offcanvas from "./headers/Menu/Offcanvas";
import UseSticky from "@/hooks/UseSticky";

type HeaderSixProps = {
    /** Home keeps dark-at-top + white-when-sticky; Default uses Home-sticky styling on all non-home pages. */
    variant?: "home" | "default";
};

const HeaderSix = ({ variant = "home" }: HeaderSixProps) => {

    const { sticky } = UseSticky();
    const [offCanvas, setOffCanvas] = useState<boolean>(false);
    const headerRef = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState<number>(0);

    useEffect(() => {
        const el = headerRef.current;
        if (!el) return;

        const measure = () => setHeaderHeight(el.offsetHeight);
        measure();

        // Keep spacer accurate across breakpoints + sticky state (reduces mobile drift/jank).
        const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
        ro?.observe(el);
        window.addEventListener("resize", measure, { passive: true } as AddEventListenerOptions);
        return () => {
            ro?.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, [sticky]);

    const wrapperClassName = useMemo(() => {
        const base = [
            "td-header__area",
            "td-header-sticky-white",
            "td-header-spacing",
            "td-header-6-wrapper",
            variant === "default" ? "td-header-default" : null,
            sticky ? "header-sticky" : "p-relative",
            "z-index-1",
        ]
            .filter(Boolean)
            .join(" ");
        return base;
    }, [sticky, variant]);

    return (
        <>
            <header>
                {/* Spacer prevents layout jump when header becomes fixed; keep it stable for better mobile behavior. */}
                <div style={{ height: sticky && headerHeight > 0 ? `${headerHeight}px` : 0 }} aria-hidden="true" />
                <div ref={headerRef} id="header-sticky" className={wrapperClassName}>
                    <div className="container-fluid container-1710">
                        <div className="row align-items-center">
                            <div className="col-xxl-2 col-xl-2 col-4">
                                <div className="logo">
                                    <Link className="logo-1" href="/">
                                        {/* logo-1 = shown on non-sticky (dark header on Home) */}
                                        <img data-width="96" src="/assets/img/logo/inoma-logo-dark.png" alt="Inoma Digital" decoding="async" />
                                    </Link>
                                    <Link className="logo-2 d-none" href="/">
                                        {/* logo-2 = shown on sticky/white header */}
                                        <img data-width="96" src="/assets/img/logo/inoma-logo-light.png" alt="Inoma Digital" decoding="async" />
                                    </Link>
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

export default HeaderSix;
