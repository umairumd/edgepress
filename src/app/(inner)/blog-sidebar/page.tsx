import type { Metadata } from "next";
import BlogHero from "@/components/pages/blog-sidebar/BlogHero";
import BlogSidebarArea from "@/components/pages/blog-sidebar/BlogSidebarArea";
import BlogRelated from "@/components/pages/blog-sidebar/BlogRelated";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function BlogSidebarPage() {
    return (
        <main>
            <BlogHero />
            <BlogSidebarArea
                title="Blog Post"
                contentHtml="<p>This is a placeholder page for the blog sidebar layout. Visit <a href='/blog'>/blog</a> to view real posts.</p>"
            />
            <BlogRelated />
        </main>
    );
}
