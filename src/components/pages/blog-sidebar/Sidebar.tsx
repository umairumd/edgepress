import Link from "next/link";
import { Category, Post } from "@/lib/wp";
import Image from "next/image";
import { IconFacebookF, IconTwitter, IconLinkedinIn, IconWhatsapp } from "@/components/icons";
import { formatDate } from "@/lib/utils";

type SidebarProps = {
  featuredPosts?: Post[];
  recentPosts?: Post[];
  categories?: Category[];
  currentUrl?: string;
  shareTitle?: string;
};

const Sidebar = ({ featuredPosts, recentPosts, categories, currentUrl, shareTitle }: SidebarProps) => {
  const hasFeatured = featuredPosts && featuredPosts.length > 0;
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
          <h3 className="td-blog-postbox-info-title">Inoma Digital</h3>
            <p>
              A digital agency built on systems, clarity, and long-term results. Helping businesses through strategy,
              design, technology, marketing and business growth.
            </p>
          <div
            className="td-blog-postbox-info-social"
            style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", marginBottom: "30px" }}
          >
            <Link className="facebook" href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
              <IconFacebookF />
            </Link>
            <Link className="twitter" href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
              <IconTwitter />
            </Link>
            <Link className="linkedin" href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
              <IconLinkedinIn />
            </Link>
            <Link className="whatsapp" href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
              <IconWhatsapp />
            </Link>
          </div>
        </div>

        {hasFeatured && (
          <div className="td-blog-postbox-post td-blog-postbox-cetagory-list mb-60 td-blog-sidebar-featured-wrap">
            <h3 className="td-blog-postbox-cetagory-title mb-25">Featured Blogs</h3>
            <div className="td-blog-sidebar-featured">
              {featuredPosts!.slice(0, 2).map((item) => {
                const img = item.featuredImage?.url || "/assets/img/blog/sidebar/thumb.jpg";
                const alt = item.featuredImage?.alt || item.title || "Featured blog";
                return (
                  <Link key={item.slug} href={`/blog/${item.slug}`} className="td-blog-sidebar-featured-card" aria-label={item.title}>
                    <div className="td-blog-sidebar-featured-thumb">
                      <Image
                        src={img}
                        alt={alt}
                        fill
                        sizes="(max-width: 991px) 100vw, 360px"
                        style={{ objectFit: "cover" }}
                        unoptimized={process.env.NODE_ENV !== "production" && typeof img === "string" && img.startsWith("http")}
                      />
                    </div>
                    <div className="td-blog-sidebar-featured-body">
                      <span className="td-blog-postbox-post-date">{formatDate(item.date, "numeric-short")}</span>
                      <h4 className="td-blog-sidebar-featured-title">{item.title}</h4>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {hasCats && (
          <div className="td-blog-postbox-cetagory-list mb-60">
            <h3 className="td-blog-postbox-cetagory-title mb-25">Category</h3>
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
            <h3 className="td-blog-postbox-cetagory-title mb-25">Recent Blogs</h3>
            {recentPosts!.slice(0, 6).map((item, idx) => (
              <div key={item.slug + idx}>
                <div className="td-blog-postbox-post-thumb d-flex align-items-center">
                  <Link href={`/blog/${item.slug}`} aria-label={item.title} style={{ flex: "0 0 auto" }}>
                    <Image
                      src={item.featuredImage?.url ?? "/assets/img/blog/sidebar/thumb.jpg"}
                      alt={item.featuredImage?.alt || item.title || "Blog"}
                      width={100}
                      height={110}
                      style={{ borderRadius: "6px", objectFit: "cover" }}
                      unoptimized={
                        process.env.NODE_ENV !== "production" &&
                        typeof item.featuredImage?.url === "string" &&
                        item.featuredImage.url.startsWith("http")
                      }
                    />
                  </Link>
                  <div className="td-blog-postbox-post-content">
                    <span className="td-blog-postbox-post-date">{formatDate(item.date, "numeric-short")}</span>
                    <h4 className="td-blog-postbox-post-title"><Link href={`/blog/${item.slug}`}>{item.title}</Link></h4>
                  </div>
                </div>
                {idx < Math.min(recentPosts!.length, 6) - 1 && <div className="td-blog-postbox-post-border mt-20 mb-20"></div>}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Sidebar;

