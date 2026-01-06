"use client";
import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Link from "next/link";
import type { Swiper as SwiperType } from "swiper";
import heroBg from "../../../extras/bg.jpg";

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
    // With 208px slides + 30px gap on 1920px screen, ~8 are visible.
    // Use 20 slides (2.5x visible) - balance between smooth loop and fast LCP.
    const slidesLoop = useMemo(() => {
        const minSlides = 20;
        const out: typeof slideData = [];
        while (out.length < minSlides) out.push(...slideData);
        return out;
    }, [slideData]);

    useEffect(() => {
        // One post-mount tick helps Swiper measure after first paint, but avoid repeated forced reflows.
        scheduleSwiperUpdate();
        return () => {
            if (rafUpdateRef.current != null) cancelAnimationFrame(rafUpdateRef.current);
            rafUpdateRef.current = null;
        };
    }, []);

    const setting = {
        loop: true,
        loopAdditionalSlides: 4, // Small buffer for seamless loop
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
            waitForTransition: true, // Wait for transition to complete before next slide
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
        // Ensure autoplay restarts after loop fix
        onSlideChangeTransitionEnd: (swiper: SwiperType) => {
            if (swiper.autoplay && !swiper.autoplay.running) {
                swiper.autoplay.start();
            }
        },
    };

    return (
        <div className="td-hero-area td-hero-6-spacing p-relative">
            {/* LCP background image: keep it discoverable in HTML + high priority (instead of CSS background-image). */}
            <Image
                className="td-hero-6-bg-img"
                src={heroBg}
                alt=""
                fill
                priority
                fetchPriority="high"
                sizes="100vw"
                style={{ objectFit: "cover" }}
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
                        <Swiper
                            {...setting}
                            modules={[Autoplay]}
                            className="swiper-container td-hero-6-slider"
                        >
                            {slidesLoop.map((slide, i) => (
                                <SwiperSlide key={i} className="swiper-slide">
                                    <div className="td-hero-6-thumb">
                                        {slide.isRemote ? (
                                            // WordPress images: use next/image for optimization
                                            <Image
                                                src={slide.src}
                                                alt={slide.alt}
                                                width={SLIDE_WIDTH}
                                                height={SLIDE_HEIGHT}
                                                style={{ objectFit: "cover" }}
                                                priority={i < 2}
                                                loading={i < 2 ? "eager" : "lazy"}
                                                fetchPriority={i < 2 ? "high" : "low"}
                                                sizes={`${SLIDE_WIDTH}px`}
                                                quality={65}
                                            />
                                        ) : (
                                            // Static fallback images
                                            <picture>
                                                <source srcSet={slide.src.replace(/\.jpg$/i, ".webp")} type="image/webp" />
                                                <img
                                                    src={slide.src}
                                                    alt={slide.alt}
                                                    width={SLIDE_WIDTH}
                                                    height={SLIDE_HEIGHT}
                                                    loading={i < 2 ? "eager" : "lazy"}
                                                    fetchPriority={i < 2 ? "high" : "auto"}
                                                    decoding="async"
                                                    style={{ objectFit: "cover" }}
                                                />
                                            </picture>
                                        )}
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero;
