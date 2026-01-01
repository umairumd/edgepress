import Link from "next/link";
import Sidebar from "./Sidebar";
import { Category, Post } from "@/lib/wp";
import Image from "next/image";

type Props = {
  contentHtml?: string | null;
  title: string;
  date?: string;
  category?: string;
  author?: string;
  featuredImage?:
    | string
    | {
        url: string;
        alt?: string | null;
        width?: number | null;
        height?: number | null;
      };
  featuredPosts?: Post[];
  currentUrl?: string;
  recentPosts?: Post[];
  categories?: Category[];
};

function formatDate(date?: string) {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return date;
  }
}

const BlogSidebarArea = ({
  contentHtml,
  title,
  date,
  category,
  author,
  currentUrl,
  recentPosts,
  categories,
  featuredImage,
  featuredPosts,
}: Props) => {
  const img = typeof featuredImage === "string" ? { url: featuredImage } : featuredImage;
  const imgSrc = img?.url;
  const imgAlt = img?.alt || title || "Blog";
  const imgW = img?.width || 1600;
  const imgH = img?.height || 900;

  return (
    <div className="td-blog-sidebar-area td-blog-detail-layout mb-100 pt-120">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="td-blog-sidebar-left-content mr-70 mb-40">
              <div className="td-blog-details-meta mb-15">
                {date && <span className="date mr-20">{formatDate(date)}</span>}
                {category && <span className="category mr-20">{category}</span>}
              </div>

              <h1 className="td-blog-detail-title mb-25" dangerouslySetInnerHTML={{ __html: title }} />

              {imgSrc ? (
                <div className="td-blog-detail-media mb-35">
                  <Image
                    className="w-100"
                    src={imgSrc}
                    alt={imgAlt}
                    width={imgW}
                    height={imgH}
                    priority
                    sizes="(max-width: 991px) 100vw, 66vw"
                    style={{ width: "100%", height: "auto" }}
                    unoptimized={process.env.NODE_ENV !== "production" && imgSrc.startsWith("http")}
                  />
                </div>
              ) : null}

              {contentHtml ? (
                <div className="td-blog-sidebar-body td-wp-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
              ) : (
                <p>No content available.</p>
              )}
              <div className="td-blog-details-pagenation td-portfolio-identity-navigation d-flex justify-content-between pt-45 align-items-center">
                <span className="td-blog-details-prev">
                  <i className="fa-solid fa-arrow-left mr-10"></i>
                  Prev
                </span>
                <div className="td-portfolio-identity-border"></div>
                <span className="td-blog-details-next">
                  Next
                  <i className="fa-solid fa-arrow-right ml-10"></i>
                </span>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <Sidebar featuredPosts={featuredPosts} recentPosts={recentPosts} categories={categories} currentUrl={currentUrl} shareTitle={title} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogSidebarArea;

