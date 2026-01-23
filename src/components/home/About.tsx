"use client";
import Image from "next/image";
import { useVideoPopup } from "@/hooks/useVideoPopup";
import VideoPopup from "@/modals/VideoPopup";

const About = () => {
    const { isVideoOpen, openVideo, closeVideo } = useVideoPopup();
    return (
        <div className="td-about-area pt-140 pb-125">
            <div className="container">
                <div className="row">
                    <div className="col-lg-5">
                        <div className="td-about-6-subtitle mb-20">
                            <span className="td-section-6-subtitle">WHO WE ARE</span>
                        </div>
                    </div>
                    <div className="col-lg-7">
                        <div className="td-about-6-title-wrap mb-50">
                            <h2
                                className="td-section-6-title mb-20 td-text-opacity"
                                style={{ fontFamily: "var(--td-ff-heading)" }}
                            >
                                Where Business Strategy Meets
                                
                                Digital Execution
                            </h2>
                            <p className="td-section-6-text">
                                Inoma Digital is a full-service digital agency helping businesses build, market, and scale with clarity. We bring strategy, design, development, and marketing together under one system — so everything works toward real business outcomes.
                            </p>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="td-about-6-thumb text-end p-relative z-index-1 mb-30">
                            <Image
                                className="shape td-live-anim-spin d-none d-lg-inline-block"
                                src="/assets/img/about/shape.png"
                                alt="Decorative rotating shape"
                                width={140}
                                height={140}
                                sizes="140px"
                                aria-hidden="true"
                            />
                            <div className="p-relative" style={{ cursor: "pointer" }} onClick={openVideo}>
                                <Image
                                    src="/assets/img/about/about-6/inoma-home-1.jpg"
                                    alt="Inoma Digital team collaborating on digital strategy and execution - Click to watch video"
                                    className="w-100"
                                    width={450}
                                    height={430}
                                    sizes="(max-width: 991px) 100vw, 450px"
                                    style={{ width: "100%", height: "auto" }}
                                />
                                <button
                                    type="button"
                                    className="popup-video td-video-6-inner"
                                    aria-label="Play video"
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        zIndex: 2,
                                        width: "80px",
                                        height: "80px",
                                        borderRadius: "50%",
                                        background: "rgba(255, 255, 255, 0.95)",
                                        border: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.1)";
                                        e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.2)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
                                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.15)";
                                    }}
                                >
                                    <svg width="24" height="28" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ marginLeft: "4px" }}>
                                        <path d="M20 12L0.5 23.2583V0.74167L20 12Z" fill="#0277b5" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="td-about-6-author ml-115 mb-30">
                            <div className="td-about-6-author-top mb-40">
                                <Image
                                    className="mb-25"
                                    src="/assets/img/about/about-6/avatar.png"
                                    alt="Inoma Digital team avatars"
                                    width={177}
                                    height={60}
                                    sizes="177px"
                                    style={{ width: "177px", height: "60px" }}
                                />
                                <p className="mb-25">
                                    Built by experienced founders and executed by an in-house team across strategy, design, development, and marketing.
                                </p>
                            </div>
                            <div className="td-about-6-author-count">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <div className="td-about-6-author-single">
                                            <h2 className="mb-10">96%</h2>
                                            <p>Clients Satisfied and<br /> Repeating</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <div className="td-about-6-author-single">
                                            <h2 className="mb-10">625+</h2>
                                            <p>Projects Completed<br /> Worldwide</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <VideoPopup isOpen={isVideoOpen} onClose={closeVideo} videoId="YV6AQgnaPVA" />
        </div>
    )
}

export default About;
