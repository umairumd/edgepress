import Link from "next/link";
import { Post } from "@/lib/wp";
import Image from "next/image";

type BlogAreaProps = {
    posts?: Post[];
};

const fallbackItems = [
    { slug: "we-are-a-creative-studio", thumb: "/assets/img/blog/standard/thumb-1.jpg", title: "We are a creative studio that specializes", tag: "Creative", date: "15 NOV, 2024" },
    { slug: "create-stunning-website", thumb: "/assets/img/blog/standard/thumb-2.jpg", title: "Create stunning website with our template", tag: "Marketing", date: "12 NOV, 2024" },
    { slug: "we-develop-design-experiences", thumb: "/assets/img/blog/standard/thumb-3.jpg", title: "We develop design experiences that work", tag: "Design", date: "10 NOV, 2024" },
];

function formatDate(date?: string) {
    if (!date) return "";
    try {
        return new Date(date).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
    } catch {
        return date;
    }
}

const BlogArea = ({ posts }: BlogAreaProps) => {
    const items = posts && posts.length
        ? posts.map((p) => ({
            slug: p.slug,
            thumb: p.featuredImage?.url ?? "/assets/img/blog/blog.jpg",
            title: p.title,
            tag: p.category ?? "Blog",
            date: formatDate(p.date),
        }))
        : fallbackItems;

    return (
        <div className="td-blog-area pt-140 pb-100">
            <div className="container">
                <div className="row">
                    {items.map((item, idx) => (
                        <div key={item.slug + idx} className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".5s" data-wow-duration="1s">
                            <div className="td-blog-wrap mb-60">
                                <div className="td-blog-thumb fix mb-25">
                                    <Link href={`/blog/${item.slug}`} aria-label={typeof item.title === "string" ? item.title : "Open blog"}>
                                        {/*
                                          Local WP often serves media over HTTPS with a self-signed cert or blocks server-side fetches.
                                          Next/Image optimizer can return 400 in dev. We keep optimization in production.
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
                                    <h3 className="td-blog-title mb-30">
                                        <Link href={`/blog/${item.slug}`}>{item.title}</Link>
                                    </h3>
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
            </div>
        </div>
    )
}

export default BlogArea;

