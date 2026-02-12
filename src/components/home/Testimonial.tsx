"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperClass } from "swiper";
import Link from 'next/link';
import { useState } from 'react';
import Image from "next/image";
import type { Testimonial as TestimonialType } from "@/lib/wp";

const avatar_data: string[] = [
    "/assets/img/testimonial/tes-6/01.png",
    "/assets/img/testimonial/tes-6/02.png",
    "/assets/img/testimonial/tes-6/03.png",
];
// Same logos as Service page Brand (excl. logo-6 per request)
const brand_data: string[] = [
    "/assets/img/brand/brand-7/logo-1.png",
    "/assets/img/brand/brand-7/logo-2.png",
    "/assets/img/brand/brand-7/logo-3.png",
    "/assets/img/brand/brand-7/logo-4.png",
    "/assets/img/brand/brand-7/logo-5.png",
    "/assets/img/brand/brand-7/logo-7.png",
    "/assets/img/brand/brand-7/logo-8.png",
];

// Ensure enough items for Swiper loop with slidesPerView:'auto' on wide screens (avoids console warnings)
const brand_slider = [...brand_data, ...brand_data, ...brand_data];

// Team page proportions (120, 155, 200) scaled up ~1.25x for home
const logoHeightFor = (index: number) => {
    if (index <= 3) return 150;   // logos 1-4
    if (index <= 5) return 250;   // logos 5, 7
    return 194;                   // logo 8
};

interface DataType {
    id: number;
    name: string;
    designation: string;
    desc: string
}

// Fallback static data if WordPress returns empty
const fallback_data: DataType[] = [
    {
        id: 1,
        name: "Jonathon Marry",
        designation: "Developer",
        desc: "Some definitions of marketing highlight marketing's ability to produce value of the firm as well. In this context, marketing can be defined as the that seeks to maximize returns to shareholders"
    },
    {
        id: 2,
        name: "Jessica Doe",
        designation: "Product Manager",
        desc: "Excellent interface design and user experience. The team really understood our needs and delivered a product that exceeds our expectations. Highly recommended for any serious web project."
    },
    {
        id: 3,
        name: "Michael Smith",
        designation: "Designer",
        desc: "The collaboration was seamless and the results speak for themselves. Their attention to detail and commitment to quality is what sets them apart from other agencies."
    },
];

interface TestimonialProps {
    testimonials?: TestimonialType[];
}

const setting = {
    spaceBetween: 0,
    slidesPerView: 1,
    loop: false,
    allowTouchMove: true,
    autoplay: {
        delay: 6000,
    },
};

const setting2 = {
    spaceBetween: 0,
    slidesPerView: 3,
    loop: false,
    allowTouchMove: false,
    slideToClickedSlide: true,
};

const setting3 = {
    loop: true,
    freeMode: true,
    slidesPerView: 'auto' as const,
    spaceBetween: 20, // mobile
    centeredSlides: true,
    allowTouchMove: false,
    speed: 6000,
    autoplay: {
        delay: 1,
        disableOnInteraction: true,
        reverseDirection: true, // crawl right to left
    },
    breakpoints: {
        768: { spaceBetween: 48 }, // desktop
    },
};

const Testimonial = ({ testimonials }: TestimonialProps) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

    // Map WordPress testimonials to component format, or use fallback
    const testi_data: DataType[] = testimonials && testimonials.length > 0
        ? testimonials.map((t) => ({
            id: t.id,
            name: t.name,
            designation: t.designation || "",
            desc: t.text,
        }))
        : fallback_data;

    return (
        <div className="td-testimonial-area td-testimonial-6-bg pt-155">
            <div className="container">
                <div className="row align-items-end">
                    <div className="col-lg-8">
                        <div className="td-testimonial-6-wrap">
                            <div className="td-testimonial-6-title-wrap mb-55">
                                <span className="td-section-6-subtitle d-inline-block mb-15">TESTIMONIALS</span>
                                <h2 className="title">CLIENTS FEEDBACK</h2>
                            </div>
                            <Swiper {...setting} modules={[Autoplay, Thumbs]} thumbs={{ swiper: thumbsSwiper }} className="swiper-container td-testimonial-6-content-active">
                                {testi_data.map((item) => (
                                    <SwiperSlide key={item.id} className="swiper-slide">
                                        <div className="td-testimonial-6-text">
                                            <p className="mb-40">{item.desc}</p>
                                            <div className="td-testimonial-6-author">
                                                <span className="position">{item.designation}</span>
                                                <p className="name">{item.name}</p>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="td-testimonial-6-slider">
                            <Swiper
                                {...setting2}
                                modules={[Autoplay, Thumbs]}
                                onSwiper={setThumbsSwiper}
                                style={{ width: "110px" }}
                                className="swiper-container td-testimonial-6-thumb-active"
                            >
                                {avatar_data.map((avatar, i) => (
                                    <SwiperSlide key={i} className="swiper-slide">
                                        <div className="td-testimonial-bottom-thumb">
                                            <Image src={avatar} alt="Client avatar" width={60} height={60} sizes="60px" />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-24 pb-24 td-testimonial-brands-wrap">
                <div className="container-fluid container-1650">
                    <div className="row">
                        <div className="col-12">
                            <Swiper {...setting3} modules={[Autoplay]} onSwiper={(swiper) => {
                                swiper.wrapperEl.classList.add("slide-transition");
                            }} className="swiper-container td-testimonial-6-brands-slider">
                                {brand_slider.map((brand, i) => {
                                    const origIdx = i % brand_data.length;
                                    const h = logoHeightFor(origIdx);
                                    return (
                                        <SwiperSlide key={i} className="swiper-slide">
                                            <div className="brands-logo" data-h={h}>
                                                <Link href="/portfolio" aria-label="View portfolio">
                                                    <Image
                                                        src={brand}
                                                        alt="Partner brand logo"
                                                        width={250}
                                                        height={h}
                                                        sizes="(max-width: 768px) 150px, 250px"
                                                        style={{ width: "auto", height: h }}
                                                    />
                                                </Link>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Testimonial;
