"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Post } from "@/lib/wp";
import Image from "next/image";
import BlogPagination from "@/components/common/BlogPagination";
import { formatDate, slugToLabel } from "@/lib/utils";

type BlogAreaProps = {
    posts?: Post[];
    pagination?: { currentPage: number; totalPages: number };
};

const toFilterSlug = (input?: string) =>
    (input || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .trim();

const postCategorySlugs = (post: Post): string[] => {
    const fromTerms = post.categories?.map((c) => c.slug).filter(Boolean) ?? [];
    if (fromTerms.length) return fromTerms.map(toFilterSlug).filter(Boolean);
    const fallback = toFilterSlug(post.category);
    return fallback ? [fallback] : [];
};

const BlogArea = ({ posts, pagination }: BlogAreaProps) => {
    const [selectedFilter, setSelectedFilter] = useState("*");

    const items =
        posts && posts.length
            ? posts.map((p) => ({
                  slug: p.slug,
                  thumb: p.featuredImage?.url ?? "/assets/img/blog/thumb.jpg",
                  title: p.title,
                  tag: p.category ?? "Blog",
                  date: formatDate(p.date, "upper-short"),
                  categorySlugs: postCategorySlugs(p),
              }))
            : [];

    const categorySlugs = useMemo(() => {
        const unique = new Set<string>();
        for (const item of items) {
            for (const slug of item.categorySlugs) unique.add(slug);
        }
        return Array.from(unique).sort((a, b) => slugToLabel(a).localeCompare(slugToLabel(b)));
    }, [items]);

    const visibleItems =
        selectedFilter === "*"
            ? items
            : items.filter((item) => item.categorySlugs.includes(selectedFilter));

    return (
        <div className="td-blog-area pt-0 pb-100">
            <div className="container">
                {!items.length ? (
                    <div className="row">
                        <div className="col-12">
                            <div className="td-blog-wrap mb-60">
                                <h3 className="mb-15">No blog posts yet.</h3>
                                <p className="mb-0">Once you publish posts in WordPress, they will show up here automatically.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {categorySlugs.length > 0 ? (
                            <div className="row">
                                <div className="col-lg-12 mb-50">
                                    <div className="td-blog-filter-btn text-center masonary-menu">
                                        <button
                                            className={`${selectedFilter === "*" ? "is-checked active" : ""}`}
                                            onClick={() => setSelectedFilter("*")}
                                        >
                                            All
                                        </button>
                                        {categorySlugs.map((slug) => (
                                            <button
                                                key={slug}
                                                className={`${selectedFilter === slug ? "is-checked active" : ""}`}
                                                onClick={() => setSelectedFilter(slug)}
                                            >
                                                {slugToLabel(slug)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : null}
                        <div className="row">
                            {visibleItems.map((item, idx) => (
                            <div key={item.slug + idx} className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".5s" data-wow-duration="1s">
                                <div className="td-blog-wrap mb-60">
                                    <div className="td-blog-thumb fix mb-25">
                                        <Link href={`/blog/${item.slug}`} aria-label={typeof item.title === "string" ? item.title : "Open blog"}>
                                            {/*
                                              Local WP can cause Next/Image optimizer issues in dev; keep optimization in production.
                                            */}
                                            <Image
                                                className="w-100"
                                                src={item.thumb}
                                                alt={item.title}
                                                width={800}
                                                height={520}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                style={{ height: "auto" }}
                                                unoptimized={process.env.NODE_ENV !== "production" && typeof item.thumb === "string" && item.thumb.startsWith("http")}
                                            />
                                        </Link>
                                    </div>
                                    <div className="td-blog-content">
                                        <h2 className="td-blog-title mb-30">
                                            <Link href={`/blog/${item.slug}`}>{item.title}</Link>
                                        </h2>
                                        <div className="td-blog-cetagory d-flex align-items-center">
                                            <span className="cetagory">{item.tag}</span>
                                            <span className="td-border ml-20 mr-15 d-inline-block"></span>
                                            <span className="dates">{item.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                    </>
                )}
                {pagination && (
                    <BlogPagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                    />
                )}
            </div>
        </div>
    )
}

export default BlogArea;
