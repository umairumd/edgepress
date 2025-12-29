import type { Metadata } from "next";
import BlogThumb from "@/components/pages/blog/BlogThumb";
import BlogArea from "@/components/pages/blog/BlogArea";
import Cta from "@/components/common/Cta";
import { getPosts } from "@/lib/wp";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights, strategies, and practical guidance from Inoma Digital — focused on growth and execution.",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main>
      <BlogThumb />
      <BlogArea posts={posts} />
      <Cta />
    </main>
  );
}


