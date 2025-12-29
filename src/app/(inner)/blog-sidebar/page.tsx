import BlogHero from "@/components/pages/blog-sidebar/BlogHero";
import BlogSidebarArea from "@/components/pages/blog-sidebar/BlogSidebarArea";
import BlogRelated from "@/components/pages/blog-sidebar/BlogRelated";

export default function BlogSidebarPage() {
    return (
        <main>
            <BlogHero />
            <BlogSidebarArea />
            <BlogRelated />
        </main>
    );
}
