"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import portfolio_data from "@/data/PortfolioData";
import { PortfolioItem } from "@/lib/wp";
import Image from "next/image";

type Props = {
    items?: PortfolioItem[];
};

const PortfolioArea = ({ items }: Props) => {
    const isotopeRef = useRef<any>(null);
    const [filterKey, setFilterKey] = useState("*");
    const [selectedFilter, setSelectedFilter] = useState("*");
    const rafRef = useRef<number | null>(null);

    const relayout = useCallback(() => {
        if (!isotopeRef.current) return;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            try {
                isotopeRef.current.layout?.();
            } catch {
                // ignore
            }
        });
    }, []);

    useEffect(() => {
        const initIsotope = async () => {
            const Isotope = (await import("isotope-layout")).default;
            isotopeRef.current = new Isotope(".grid", {
                itemSelector: ".grid-item",
                layoutMode: "fitRows",
            });
            // Initial relayout after mount (images may still be loading)
            relayout();
        };

        if (typeof window !== "undefined") {
            initIsotope();
        }

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (isotopeRef.current) {
                isotopeRef.current.destroy();
            }
        };
    }, [relayout]);

    useEffect(() => {
        if (isotopeRef.current) {
            if (filterKey === "*") {
                isotopeRef.current.arrange({ filter: "*" });
            } else {
                isotopeRef.current.arrange({ filter: `.${filterKey}` });
            }
            relayout();
        }
    }, [filterKey, relayout]);

    const handleFilterKeyChange = (key: string) => () => {
        setFilterKey(key);
        setSelectedFilter(key);
    };

    const filteredData = useMemo(() => {
        if (items && items.length) {
            return items.map((item, idx) => ({
                id: item.slug ?? `item-${idx}`,
                img: item.featuredImage?.url ?? "/assets/img/portfolio/portfolio-6/thumb.jpg",
                title: item.title,
                tag: item.category ?? "Portfolio",
                category: "prof",
                slug: item.slug,
            }));
        }
        return portfolio_data.filter((items) => items.page === "portfolio_1").map((p) => ({ ...p, slug: "portfolio-details" }));
    }, [items]);

    return (
        <div className="td-portfolio-filter-area pb-160">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 mb-50">
                        <div className="td-portfolio-filter-btn text-center masonary-menu">
                            <button className={`${selectedFilter === "*" ? "is-checked active" : ""}`} onClick={handleFilterKeyChange("*")}> SHOW ALL </button>
                            <button className={`${selectedFilter === "prof" ? "is-checked active" : ""}`} onClick={handleFilterKeyChange("prof")}> digital  </button>
                            <button className={`${selectedFilter === "prof1" ? "is-checked active" : ""}`} onClick={handleFilterKeyChange("prof1")}> marketing  </button>
                            <button className={`${selectedFilter === "prof2" ? "is-checked active" : ""}`} onClick={handleFilterKeyChange("prof2")}> studio  </button>
                            <button className={`${selectedFilter === "prof3" ? "is-checked active" : ""}`} onClick={handleFilterKeyChange("prof3")}> creative  </button>
                        </div>
                    </div>
                </div>
                <div className="grid row">
                    {filteredData.map((item) => (
                        <div key={item.id} className={`col-md-6 grid-item ${item.category} mb-30`}>
                            <div className="td-portfolio-filter-wrapper p-relative">
                                <div className="td-portfolio-filter-thumb fix">
                                    <Image
                                        className="w-100"
                                        src={item.img}
                                        alt={typeof item.title === "string" ? item.title : "Project"}
                                        width={1200}
                                        height={800}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        style={{ height: "auto" }}
                                        unoptimized={process.env.NODE_ENV !== "production" && typeof item.img === "string" && item.img.startsWith("http")}
                                        onLoadingComplete={relayout}
                                    />
                                </div>
                                <div className="td-portfolio-filter-content">
                                    <span className="mb-10">{item.tag}</span>
                                    <h3 className="titles"><Link href={`/portfolio/${item.slug ?? "details"}`}>{item.title}</Link></h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex justify-content-center mt-50">
                            <div className="td-btn-group">
                                <Link className="td-btn-circle" href="/service">
                                    <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                                <Link className="td-btn-2 td-btn-primary" href="/service">SEE MORE PROJECT</Link>
                                <Link className="td-btn-circle" href="/service">
                                    <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PortfolioArea;
