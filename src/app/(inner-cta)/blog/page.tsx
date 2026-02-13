import type { Metadata } from "next";
import BlogArea from "@/components/pages/blog/BlogArea";
import Cta from "@/components/common/Cta";
import { getPosts } from "@/lib/wp";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Explore practical articles on digital strategy, marketing tips, SEO trends, development guides, and business growth to help teams make smarter decisions.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main>
      <section className="td-blog-listing-hero pt-120 pb-20">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-10">
              <div className="td-about-main-wrapper pb-40">
                <h1 className="td-section-page-title td-title-anim mb-20">
                  Insights on Growth,<br />
                  Strategy &amp; Digital Execution
                </h1>
                <p className="td-about-body mb-0">
                  Practical articles on marketing, design, development, and business strategy written to help founders and teams make better decisions, not chase trends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <BlogArea posts={posts} />
      <Cta />
    </main>
  );
}


