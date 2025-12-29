"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Thumbs } from 'swiper/modules';
import Link from 'next/link';
import { useState } from 'react';

// ... (keep data arrays as is, they are outside the replacement block if I target correctly)
// Wait, I can't leave comments in replacement content if I'm replacing the whole file or large block.
// Better to target specific blocks.

const avatar_data: string[] = [
    "/assets/img/testimonial/tes-6/01.png",
    "/assets/img/testimonial/tes-6/02.png",
    "/assets/img/testimonial/tes-6/03.png",
];
const brand_data: string[] = [
    "/assets/img/brand/brands-6/logo.png",
    "/assets/img/brand/brands-6/logo-2.png",
    "/assets/img/brand/brands-6/logo-3.png",
    "/assets/img/brand/brands-6/logo-4.png",
    "/assets/img/brand/brands-6/logo-5.png",
    "/assets/img/brand/brands-6/logo-6.png",
    "/assets/img/brand/brands-6/logo-7.png",
    "/assets/img/brand/brands-6/logo-8.png",
    "/assets/img/brand/brands-6/logo-4.png",
    "/assets/img/brand/brands-6/logo-5.png",
    "/assets/img/brand/brands-6/logo-6.png",
    "/assets/img/brand/brands-6/logo-7.png",
];

// Ensure enough items for Swiper loop with slidesPerView:'auto' on wide screens (avoids console warnings)
const brand_slider = brand_data.length < 24 ? [...brand_data, ...brand_data] : brand_data;

interface DataType {
    id: number;
    name: string;
    designation: string;
    desc: string
}

const testi_data: DataType[] = [
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
    spaceBetween: 30,
    centeredSlides: true,
    allowTouchMove: false,
    speed: 6000,
    autoplay: {
        delay: 1,
        disableOnInteraction: true,
    },
};

const Testimonial = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

    return (
        <div className="td-testimonial-area td-testimonial-6-bg pt-155 pb-160">
            <div className="container">
                <div className="row align-items-end">
                    <div className="col-lg-8">
                        <div className="td-testimonial-6-wrap">
                            <div className="td-testimonial-6-title-wrap mb-55">
                                <span className="td-section-6-subtitle d-inline-block mb-15">OUR SUITABLE PRICING PLANS</span>
                                <h2 className="title">CLIENTS FEEDBACK</h2>
                            </div>
                            <Swiper {...setting} modules={[Autoplay, Thumbs]} thumbs={{ swiper: thumbsSwiper }} className="swiper-container td-testimonial-6-content-active">
                                {testi_data.map((item) => (
                                    <SwiperSlide key={item.id} className="swiper-slide">
                                        <div className="td-testimonial-6-text">
                                            <p className="mb-40">{item.desc}</p>
                                            <div className="td-testimonial-6-author">
                                                <span className="position">{item.designation}</span>
                                                <h6 className="name">{item.name}</h6>
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
                                            <img src={avatar} alt="" />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-130">
                <div className="container-fluid container-1650">
                    <div className="row">
                        <div className="col-12">
                            <Swiper {...setting3} modules={[Autoplay]} onSwiper={(swiper) => {
                                swiper.wrapperEl.classList.add("slide-transition");
                            }} className="swiper-container td-testimonial-6-brands-slider">
                                {brand_slider.map((brand, i) => (
                                    <SwiperSlide key={i} className="swiper-slide">
                                        <div className="brands-logo">
                                            <Link href="#"><img src={brand} alt="" /></Link>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Testimonial;
