"use client";
import { useVideoPopup } from "@/hooks/useVideoPopup";
import VideoPopup from "@/modals/VideoPopup";

const VideoArea = () => {
    const { isVideoOpen, openVideo, closeVideo } = useVideoPopup();
    return (
        <>
            <div className="td-video-area include-bg" style={{ backgroundImage: `url(/assets/img/video/video-6/bg.jpg)` }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="td-video-6-wrap text-end">
                                <a style={{ cursor: "pointer" }} onClick={openVideo} className="popup-video td-video-6-inner">
                                    <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 12L0.5 23.2583V0.74167L20 12Z" fill="#1C1D1F" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <VideoPopup isOpen={isVideoOpen} onClose={closeVideo} videoId="eEzD-Y97ges" />
        </>
    )
}

export default VideoArea;
