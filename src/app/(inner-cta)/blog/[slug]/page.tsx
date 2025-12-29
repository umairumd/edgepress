import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, getPosts, getRecentPosts, getCategories } from "@/lib/wp";
import BlogSidebarArea from "@/components/pages/blog-sidebar/BlogSidebarArea";
import BlogHero from "@/components/pages/blog-sidebar/BlogHero";
import BlogRelated from "@/components/pages/blog-sidebar/BlogRelated";
import Cta from "@/components/common/Cta";

const SITE_URL = process.env.SITE_URL || "https://www.inomadigital.com";
export const revalidate = 300;

function stripHtml(html?: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
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
  const canonical = post?.seo?.canonical || `${SITE_URL}/blog/${slug}`;
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
  const [post, recentPosts, categories] = await Promise.all([getPost(slug), getRecentPosts(6), getCategories()]);

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

  const related = (recentPosts || []).filter((p) => p.slug !== slug).slice(0, 3);
  const sidebarRecent = (recentPosts || []).filter((p) => p.slug !== slug).slice(0, 3);
  const currentUrl = `${SITE_URL}/blog/${slug}`;

  return (
    <main>
      <BlogHero
        title={post.title}
        date={post.date}
        author={post.author || "Inoma Digital"}
        category={post.category}
        featuredImage={post.featuredImage}
      />
      <BlogSidebarArea
        contentHtml={post.content}
        title={post.title}
        date={post.date}
        category={post.category}
        author={post.author || "Inoma Digital"}
        featuredImage={post.featuredImage?.url}
        excerpt={post.excerpt}
        recentPosts={sidebarRecent}
        categories={categories}
        currentUrl={currentUrl}
      />
      <BlogRelated items={related} footerContent={<Cta />} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </main>
  );
}


