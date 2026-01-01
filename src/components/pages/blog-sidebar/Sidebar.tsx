import Link from "next/link";
import { Category, Post } from "@/lib/wp";

type SidebarProps = {
  recentPosts?: Post[];
  categories?: Category[];
  currentUrl?: string;
  shareTitle?: string;
};

function formatDate(date?: string) {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return date;
  }
}

const Sidebar = ({ recentPosts, categories, currentUrl, shareTitle }: SidebarProps) => {
  const hasRecent = recentPosts && recentPosts.length > 0;
  const hasCats = categories && categories.length > 0;
  const url = currentUrl || "";
  const title = shareTitle || "";
  const encUrl = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encUrl}&text=${encTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encTitle}%20${encUrl}`,
  };

  return (
    <div className="td-blog-sidebar-right">
      <div className="td-blog-postbox-widget">
        <div className="td-blog-postbox-info">
          <h4 className="td-blog-postbox-info-title">Inoma Digital</h4>
            <p>
              A digital agency built on systems, clarity, and long-term results. Helping businesses through strategy,
              design, technology, marketing and business growth.
            </p>
          <div
            className="td-blog-postbox-info-social"
            style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", marginBottom: "30px" }}
          >
            <Link className="facebook" href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </Link>
            <Link className="twitter" href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
              <i className="fa-brands fa-twitter"></i>
            </Link>
            <Link className="linkedin" href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
              <i className="fa-brands fa-linkedin-in"></i>
            </Link>
            <Link className="whatsapp" href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
              <i className="fa-brands fa-whatsapp"></i>
            </Link>
          </div>
        </div>

        {hasCats && (
          <div className="td-blog-postbox-cetagory-list mb-60">
            <h5 className="td-blog-postbox-cetagory-title mb-25">Category</h5>
            <ul>
              {categories!.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/blog?category=${cat.slug}`}>
                    <span>{cat.name}</span>
                    <span className="total">({cat.count ?? 0})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasRecent && (
          <div className="td-blog-postbox-post td-blog-postbox-cetagory-list mb-60">
            <h5 className="td-blog-postbox-cetagory-title mb-25">Recent Blogs</h5>
            {recentPosts!.map((item, idx) => (
              <div key={item.slug + idx}>
                <div className="td-blog-postbox-post-thumb d-flex align-items-center">
                  <div className="td-blog-postbox-post-content">
                    <span className="td-blog-postbox-post-date">{formatDate(item.date)}</span>
                    <h5 className="td-blog-postbox-post-title"><Link href={`/blog/${item.slug}`}>{item.title}</Link></h5>
                  </div>
                </div>
                {idx < recentPosts!.length - 1 && <div className="td-blog-postbox-post-border mt-20 mb-20"></div>}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Sidebar;

