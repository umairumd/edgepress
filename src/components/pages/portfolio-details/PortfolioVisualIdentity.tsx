"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { IconArrowLeft, IconArrowRight } from "@/components/icons";

const slider_data: string[] = [
    "/assets/img/portfolio/details/thumb-3.jpg",
    "/assets/img/portfolio/details/thumb-4.jpg",
    "/assets/img/portfolio/details/thumb-3.jpg",
    "/assets/img/portfolio/details/thumb-4.jpg",
];

const setting = {
    slidesPerView: 2,
    speed: 700,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 4000,
    },
    navigation: {
        nextEl: ".td-portfolio-identity-next",
        prevEl: ".td-portfolio-identity-prev",
    },
    breakpoints: {
        '1400': {
            slidesPerView: 2,
        },
        '1200': {
            slidesPerView: 2,
        },
        '991': {
            slidesPerView: 2,
        },
        '768': {
            slidesPerView: 1,
        },
        '576': {
            slidesPerView: 1,
        },
        '0': {
            slidesPerView: 1,
        },
    },
};

const PortfolioVisualIdentity = () => {
    return (
        <div className="td-portfolio-identity-area pt-120 pb-160">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="td-portfolio-identity-title mb-85">
                            <h2 className="td-section-page-title">Visual Identity</h2>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <span className="td-portfolio-identity-subtitle">An introduction</span>
                    </div>
                    <div className="col-xl-6 col-lg-8">
                        <div className="td-portfolio-identity-content pb-105">
                            <h5 className="mb-30">Creative agencies are known for their ability to think outside the box, offering fresh, innovative solutions to clients&apos; marketing and branding needs. Many creative agencies focus on specific industries.</h5>
                            <p>The opening of the new St. Regis hotel in Venice created the need for a web experience to support the opening activities. It was our job to translate an atmosphere of great subtlety and refinement, into a one-of-a-kind digital experience. We were tasked to create a one-page website that needed to
                                express these traits.</p>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-lg-11">
                        <div className="td-portfolio-identity-slider-wrap">
                            <Swiper {...setting} modules={[Autoplay, Navigation]} className="swiper-container td-portfolio-identity-slider">
                                {slider_data.map((img, i) => (
                                    <SwiperSlide key={i} className="swiper-slide">
                                        <div className="td-portfolio-identity-slider-thumb">
                                            <img className="w-100" src={img} alt="" />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="td-portfolio-identity-navigation d-flex justify-content-between pt-80 align-items-center">
                            <span className="td-portfolio-identity-prev">
                                <IconArrowLeft />
                                Prev
                            </span>
                            <div className="td-portfolio-identity-border"></div>
                            <span className="td-portfolio-identity-next">
                                Next
                                <IconArrowRight />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PortfolioVisualIdentity;
