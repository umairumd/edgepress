import Link from "next/link";
import { Post } from "@/lib/wp";
import Image from "next/image";
import BlogPagination from "@/components/common/BlogPagination";
import { formatDate } from "@/lib/utils";

type BlogAreaProps = {
    posts?: Post[];
    pagination?: { currentPage: number; totalPages: number };
};

const BlogArea = ({ posts, pagination }: BlogAreaProps) => {
    const items =
        posts && posts.length
            ? posts.map((p) => ({
                  slug: p.slug,
                  thumb: p.featuredImage?.url ?? "/assets/img/blog/thumb.jpg",
                  title: p.title,
                  tag: p.category ?? "Blog",
                  date: formatDate(p.date, "upper-short"),
              }))
            : [];

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
                    <div className="row">
                        {items.map((item, idx) => (
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

