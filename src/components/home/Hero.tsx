"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Link from "next/link";
import type { Swiper as SwiperType } from "swiper";

// Hero background from public folder (preloaded in layout.tsx for faster LCP)
const HERO_BG_SRC = "/assets/img/hero/hero-bg.jpg";

// Fallback static images if no WordPress data
const FALLBACK_SLIDES: string[] = [
    "/assets/img/hero/hero-6/thumb.jpg",
    "/assets/img/hero/hero-6/thumb-2.jpg",
    "/assets/img/hero/hero-6/thumb-3.jpg",
    "/assets/img/hero/hero-6/thumb-4.jpg",
    "/assets/img/hero/hero-6/thumb-5.jpg",
    "/assets/img/hero/hero-6/thumb-6.jpg",
    "/assets/img/hero/hero-6/thumb-7.jpg",
    "/assets/img/hero/hero-6/thumb-4.jpg",
    "/assets/img/hero/hero-6/thumb-5.jpg",
];

// Display dimensions for slides (4:5 ratio)
const SLIDE_WIDTH = 208;
const SLIDE_HEIGHT = 260;

type WPImage = {
    url: string;
    alt?: string | null;
    width?: number | null;
    height?: number | null;
};

interface HeroProps {
    slides?: WPImage[];
}

const Hero = ({ slides }: HeroProps) => {
    const swiperRef = useRef<SwiperType | null>(null);
    const rafUpdateRef = useRef<number | null>(null);
    // Defer Swiper rendering until after LCP (hero background) has painted
    const [swiperReady, setSwiperReady] = useState(false);

    const scheduleSwiperUpdate = () => {
        if (typeof window === "undefined") return;
        if (rafUpdateRef.current != null) return;
        rafUpdateRef.current = window.requestAnimationFrame(() => {
            rafUpdateRef.current = null;
            const s = swiperRef.current;
            if (!s || s.destroyed) return;
            try {
                s.update();
                if (s.params.loop) (s as unknown as { loopFix?: () => void }).loopFix?.();
            } catch {
                // ignore
            }
        });
    };

    // Build slide data: use WordPress images if available, else fallback to static
    const slideData = useMemo(() => {
        if (slides && slides.length >= 8) {
            // Use WordPress images
            return slides.map((img) => ({
                src: img.url,
                alt: img.alt || "",
                isRemote: true,
            }));
        }
        // Fallback to static images
        return FALLBACK_SLIDES.map((src) => ({
            src,
            alt: "",
            isRemote: false,
        }));
    }, [slides]);

    // Swiper loop needs ~2x visible slides for smooth looping.
    // With 208px slides + 30px gap, ~8-11 are visible on desktop.
    // Use 16 slides (2x visible) - balance between smooth loop and DOM size.
    const slidesLoop = useMemo(() => {
        const minSlides = 16;
        const out: typeof slideData = [];
        while (out.length < minSlides) out.push(...slideData);
        return out;
    }, [slideData]);

    useEffect(() => {
        // Defer Swiper initialization until after first paint + idle time
        // This ensures the hero background image (LCP) renders first
        const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
        let id: number | ReturnType<typeof setTimeout>;
        
        if (typeof ric === "function") {
            id = ric(() => setSwiperReady(true), { timeout: 200 });
        } else {
            id = setTimeout(() => setSwiperReady(true), 100);
        }
        
        return () => {
            if (typeof ric === "function") {
                (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id as number);
            } else {
                clearTimeout(id as ReturnType<typeof setTimeout>);
            }
            if (rafUpdateRef.current != null) cancelAnimationFrame(rafUpdateRef.current);
            rafUpdateRef.current = null;
        };
    }, []);

    const setting = {
        loop: true,
        loopAdditionalSlides: 4,
        slidesPerView: 'auto' as const,
        spaceBetween: 30,
        centeredSlides: false,
        allowTouchMove: false,
        speed: 18000,
        watchSlidesProgress: true,
        observer: true,
        observeParents: true,
        resizeObserver: true,
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
            waitForTransition: true,
            stopOnLastSlide: false,
            reverseDirection: false,
        },
        onInit: (swiper: SwiperType) => {
            swiperRef.current = swiper;
            try {
                swiper.wrapperEl.classList.add("slide-transition");
                scheduleSwiperUpdate();
            } catch {
                // ignore
            }
        },
        onResize: () => {
            scheduleSwiperUpdate();
        },
        onImagesReady: () => {
            scheduleSwiperUpdate();
        },
        onSlideChangeTransitionEnd: (swiper: SwiperType) => {
            if (swiper.autoplay && !swiper.autoplay.running) {
                swiper.autoplay.start();
            }
        },
    };

    return (
        <div className="td-hero-area td-hero-6-spacing p-relative">
            {/* LCP background image: preloaded in layout.tsx, uses native img for fastest paint */}
            <img
                className="td-hero-6-bg-img"
                src={HERO_BG_SRC}
                alt=""
                fetchPriority="high"
                decoding="async"
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            />
            <div className="container">
                <div className="td-hero-6-top pb-45 p-relative z-index-1">
                    <div className="td-hero-6-line">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="td-hero-6-title-wrap text-center pb-90">
                                <div style={{ display: "inline-block", textAlign: "left" }}>
                                    <h2 className="td-hero-6-title" style={{ marginBottom: "15px" }}>
                                        <span>INOMA</span>
                                        <br />
                                        <span className="d-inline-block">
                                            DIGITAL
                                        </span>
                                    </h2>
                                    <p style={{
                                        margin: 0,
                                        fontFamily: "var(--td-ff-dm)",
                                        fontStyle: "italic",
                                        fontWeight: 400,
                                        fontSize: "40px",
                                        lineHeight: 1.4,
                                        color: "#b8e9ff"
                                    }}>
                                        Your Strategic Business Partner
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="td-hero-6-tag">
                                <ul>
                                    <li><Link href="/portfolio">Creative</Link></li>
                                    <li><Link href="/portfolio">Social</Link></li>
                                    <li><Link href="/portfolio">Web</Link></li>
                                    <li><Link href="/portfolio">SEO</Link></li>
                                    <li><Link href="/portfolio">Marketing</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid container-1680">
                <div className="row">
                    <div className="col-lg-12">
                        {/* Swiper container with fixed height to prevent layout shift */}
                        <div className="td-hero-6-slider-wrap" style={{ minHeight: SLIDE_HEIGHT, contain: "layout style" }}>
                            {swiperReady && (
                                <Swiper
                                    {...setting}
                                    modules={[Autoplay]}
                                    className="swiper-container td-hero-6-slider"
                                >
                                    {slidesLoop.map((slide, i) => {
                                        // First 2 slides are prioritized for LCP
                                        const isLCPCandidate = i < 2;
                                        return (
                                            <SwiperSlide key={i} className="swiper-slide">
                                                <div className="td-hero-6-thumb">
                                                    {slide.isRemote ? (
                                                        <Image
                                                            src={slide.src}
                                                            alt={slide.alt}
                                                            width={SLIDE_WIDTH}
                                                            height={SLIDE_HEIGHT}
                                                            style={{ objectFit: "cover" }}
                                                            priority={isLCPCandidate}
                                                            loading={isLCPCandidate ? "eager" : "lazy"}
                                                            fetchPriority={isLCPCandidate ? "high" : "auto"}
                                                            sizes={`${SLIDE_WIDTH}px`}
                                                            quality={65}
                                                        />
                                                    ) : (
                                                        <picture>
                                                            <source srcSet={slide.src.replace(/\.jpg$/i, ".webp")} type="image/webp" />
                                                            <img
                                                                src={slide.src}
                                                                alt={slide.alt}
                                                                width={SLIDE_WIDTH}
                                                                height={SLIDE_HEIGHT}
                                                                loading={isLCPCandidate ? "eager" : "lazy"}
                                                                fetchPriority={isLCPCandidate ? "high" : "auto"}
                                                                decoding="async"
                                                                style={{ objectFit: "cover" }}
                                                            />
                                                        </picture>
                                                    )}
                                                </div>
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero;
