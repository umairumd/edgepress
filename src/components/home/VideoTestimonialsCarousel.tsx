"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useVideoPopup } from "@/hooks/useVideoPopup";
import type { TestimonialItem } from "@/lib/wp";

type Props = {
    testimonials: TestimonialItem[];
};

const VideoTestimonialsCarousel = ({ testimonials }: Props) => {
    const { openVideo } = useVideoPopup();

    if (!testimonials.length) return null;

    const slides =
        testimonials.length < 5
            ? Array.from({ length: Math.ceil(5 / testimonials.length) })
                  .flatMap(() => testimonials)
                  .slice(0, testimonials.length * Math.ceil(5 / testimonials.length))
            : testimonials;

    const setting = {
        loop: true,
        slidesPerView: "auto" as const,
        spaceBetween: 24,
        speed: 4000,
        allowTouchMove: true,
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
        },
    };

    return (
        <section className="td-video-testimonials pt-80 pb-60">
            <div className="td-video-testimonials__wrap">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xxl-8 col-xl-9 col-lg-10">
                            <div className="text-center mb-65">
                                <span className="td-section-6-subtitle d-inline-block mb-15">WHAT OUR CLIENTS SAY</span>
                                <h2 className="td-section-6-bigtitle td-text-opacity">SUCCESS STORIES</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <Swiper {...setting} modules={[Autoplay]} className="td-video-testimonials__slider">
                    {slides.map((item, idx) => {
                        const thumbSrc =
                            item.thumbnailUrl ||
                            `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`;
                        return (
                            <SwiperSlide
                                key={`${item.id}-${idx}`}
                                className="td-video-testimonials__slide"
                            >
                                <button
                                    type="button"
                                    className="td-video-testimonials__card"
                                    onClick={() => openVideo(item.youtubeId)}
                                    aria-label={`Play video testimonial from ${item.title}`}
                                >
                                    <span className="td-video-testimonials__thumb">
                                        <Image
                                            src={thumbSrc}
                                            alt=""
                                            width={220}
                                            height={391}
                                            sizes="(max-width: 767px) 160px, (max-width: 1199px) 180px, 220px"
                                            unoptimized={
                                                process.env.NODE_ENV !== "production" &&
                                                thumbSrc.startsWith("http")
                                            }
                                        />
                                        <span className="td-video-testimonials__play" aria-hidden="true">
                                            <svg width="24" height="28" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 12L0.5 23.2583V0.74167L20 12Z" fill="currentColor" />
                                            </svg>
                                        </span>
                                    </span>
                                    <span className="td-video-testimonials__name">{item.title}</span>
                                </button>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </section>
    );
};

export default VideoTestimonialsCarousel;
