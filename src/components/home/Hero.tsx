"use client";
import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Link from "next/link";
import type { Swiper as SwiperType } from "swiper";
import heroBg from "../../../extras/bg.jpg";

const banner_slider: string[] = [
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

const Hero = () => {
    const swiperRef = useRef<SwiperType | null>(null);
    const rafUpdateRef = useRef<number | null>(null);
    const dimsFor = (src: string) => {
        // Use real asset dimensions to avoid CLS.
        if (src.endsWith("/thumb.jpg")) return { w: 304, h: 390 };
        return { w: 196, h: 260 };
    };

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

    // Swiper loop with slidesPerView:'auto' needs enough physical slides to stay stable on wide screens.
    const banner_slider_loop = useMemo(() => {
        const minSlides = 24;
        const out: string[] = [];
        while (out.length < minSlides) out.push(...banner_slider);
        return out;
    }, []);

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
        slidesPerView: 'auto' as const,
        spaceBetween: 30,
        centeredSlides: false,
        allowTouchMove: false,
        speed: 30000,
        watchSlidesProgress: true,
        observer: true,
        observeParents: true,
        resizeObserver: true,
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
            waitForTransition: false,
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
                            {banner_slider_loop.map((thumb, i) => (
                                <SwiperSlide key={i} className="swiper-slide">
                                    <div className="td-hero-6-thumb">
                                        <picture>
                                            <source srcSet={thumb.replace(/\.jpg$/i, ".webp")} type="image/webp" />
                                            <img
                                                src={thumb}
                                                alt=""
                                                width={dimsFor(thumb).w}
                                                height={dimsFor(thumb).h}
                                                loading={i === 0 ? "eager" : "lazy"}
                                                fetchPriority={i === 0 ? "high" : "auto"}
                                                decoding="async"
                                            />
                                        </picture>
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
