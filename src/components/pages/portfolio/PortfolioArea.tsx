"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import portfolio_data from "@/data/PortfolioData";
import { PortfolioItem } from "@/lib/wp";
import Image from "next/image";
import type Isotope from "isotope-layout";

type Props = {
    items?: PortfolioItem[];
};

const PortfolioArea = ({ items }: Props) => {
    const isotopeRef = useRef<Isotope | null>(null);
    const [filterKey, setFilterKey] = useState("*");
    const [selectedFilter, setSelectedFilter] = useState("*");
    const rafRef = useRef<number | null>(null);

    const relayout = useCallback(() => {
        if (!isotopeRef.current) return;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            try {
                isotopeRef.current?.layout();
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
            const normalizeCat = (input?: string) => (input || "").trim().toLowerCase();
            const normalizeSlug = (input?: string) =>
                normalizeCat(input)
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "")
                    .trim();
            const toKnownFilterSlug = (slug: string) => {
                const s = normalizeSlug(slug);
                if (s === "case-studies" || s === "websites" || s === "logos") return s;
                if (s.includes("case")) return "case-studies";
                if (s.includes("website") || s.includes("web")) return "websites";
                if (s.includes("logo")) return "logos";
                return "case-studies";
            };
            const toFilterClasses = (item: PortfolioItem) => {
                const slugs =
                    item.categories?.map((c) => c.slug).filter(Boolean) ??
                    (item.category ? [item.category] : []);
                const mapped = slugs.map(toKnownFilterSlug);
                return Array.from(new Set(mapped)).join(" ") || "case-studies";
            };

            return items
                .map((item, idx) => ({
                    id: item.slug ?? `item-${idx}`,
                    img: item.featuredImage?.url ?? "/assets/img/portfolio/portfolio-6/thumb.jpg",
                    title: item.title,
                    categoryClasses: toFilterClasses(item),
                    slug: item.slug,
                    featured: Boolean(item.featured),
                    date: item.date,
                }))
                .sort((a, b) => {
                    const feat = Number(b.featured) - Number(a.featured);
                    if (feat !== 0) return feat;
                    const ad = a.date ? Date.parse(a.date) : 0;
                    const bd = b.date ? Date.parse(b.date) : 0;
                    if (bd !== ad) return bd - ad;
                    return String(a.title || "").localeCompare(String(b.title || ""));
                });
        }
        // Template fallback: map old categories to the new filter buckets
        const mapLegacyToNew = (legacy: string) => {
            const l = legacy || "";
            if (l.includes("prof3")) return "logos";
            if (l.includes("prof2")) return "websites";
            if (l.includes("prof1")) return "case-studies";
            return "case-studies";
        };
        return portfolio_data
            .filter((items) => items.page === "portfolio_1")
            .map((p) => ({
                ...p,
                slug: "portfolio-details",
                categoryClasses: mapLegacyToNew(p.category),
                featured: false,
                date: undefined,
            }));
    }, [items]);

    return (
        <div className="td-portfolio-filter-area pb-160">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 mb-50">
                        <div className="td-portfolio-filter-btn text-center masonary-menu">
                            <button className={`${selectedFilter === "*" ? "is-checked active" : ""}`} onClick={handleFilterKeyChange("*")}> SHOW ALL </button>
                            <button className={`${selectedFilter === "case-studies" ? "is-checked active" : ""}`} onClick={handleFilterKeyChange("case-studies")}> CASE STUDIES </button>
                            <button className={`${selectedFilter === "websites" ? "is-checked active" : ""}`} onClick={handleFilterKeyChange("websites")}> WEBSITES </button>
                            <button className={`${selectedFilter === "logos" ? "is-checked active" : ""}`} onClick={handleFilterKeyChange("logos")}> LOGOS </button>
                        </div>
                    </div>
                </div>
                <div className="grid row">
                    {filteredData.map((item) => (
                        <div key={item.id} className={`col-md-6 grid-item ${item.categoryClasses} mb-30`}>
                            <div className="td-portfolio-card">
                                <Link className="td-portfolio-card-thumb" href={`/portfolio/${item.slug ?? "details"}`}>
                                    <Image
                                        src={item.img}
                                        alt={typeof item.title === "string" ? item.title : "Project"}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        style={{ objectFit: "cover" }}
                                        unoptimized={
                                            process.env.NODE_ENV !== "production" &&
                                            typeof item.img === "string" &&
                                            item.img.startsWith("http")
                                        }
                                        onLoadingComplete={relayout}
                                    />
                                    {item.featured ? (
                                        <span className="td-portfolio-card-badge" aria-label="Featured project">
                                            <i className="fa-solid fa-star" aria-hidden="true"></i>
                                            Featured
                                        </span>
                                    ) : null}
                                </Link>
                                <h3 className="td-portfolio-card-title">
                                    <Link href={`/portfolio/${item.slug ?? "details"}`}>{item.title}</Link>
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex justify-content-center mt-50">
                            <div className="td-btn-group">
                                <Link className="td-btn-circle" href="https://www.behance.net/inoma" target="_blank" rel="noopener noreferrer" aria-label="View Behance Portfolio">
                                    <i className="fa-brands fa-behance"></i>
                                </Link>
                                <Link className="td-btn-2 td-btn-primary" href="https://www.behance.net/inoma" target="_blank" rel="noopener noreferrer">View Behance Portfolio</Link>
                                <Link className="td-btn-circle" href="https://www.behance.net/inoma" target="_blank" rel="noopener noreferrer" aria-label="View Behance Portfolio">
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
