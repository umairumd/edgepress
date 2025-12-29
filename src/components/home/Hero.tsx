"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Link from "next/link";

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

// Ensure enough items for a smooth infinite loop on wide viewports (slidesPerView:'auto')
const MIN_SLIDES = 20;
const banner_slider_loop =
    banner_slider.length < MIN_SLIDES
        ? Array.from({ length: MIN_SLIDES }, (_, i) => banner_slider[i % banner_slider.length])
        : banner_slider;

const setting = {
    loop: true,
    freeMode: false,
    slidesPerView: 'auto' as const,
    spaceBetween: 30,
    centeredSlides: false, // start from the left edge
    allowTouchMove: false,
    speed: 6000,
    loopAdditionalSlides: 10, // helps Swiper keep a stable loop cache
    initialSlide: 0,
    autoplay: {
        delay: 1, // near-continuous scroll
        disableOnInteraction: true,
    },
};

const Hero = () => {
    return (
        <div className="td-hero-area td-hero-6-spacing include-bg" style={{ backgroundImage: `url(/assets/img/hero/hero-6/bg.jpg)` }}>
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
                        <Swiper {...setting} modules={[Autoplay]} onSwiper={(swiper) => {
                            swiper.wrapperEl.classList.add("slide-transition");
                        }} className="swiper-container td-hero-6-slider">
                            {banner_slider_loop.map((thumb, i) => (
                                <SwiperSlide key={i} className="swiper-slide">
                                    <div className="td-hero-6-thumb">
                                        <img
                                            src={thumb}
                                            alt=""
                                            loading={i === 0 ? "eager" : "lazy"}
                                            fetchPriority={i === 0 ? "high" : "auto"}
                                            decoding="async"
                                        />
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
