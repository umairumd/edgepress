import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPortfolioItem, getPortfolioItems } from "@/lib/wp";
import Image from "next/image";
import { getSiteUrl } from "@/lib/siteUrl";

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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const item = await getPortfolioItem(params.slug);
    const title = item?.seo?.title ? stripHtml(item.seo.title) : item?.title ? stripHtml(item.title) : "Portfolio";
    const description = item?.seo?.metaDesc
        ? stripHtml(item.seo.metaDesc)
        : item?.excerpt
            ? stripHtml(item.excerpt)
            : "Project details.";
    const canonical = item?.seo?.canonical || `${SITE_URL}/portfolio/${params.slug}`;
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

export default async function PortfolioDetailsPage({ params }: { params: { slug: string } }) {
    const item = await getPortfolioItem(params.slug);
    if (!item) return notFound();
    const isDev = process.env.NODE_ENV !== "production";

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: stripHtml(item.title),
        image: item.featuredImage?.url,
        description: stripHtml(item.excerpt),
        url: `${SITE_URL}/portfolio/${params.slug}`,
        author: { "@type": "Organization", name: "Inoma Digital" },
    };

    return (
        <main>
            <div className="td-portfolio-details-area pb-120 pt-120">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            {item.featuredImage?.url && (
                                <div className="td-portfolio-details-thumb mb-50">
                                    <Image
                                        className="w-100"
                                        src={item.featuredImage.url}
                                        alt={item.featuredImage.alt || stripHtml(item.title)}
                                        width={1400}
                                        height={900}
                                        sizes="100vw"
                                        style={{ height: "auto" }}
                                        priority
                                        unoptimized={isDev && item.featuredImage.url.startsWith("http")}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="col-lg-8">
                            <div className="td-portfolio-details-content">
                                <h3 className="mb-20" dangerouslySetInnerHTML={{ __html: item.title }} />
                                {item.content ? (
                                    <div className="td-portfolio-details-body" dangerouslySetInnerHTML={{ __html: item.content }} />
                                ) : (
                                    <p>Details coming soon.</p>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="td-portfolio-details-info" style={{ background: '#f8f8f8', padding: '30px', borderRadius: '10px' }}>
                                <h4 className="mb-25">Project Info</h4>
                                {item.date && (
                                    <div className="mb-20">
                                        <strong>Date:</strong>
                                        <p>{new Date(item.date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</p>
                                    </div>
                                )}
                                {item.category && (
                                    <div className="mb-20">
                                        <strong>Category:</strong>
                                        <p>{item.category}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
        </main>
    );
}
