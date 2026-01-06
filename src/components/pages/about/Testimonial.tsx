"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { IconStar, IconArrowLeft, IconArrowRight } from "@/components/icons";
import type { Testimonial as TestimonialType } from "@/lib/wp";

interface DataType {
    id: number;
    name: string;
    desc: string;
}

// Fallback static data if WordPress returns empty
const fallback_data: DataType[] = [
    {
        id: 1,
        name: "@ Laura Leipina",
        desc: "We offer a comprehensive suite of services design to drive innovation and excellence in the tech industry. Our team of experts is dedicated to delivering top-notch",
    },
    {
        id: 2,
        name: "@ John Smith",
        desc: "Working with Inoma Digital was a game-changer for our business. Their strategic approach and attention to detail helped us achieve our goals faster than expected.",
    },
    {
        id: 3,
        name: "@ Sarah Johnson",
        desc: "The team's expertise in design and development is unmatched. They delivered a beautiful, high-performing website that exceeded all our expectations.",
    },
];

interface TestimonialProps {
    testimonials?: TestimonialType[];
}

const setting = {
    slidesPerView: 1,
    speed: 700,
    spaceBetween: 30,
    loop: true,
    navigation: {
        nextEl: ".td-testimonial-5-next",
        prevEl: ".td-testimonial-5-prev",
    },
};

const Testimonial = ({ testimonials }: TestimonialProps) => {
    // Map WordPress testimonials to component format, or use fallback
    const testi_data: DataType[] = testimonials && testimonials.length > 0
        ? testimonials.map((t) => ({
            id: t.id,
            name: t.designation ? `@ ${t.name} - ${t.designation}` : `@ ${t.name}`,
            desc: t.text,
        }))
        : fallback_data;

    return (
        <div className="td-testimonial-area pt-115 pb-150 td-about-testimonial">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4">
                        <div className="td-testimonial-5-ratings-wrap mb-45 d-flex align-items-center">
                            <h3 className="title mb-0 mr-20">4.82</h3>
                            <div>
                                <span className="ratings mb-10">
                                    <IconStar />
                                    <IconStar />
                                    <IconStar />
                                    <IconStar />
                                    <IconStar />
                                </span>
                                <span className="review">Client review</span>
                            </div>
                        </div>
                        <div className="td-testimonial-5-navigation mb-30">
                            <span className="td-testimonial-5-prev d-inline-block">
                                <IconArrowLeft />
                            </span>
                            <span className="td-testimonial-5-next ml-5 d-inline-block">
                                <IconArrowRight />
                            </span>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <Swiper {...setting} modules={[Autoplay, Navigation]} className="swiper-container td-testimonial-5-slider">
                            {testi_data.map((item) => (
                                <SwiperSlide key={item.id} className="swiper-slide">
                                    <div className="td-testimonial-5-content mr-80">
                                        <p className="mb-25">{item.desc}</p>
                                        <span>{item.name}</span>
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

export default Testimonial;
