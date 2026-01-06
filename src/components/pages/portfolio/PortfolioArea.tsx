"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { PortfolioItem } from "@/lib/wp";
import Image from "next/image";
import type Isotope from "isotope-layout";
import { IconStar, IconBehance, IconArrowRight } from "@/components/icons";

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
                    // Portfolio thumbnails should come from WordPress only (no local/template fallbacks).
                    img: item.featuredImage?.url ?? null,
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
        // If WP returns no items, show an empty state (no template/demo fallback).
        return [];
    }, [items]);

    return (
        <div className="td-portfolio-filter-area pb-160">
            <div className="container">
                {filteredData.length > 0 ? (
                    <>
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
                                            {item.img ? (
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
                                            ) : (
                                                <div className="td-portfolio-card-thumb-placeholder" aria-label="No featured image" />
                                            )}
                                            {item.featured ? (
                                                <span className="td-portfolio-card-badge" aria-label="Featured project">
                                                    <IconStar aria-hidden="true" />
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
                    </>
                ) : (
                    <div className="row">
                        <div className="col-12">
                            <div className="text-center pt-60 pb-60">
                                <h3 className="mb-10">No portfolio projects yet</h3>
                                <p className="mb-0">Please check back soon.</p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex justify-content-center mt-50">
                            <div className="td-btn-group">
                                <Link className="td-btn-circle" href="https://www.behance.net/inoma" target="_blank" rel="noopener noreferrer" aria-label="Behance Portfolio">
                                    <IconBehance />
                                </Link>
                                <Link className="td-btn-2 td-btn-primary" href="https://www.behance.net/inoma" target="_blank" rel="noopener noreferrer">Behance Portfolio</Link>
                                <Link className="td-btn-circle" href="https://www.behance.net/inoma" target="_blank" rel="noopener noreferrer" aria-label="Behance Portfolio">
                                    <IconArrowRight />
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
