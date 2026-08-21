import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import BlogArea from "@/components/pages/blog/BlogArea";
import Cta from "@/components/common/Cta";
import { getPostsPaginated } from "@/lib/wp";

export const revalidate = 300;

const PER_PAGE = 12;

function parsePageParam(raw?: string): number {
  if (!raw) return 1;
  const parsed = parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return parsed;
}

type BlogPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const { page: pageParam } = await searchParams;
  const page = parsePageParam(pageParam);

  if (page <= 1) {
    return {
      title: "Blog",
      description:
        "Explore practical articles on digital strategy, marketing tips, SEO trends, development guides, and business growth to help teams make smarter decisions.",
      alternates: { canonical: "/blog" },
    };
  }

  return {
    title: `Blog — Page ${page}`,
    description:
      "Explore practical articles on digital strategy, marketing tips, SEO trends, development guides, and business growth to help teams make smarter decisions.",
    alternates: { canonical: `/blog?page=${page}` },
    robots: { index: false, follow: true },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page: pageParam } = await searchParams;
  const page = parsePageParam(pageParam);

  if (pageParam === "1") {
    redirect("/blog");
  }

  const result = await getPostsPaginated(page, PER_PAGE);

  if (result.total > 0 && page > result.totalPages) {
    notFound();
  }

  if (page > 1 && result.posts.length === 0) {
    notFound();
  }

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
      <BlogArea
        posts={result.posts}
        pagination={
          result.totalPages > 1
            ? { currentPage: result.page, totalPages: result.totalPages }
            : undefined
        }
      />
      <Cta />
    </main>
  );
}
