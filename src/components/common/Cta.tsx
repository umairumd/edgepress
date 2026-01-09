"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const Cta = () => {
    const textRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        // Only run on desktop
        if (typeof window === "undefined" || window.innerWidth <= 1024) return;
        if (!textRef.current) return;

        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            if (!textRef.current) return;

            const split = new SplitType(textRef.current, {
                types: "lines",
            });

            (split.lines ?? []).forEach((line) => {
                gsap.to(line, {
                    backgroundPositionX: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: line,
                        scrub: 1,
                        start: "top 85%",
                        end: "bottom center",
                    },
                });
            });

            // Cleanup
            return () => {
                split.revert();
            };
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="td-cta-area">
            <div className="container">
                <div className="col-lg-12">
                    <div className="td-cta-wrap p-relative z-index-1 text-center pt-135 pb-135 include-bg" style={{ backgroundImage: `url("/assets/img/cta/cta-bg.jpg")` }}>
                        <img className="td-cta-shape d-none d-xl-block" src="/assets/img/cta/cta.png" alt="Decorative shape" aria-hidden="true" />
                        <h2 className="title p-relative d-inline-block">
                            <img className="td-cta-shape-2 d-none d-md-block" src="/assets/img/cta/cta-2.png" alt="Decorative accent" aria-hidden="true" />
                            <Link ref={textRef} href="/contact" className="td-text-invert">
                                HAVE<br />
                                PROJECTS<br />
                                IN MIND?
                            </Link>
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cta;
