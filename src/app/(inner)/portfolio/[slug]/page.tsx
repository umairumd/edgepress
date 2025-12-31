import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPortfolioItem, getPortfolioItems } from "@/lib/wp";
import Image from "next/image";
import { getSiteUrl } from "@/lib/siteUrl";
import Cta from "@/components/common/Cta";

const SITE_URL = getSiteUrl();
export const revalidate = 300;

function stripHtml(html?: string) {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "").trim();
}

export async function generateStaticParams() {
    const items = await getPortfolioItems(30);
    return items.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const item = await getPortfolioItem(slug);
    const title = item?.seo?.title ? stripHtml(item.seo.title) : item?.title ? stripHtml(item.title) : "Portfolio";
    const description = item?.seo?.metaDesc
        ? stripHtml(item.seo.metaDesc)
        : item?.excerpt
            ? stripHtml(item.excerpt)
            : "Project details.";
    const canonical = item?.seo?.canonical || `${SITE_URL}/portfolio/${slug}`;
    const image = item?.seo?.opengraphImage?.url || item?.featuredImage?.url;
    const ogTitle = item?.seo?.opengraphTitle ? stripHtml(item.seo.opengraphTitle) : title;
    const ogDesc = item?.seo?.opengraphDescription ? stripHtml(item.seo.opengraphDescription) : description;
    const twitterTitle = item?.seo?.twitterTitle ? stripHtml(item.seo.twitterTitle) : title;
    const twitterDesc = item?.seo?.twitterDescription ? stripHtml(item.seo.twitterDescription) : description;
    const twitterImage = item?.seo?.twitterImage?.url || image;

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

export default async function PortfolioDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const item = await getPortfolioItem(slug);
    if (!item) return notFound();
    const isDev = process.env.NODE_ENV !== "production";

    const entryImage = item.entryImage?.url || item.featuredImage?.url;
    const entryAlt = item.entryImage?.alt || item.featuredImage?.alt || stripHtml(item.title);
    const entryWidth = item.entryImage?.width || item.featuredImage?.width || 1600;
    const entryHeight = item.entryImage?.height || item.featuredImage?.height || 4000;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: stripHtml(item.title),
        image: entryImage,
        description: stripHtml(item.excerpt),
        url: `${SITE_URL}/portfolio/${slug}`,
        author: { "@type": "Organization", name: "Inoma Digital" },
    };

    return (
        <main className="td-has-cta-footer">
            <div className="td-portfolio-entry-area pb-120 pt-120">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="td-portfolio-entry-header mb-40">
                                <h1 className="td-portfolio-entry-title" dangerouslySetInnerHTML={{ __html: item.title }} />
                            </div>

                            {entryImage ? (
                                <div className="td-portfolio-entry-image-wrap">
                                    <Image
                                        className="w-100 td-portfolio-entry-image"
                                        src={entryImage}
                                        alt={entryAlt}
                                        width={entryWidth}
                                        height={entryHeight}
                                        sizes="100vw"
                                        style={{ height: "auto" }}
                                        priority
                                        unoptimized={isDev && entryImage.startsWith("http")}
                                    />
                                </div>
                            ) : (
                                <p>Project image coming soon.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Cta />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
        </main>
    );
}
