import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, getPosts, getRecentPosts, getCategories, getFeaturedPosts } from "@/lib/wp";
import BlogSidebarArea from "@/components/pages/blog-sidebar/BlogSidebarArea";
import BlogRelated from "@/components/pages/blog-sidebar/BlogRelated";
import Cta from "@/components/common/Cta";
import { getSiteUrl } from "@/lib/siteUrl";

const SITE_URL = getSiteUrl();
export const revalidate = 300;

function stripHtml(html?: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
}

/** Normalize a URL to the canonical origin (from SITE_URL), preserving pathname, search, and hash. */
function normalizeCanonical(url: string, canonicalOrigin: string, fallback: string): string {
  try {
    const u = new URL(url);
    const origin = new URL(canonicalOrigin);
    u.protocol = origin.protocol;
    u.hostname = origin.hostname;
    u.port = origin.port;
    return u.toString();
  } catch {
    return fallback;
  }
}

export async function generateStaticParams() {
  const posts = await getPosts(30);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  const title = post?.seo?.title ? stripHtml(post.seo.title) : post?.title ? stripHtml(post.title) : "Blog";
  const description = post?.seo?.metaDesc
    ? stripHtml(post.seo.metaDesc)
    : post?.excerpt
      ? stripHtml(post.excerpt)
      : "Read our latest insights.";
  const canonicalOrigin = new URL(SITE_URL).origin;
  const fallbackCanonical = `${SITE_URL}/blog/${slug}`;
  const canonical = post?.seo?.canonical
    ? normalizeCanonical(post.seo.canonical, canonicalOrigin, fallbackCanonical)
    : fallbackCanonical;
  const image = post?.seo?.opengraphImage?.url || post?.featuredImage?.url;
  const ogTitle = post?.seo?.opengraphTitle ? stripHtml(post.seo.opengraphTitle) : title;
  const ogDesc = post?.seo?.opengraphDescription ? stripHtml(post.seo.opengraphDescription) : description;
  const twitterTitle = post?.seo?.twitterTitle ? stripHtml(post.seo.twitterTitle) : title;
  const twitterDesc = post?.seo?.twitterDescription ? stripHtml(post.seo.twitterDescription) : description;
  const twitterImage = post?.seo?.twitterImage?.url || image;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: canonical,
      type: "article",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDesc,
      images: twitterImage ? [twitterImage] : undefined,
    },
  };
}

export default async function BlogDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, recentPosts, categories, featuredPosts] = await Promise.all([
    getPost(slug),
    getRecentPosts(30),
    getCategories(),
    getFeaturedPosts(2),
  ]);

  if (!post) return notFound();

  const published = post.date ? new Date(post.date).toISOString() : undefined;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: stripHtml(post.title),
    datePublished: published,
    dateModified: published,
    image: post.featuredImage?.url,
    author: { "@type": "Organization", name: post.author || "Inoma Digital" },
    publisher: { "@type": "Organization", name: "Inoma Digital" },
    mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
    description: stripHtml(post.excerpt),
  };

  // Find current post index in the sorted list (newest first)
  const allPosts = recentPosts || [];
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  
  // Next = older post (higher index), Prev = newer post (lower index)
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 
    ? { slug: allPosts[currentIndex + 1].slug, title: allPosts[currentIndex + 1].title }
    : null;
  const prevPost = currentIndex > 0 
    ? { slug: allPosts[currentIndex - 1].slug, title: allPosts[currentIndex - 1].title }
    : null;

  const candidates = allPosts.filter((p) => p.slug !== slug);

  // Sidebar: hard cap to 6
  const sidebarRecent = candidates.slice(0, 6);

  // Related: prefer same category, then fill with others; hard cap to 3
  const sameCat = post.category ? candidates.filter((p) => p.category === post.category) : [];
  const other = candidates.filter((p) => !post.category || p.category !== post.category);
  const related = [...sameCat, ...other].slice(0, 3);

  const sidebarFeatured = (featuredPosts || []).filter((p) => p.slug !== slug).slice(0, 2);
  const currentUrl = `${SITE_URL}/blog/${slug}`;

  return (
    <main>
      <BlogSidebarArea
        contentHtml={post.content}
        title={post.title}
        date={post.date}
        category={post.category}
        author={post.author || "Inoma Digital"}
        featuredImage={post.featuredImage}
        featuredPosts={sidebarFeatured}
        recentPosts={sidebarRecent}
        categories={categories}
        currentUrl={currentUrl}
        prevPost={prevPost}
        nextPost={nextPost}
      />
      <BlogRelated items={related} footerContent={<Cta />} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </main>
  );
}


