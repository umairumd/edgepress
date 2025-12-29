import Link from "next/link";
import { Post } from "@/lib/wp";
import type { ReactNode } from "react";
import Image from "next/image";

type Props = {
    items?: Post[];
    footerContent?: ReactNode;
};

function formatDate(date?: string) {
    if (!date) return "";
    try {
        return new Date(date).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
    } catch {
        return date;
    }
}

const BlogRelated = ({ items, footerContent }: Props) => {
    const data = (items && items.length ? items : []).slice(0, 3);
    const hasFooterContent = Boolean(footerContent);
    return (
        <div className={`td-blog-area pt-120 ${hasFooterContent ? "pb-0" : "pb-130"} grey-bg-2`}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="mb-60">
                            <h2 className="td-testimonial-title">Related <span>articles</span></h2>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {data.map((item, idx) => (
                        <div key={item.slug + idx} className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".5s" data-wow-duration="1s">
                            <div className="td-blog-wrap mb-60">
                                <div className="td-blog-thumb fix mb-25">
                                    <Image
                                        className="w-100"
                                        src={item.featuredImage?.url ?? "/assets/img/blog/blog.jpg"}
                                        alt={item.title}
                                        width={800}
                                        height={520}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        style={{ height: "auto" }}
                                        unoptimized={
                                            process.env.NODE_ENV !== "production" &&
                                            typeof item.featuredImage?.url === "string" &&
                                            item.featuredImage.url.startsWith("http")
                                        }
                                    />
                                </div>
                                <div className="td-blog-content">
                                    <h3 className="td-blog-title mb-30"><Link href={`/blog/${item.slug}`}>{item.title}</Link></h3>
                                    <div className="td-blog-cetagory d-flex align-items-center">
                                        <span className="cetagory">{item.category ?? "Blog"}</span>
                                        <span className="td-border ml-20 mr-15 d-inline-block"></span>
                                        <span className="dates">{formatDate(item.date)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* IMPORTANT: don't add extra bottom padding here, it creates a large gap below CTA */}
                {footerContent}
            </div>
        </div>
    )
}

export default BlogRelated;

