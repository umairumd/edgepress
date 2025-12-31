"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

interface DataType {
    id: number;
    name: string;
    desc: string;
}

const testi_data: DataType[] = [
    {
        id: 1,
        name: "@ lLaura Leipina",
        desc: "We offer a comprehensive suite of services design to drive innovation and excellence in the tech industry. Our team of experts is dedicated to delivering top-notch",
    },
    {
        id: 2,
        name: "@ lLaura Leipina",
        desc: "We offer a comprehensive suite of services design to drive innovation and excellence in the tech industry. Our team of experts is dedicated to delivering top-notch",
    },
    {
        id: 3,
        name: "@ lLaura Leipina",
        desc: "We offer a comprehensive suite of services design to drive innovation and excellence in the tech industry. Our team of experts is dedicated to delivering top-notch",
    },
];

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

const Testimonial = () => {
    return (
        <div className="td-testimonial-area pt-115 pb-150 td-about-testimonial">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4">
                        <div className="td-testimonial-5-ratings-wrap mb-45 d-flex align-items-center">
                            <h3 className="title mb-0 mr-20">4.82</h3>
                            <div>
                                <span className="ratings mb-10">
                                    <i className="fa-solid fa-star-sharp"></i>
                                    <i className="fa-solid fa-star-sharp"></i>
                                    <i className="fa-solid fa-star-sharp"></i>
                                    <i className="fa-solid fa-star-sharp"></i>
                                    <i className="fa-solid fa-star-sharp"></i>
                                </span>
                                <span className="review">Client review</span>
                            </div>
                        </div>
                        <div className="td-testimonial-5-navigation mb-30">
                            <span className="td-testimonial-5-prev d-inline-block">
                                <i className="fa-solid fa-arrow-left"></i>
                            </span>
                            <span className="td-testimonial-5-next ml-5 d-inline-block">
                                <i className="fa-solid fa-arrow-right"></i>
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
