import Link from "next/link";
import Image from "next/image";
import type { PortfolioItem } from "@/lib/wp";

// Layout classes for the 5 portfolio positions
const LAYOUT_CLASSES = [
    "mt-90 mr-80",
    "spacing ml-80",
    "item-3",
    "item-4",
    "item-5 mr-75",
];

// Fallback placeholder data (used when no WordPress items available)
const PLACEHOLDER_DATA = [
    { slug: "", thumb: "/assets/img/portfolio/portfolio-6/thumb.jpg", tag: "Identity", title: "Stellar vibes" },
    { slug: "", thumb: "/assets/img/portfolio/portfolio-6/thumb-2.jpg", tag: "Identity", title: "Stellar vibes" },
    { slug: "", thumb: "/assets/img/portfolio/portfolio-6/thumb-3.jpg", tag: "Identity", title: "Stellar vibes" },
    { slug: "", thumb: "/assets/img/portfolio/portfolio-6/thumb-4.jpg", tag: "Identity", title: "Stellar vibes" },
    { slug: "", thumb: "/assets/img/portfolio/portfolio-6/thumb-5.jpg", tag: "Identity", title: "Stellar vibes" },
];

const formatSerial = (num: number): string => {
    return `${num < 10 ? `0${num}` : num}`;
};

interface PortfolioProps {
    items?: PortfolioItem[];
}

const Portfolio = ({ items }: PortfolioProps) => {
    // Map WordPress items to display data, or use placeholders
    const displayItems = (items && items.length > 0)
        ? items.slice(0, 5).map((item, i) => ({
            slug: item.slug,
            thumb: item.featuredImage?.url || PLACEHOLDER_DATA[i]?.thumb || "/assets/img/placeholder-4x3.svg",
            tag: item.category || "Portfolio",
            title: item.title,
        }))
        : PLACEHOLDER_DATA;

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
                                 RECENT WORK 
                            </h2>
                        </div>
                    </div>
                    {displayItems.map((item, i) => {
                        const href = item.slug ? `/portfolio/${item.slug}` : "/portfolio";
                        return (
                            <div key={item.slug || i} className="col-lg-6">
                                <div className={`td-portfolio-6-thumb-wrap mb-40 p-relative z-index-1 ${LAYOUT_CLASSES[i] || ""} wow fadeInLeft`} data-wow-delay=".4s" data-wow-duration="1s">
                                    <h2 className="td-portfolio-6-transparent">{formatSerial(i + 1)}</h2>
                                    <div className="td-portfolio-6-thumb ml-110">
                                        <div className="roun fix mb-25 p-relative">
                                            <Image
                                                src={item.thumb}
                                                alt={item.title}
                                                fill
                                                sizes="(max-width: 991px) 100vw, 50vw"
                                                style={{ objectFit: "cover" }}
                                            />
                                            <Link href={href} className="td-portfolio-6-btn" aria-label={`View ${item.title}`}>
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 13L13 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M1 1H13V13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </Link>
                                        </div>
                                        <div className="td-portfolio-6-content">
                                            <span className="tag">{item.tag}</span>
                                            <h3 className="title"><Link href={href}>{item.title}</Link></h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
