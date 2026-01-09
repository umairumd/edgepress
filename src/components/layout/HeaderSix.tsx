"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import NavMenu from "./headers/Menu/NavMenu";
import Offcanvas from "./headers/Menu/Offcanvas";
import UseSticky from "@/hooks/UseSticky";
import logoDark from "../../../extras/inoma-logo.png";
import logoLight from "../../../extras/inoma-logo-for-dark.png";

type HeaderSixProps = {
    /** Home keeps dark-at-top + white-when-sticky; Default uses Home-sticky styling on all non-home pages. */
    variant?: "home" | "default";
};

const HeaderSix = ({ variant = "home" }: HeaderSixProps) => {

    const { sticky, hidden } = UseSticky();
    const [offCanvas, setOffCanvas] = useState<boolean>(false);
    const headerRef = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState<number>(0);
    // Track previous sticky state to detect mounting
    const prevStickyRef = useRef<boolean>(false);
    const [mounting, setMounting] = useState<boolean>(false);

    // When sticky first becomes true, disable transitions briefly to prevent flicker
    useEffect(() => {
        if (sticky && !prevStickyRef.current) {
            // Just became sticky - disable transitions for a longer duration
            setMounting(true);
            // Use setTimeout (50ms) instead of double RAF for more reliable timing
            const timer = setTimeout(() => {
                setMounting(false);
            }, 50);
            return () => clearTimeout(timer);
        }
        prevStickyRef.current = sticky;
    }, [sticky]);

    useEffect(() => {
        const el = headerRef.current;
        if (!el) return;

        const measure = () => {
            setHeaderHeight(el.offsetHeight);
        };
        measure();

        // Keep spacer accurate across breakpoints + sticky state (reduces mobile drift/jank).
        const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
        ro?.observe(el);
        window.addEventListener("resize", measure, { passive: true } as AddEventListenerOptions);
        return () => {
            ro?.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, []);

    const wrapperClassName = useMemo(() => {
        // IMPORTANT: avoid template `.header-sticky` class entirely to prevent flashes
        // from `public/assets/css/main.css` (it forces white bg + animation).
        // Strategy: td-sticky is hidden by default; only add td-sticky-show to reveal.
        // td-sticky-mounting disables transitions during initial mount to prevent flicker.
        const base = [
            "td-header__area",
            "td-header-sticky-white",
            "td-header-spacing",
            "td-header-6-wrapper",
            variant === "default" ? "td-header-default" : null,
            sticky ? "td-sticky" : "p-relative",
            sticky && mounting ? "td-sticky-mounting" : null,
            sticky && !hidden && !mounting ? "td-sticky-show" : null,
            "z-index-1",
        ]
            .filter(Boolean)
            .join(" ");
        return base;
    }, [sticky, hidden, variant, mounting]);

    return (
        <>
            <header>
                {/* Spacer: needed for in-flow headers (inner pages) so content doesn't jump when header becomes fixed.
                    Home header overlays the hero already, so adding a spacer there creates a visible "jerk". */}
                <div
                    style={{
                        height:
                            variant !== "home" && sticky && headerHeight > 0
                                ? `${headerHeight}px`
                                : 0,
                    }}
                    aria-hidden="true"
                />
                <div ref={headerRef} id="header-sticky" className={wrapperClassName}>
                    <div className="container-fluid container-1710">
                        <div className="row align-items-center">
                            <div className="col-xxl-2 col-xl-2 col-4">
                                <div className="logo">
                                    <Link className="logo-1" href="/">
                                        {/* logo-1 = shown on non-sticky (dark header on Home) */}
                                        <img
                                            src={logoLight.src}
                                            alt="Inoma Digital"
                                            width={logoLight.width}
                                            height={logoLight.height}
                                            loading="eager"
                                            decoding="async"
                                        />
                                    </Link>
                                    <Link className="logo-2 d-none" href="/">
                                        {/* logo-2 = shown on sticky/white header */}
                                        <img
                                            src={logoDark.src}
                                            alt="Inoma Digital"
                                            width={logoDark.width}
                                            height={logoDark.height}
                                            loading="eager"
                                            decoding="async"
                                        />
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
                                            aria-label="Open menu"
                                            aria-controls="tdmobile-menu"
                                            aria-expanded={offCanvas}
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
