import Image from "next/image";

const VideoArea = () => {
    return (
        <div className="td-video-area">
            <Image
                src="/assets/img/video/video-6/inoma-home-2.jpg"
                alt="Inoma Digital - Full-service digital agency helping businesses grow"
                width={1920}
                height={600}
                priority
                fetchPriority="high"
                sizes="100vw"
                style={{ width: "100%", height: "auto", display: "block" }}
            />
        </div>
    )
}

export default VideoArea;
