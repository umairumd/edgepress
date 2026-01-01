import Link from "next/link";
import Sidebar from "./Sidebar";
import { Category, Post } from "@/lib/wp";

type Props = {
  contentHtml?: string | null;
  title: string;
  date?: string;
  category?: string;
  author?: string;
  featuredImage?: string;
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
}: Props) => {
  return (
    <div className="td-blog-sidebar-area mb-100 pt-135">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="td-blog-sidebar-left-content mr-70 mb-40">
              <div className="td-blog-details-meta mb-25">
                {date && <span className="date mr-20">{formatDate(date)}</span>}
                {category && <span className="category mr-20">{category}</span>}
              </div>
              <h2 className="td-blog-sidebar-title mb-20">
                <strong dangerouslySetInnerHTML={{ __html: title }} />
              </h2>
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
            <Sidebar recentPosts={recentPosts} categories={categories} currentUrl={currentUrl} shareTitle={title} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogSidebarArea;

