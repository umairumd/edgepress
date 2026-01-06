"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Link from "next/link";
import Image from "next/image";
import type { TeamMember as TeamMemberType } from "@/lib/wp";

interface TeamMemberData {
    id: number;
    thumb: string;
    name: string;
    designation: string;
    isRemote?: boolean;
}

// Fallback static data if WordPress returns empty
const fallback_data: TeamMemberData[] = [
    {
        id: 1,
        thumb: "/assets/img/team/thumb-6/thumb.jpg",
        name: "John Smith",
        designation: "CEO & Founder",
    },
    {
        id: 2,
        thumb: "/assets/img/team/thumb-6/thumb-2.jpg",
        name: "Sarah Johnson",
        designation: "Creative Director",
    },
    {
        id: 3,
        thumb: "/assets/img/team/thumb-6/thumb-3.jpg",
        name: "Michael Brown",
        designation: "Lead Developer",
    },
    {
        id: 4,
        thumb: "/assets/img/team/thumb-6/thumb-4.jpg",
        name: "Emily Davis",
        designation: "UI/UX Designer",
    },
    {
        id: 5,
        thumb: "/assets/img/team/thumb-6/thumb-5.jpg",
        name: "David Wilson",
        designation: "Marketing Head",
    },
];

interface TeamProps {
    members?: TeamMemberType[];
}

const setting = {
    loop: true,
    freeMode: true,
    slidesPerView: 'auto' as const,
    spaceBetween: 30,
    centeredSlides: true,
    allowTouchMove: false,
    speed: 8000, // Fixed: was 30000 which made slider appear stuck
    autoplay: {
        delay: 0,
        disableOnInteraction: false,
    },
};

const Team = ({ members }: TeamProps) => {
    // Map WordPress team members to component format, or use fallback
    const team_data: TeamMemberData[] = members && members.length > 0
        ? members.map((m) => ({
            id: m.id,
            thumb: m.image?.url || "/assets/img/team/thumb-6/thumb.jpg",
            name: m.name,
            designation: m.role || "",
            isRemote: !!m.image?.url,
        }))
        : fallback_data;

    // Swiper loop with slidesPerView:'auto' can warn if there aren't enough slides.
    // Duplicate for smooth infinite loop without console warnings.
    const team_slider = team_data.length < 10 ? [...team_data, ...team_data] : team_data;

    return (
        <div className="td-team-area pt-105 fix">
            <div className="container">
                <div className="row mb-15">
                    <div className="col-lg-3">
                        <div className="td-team-6-subtitle mb-20">
                            <span className="td-section-6-subtitle">WHO WE ARE</span>
                        </div>
                    </div>
                    <div className="col-lg-9">
                        <div className="td-team-6-title-wrap mb-50">
                            <h2 className="td-section-6-bigtitle td-text-opacity">EXPERIENCED<br /> TEAM MEMBERS</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid p-0">
                <div className="row">
                    <div className="col-lg-12">
                        <Swiper {...setting} modules={[Autoplay]} onSwiper={(swiper) => {
                            swiper.wrapperEl.classList.add("slide-transition");
                        }} className="swiper-container td-team-6-slider">
                            {team_slider.map((item, idx) => (
                                <SwiperSlide key={`${item.id}-${idx}`} className="swiper-slide">
                                    <div className="td-team-6-wrap">
                                        <div className="td-team-6-thumb mb-20">
                                            <Link href="/team" aria-label={`View ${item.name}'s profile`}>
                                                {item.isRemote ? (
                                                    <Image
                                                        src={item.thumb}
                                                        alt={`${item.name} - ${item.designation}`}
                                                        width={307}
                                                        height={420}
                                                        className="w-100"
                                                        style={{ objectFit: "cover" }}
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <picture>
                                                        <source srcSet={item.thumb.replace(/\.jpg$/i, ".webp")} type="image/webp" />
                                                        <img
                                                            className="w-100"
                                                            src={item.thumb}
                                                            alt={`${item.name} - ${item.designation}`}
                                                            width={307}
                                                            height={420}
                                                            loading="lazy"
                                                            decoding="async"
                                                        />
                                                    </picture>
                                                )}
                                            </Link>
                                        </div>
                                        <div className="td-team-6-content">
                                            <Link href="/team" className="name d-inline-block mb-5">{item.name}</Link>
                                            <span className="tag d-block">{item.designation}</span>
                                        </div>
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

export default Team;
