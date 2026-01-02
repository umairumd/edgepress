import Link from "next/link";
import Image from "next/image";

interface DataType {
    id: number;
    class: string;
    thumb: string;
    tag: string;
    title: string;
}

const project_data: DataType[] = [
    {
        id: 1,
        class: "mt-90 mr-80",
        thumb: "/assets/img/portfolio/portfolio-6/thumb.jpg",
        tag: "Identity",
        title: "Stellar vibes",
    },
    {
        id: 2,
        class: "spacing ml-80",
        thumb: "/assets/img/portfolio/portfolio-6/thumb-2.jpg",
        tag: "Identity",
        title: "Stellar vibes",
    },
    {
        id: 3,
        class: "item-3",
        thumb: "/assets/img/portfolio/portfolio-6/thumb-3.jpg",
        tag: "Identity",
        title: "Stellar vibes",
    },
    {
        id: 4,
        class: "item-4",
        thumb: "/assets/img/portfolio/portfolio-6/thumb-4.jpg",
        tag: "Identity",
        title: "Stellar vibes",
    },
    {
        id: 5,
        class: "item-5 mr-75",
        thumb: "/assets/img/portfolio/portfolio-6/thumb-5.jpg",
        tag: "Identity",
        title: "Stellar vibes",
    },
];

const formatSerial = (num: number): string => {
    return `${num < 10 ? `0${num}` : num}`;
};

const Portfolio = () => {
    const sizeFor = (src: string) => {
        if (src.includes("thumb-3") || src.includes("thumb-4")) return { w: 562, h: 570 };
        return { w: 450, h: 570 };
    };

    return (
        <div className="td-portfolio-area pt-150 pb-115">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4">
                        <div className="td-portfolio-6-subtitle mb-20">
                            <span className="td-section-6-subtitle">PORTFOLIO</span>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="td-portfolio-6-title-wrap mb-50 ml-80">
                            <h2 className="td-section-6-bigtitle td-text-opacity" style={{ fontFamily: "var(--td-ff-heading)" }}>
                                SOME OF OUR WORKS
                            </h2>
                        </div>
                    </div>
                    {project_data.map((item, i) => (
                        <div key={item.id} className="col-lg-6">
                            <div className={`td-portfolio-6-thumb-wrap mb-40 p-relative z-index-1 ${item.class} wow fadeInLeft`} data-wow-delay=".4s" data-wow-duration="1s">
                                <h2 className="td-portfolio-6-transparent">{formatSerial(i + 1)}</h2>
                                <div className="td-portfolio-6-thumb ml-110">
                                    <div className="roun fix mb-25 p-relative">
                                        <Image
                                            className="w-100"
                                            src={item.thumb}
                                            alt=""
                                            width={sizeFor(item.thumb).w}
                                            height={sizeFor(item.thumb).h}
                                            sizes="(max-width: 991px) 100vw, 50vw"
                                            style={{ width: "100%", height: "auto" }}
                                        />
                                        <Link href="/portfolio" className="td-portfolio-6-btn" aria-label="View portfolio">
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 13L13 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M1 1H13V13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </Link>
                                    </div>
                                    <div className="td-portfolio-6-content">
                                        <span className="tag">{item.tag}</span>
                                        <h3 className="title"><Link href="/portfolio">{item.title}</Link></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Portfolio;
