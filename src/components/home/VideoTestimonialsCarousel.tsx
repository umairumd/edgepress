"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useVideoPopup } from "@/hooks/useVideoPopup";
import type { TestimonialItem } from "@/lib/wp";

type Props = {
    testimonials: TestimonialItem[];
};

const SLIDE_WIDTH = 360;

const VideoTestimonialsCarousel = ({ testimonials }: Props) => {
    const { openVideo } = useVideoPopup();

    if (!testimonials.length) return null;

    const setting = {
        loop: testimonials.length > 1,
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
        <section className="td-video-testimonials">
            <div className="td-video-testimonials__wrap">
                <Swiper {...setting} modules={[Autoplay]} className="td-video-testimonials__slider">
                    {testimonials.map((item) => {
                        const thumbSrc =
                            item.thumbnailUrl ||
                            `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`;
                        return (
                            <SwiperSlide
                                key={item.id}
                                className="td-video-testimonials__slide"
                                style={{ width: SLIDE_WIDTH }}
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
                                            width={640}
                                            height={360}
                                            sizes={`${SLIDE_WIDTH}px`}
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
