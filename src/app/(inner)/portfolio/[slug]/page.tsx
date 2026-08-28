import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPortfolioItem, getPortfolioItems } from "@/lib/wp";
import { getSiteUrl } from "@/lib/siteUrl";
import { stripHtml, normalizeCanonical, formatDate } from "@/lib/utils";
import Cta from "@/components/common/Cta";
import DisableRightClick from "@/components/common/DisableRightClick";
import parse, { Element } from "html-react-parser";
import PortfolioLongImage from "@/components/pages/portfolio-details/PortfolioLongImage";
import PortfolioFocusMode from "@/components/pages/portfolio-details/PortfolioFocusMode";

const SITE_URL = getSiteUrl();
export const revalidate = 300;

export async function generateStaticParams() {
    // Fetch enough slugs so new items aren't silently omitted from static params.
    const items = await getPortfolioItems(200);
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
    const canonicalOrigin = new URL(SITE_URL).origin;
    const fallbackCanonical = `${SITE_URL}/portfolio/${slug}`;
    const canonical = item?.seo?.canonical
        ? normalizeCanonical(item.seo.canonical, canonicalOrigin, fallbackCanonical)
        : fallbackCanonical;
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

    const entryImageUrl = item.entryImage?.url || item.featuredImage?.url;
    const entryImageWidth =
        item.entryImage?.width ||
        item.featuredImage?.width || 1600;

    // If reported width is small (scaled version dimensions), use a large height
    // fallback so slice loading does not stop early on the full-res original.
    const entryImageHeight = (() => {
        const w = item.entryImage?.width;
        const h = item.entryImage?.height;
        if (!w || !h) return 4000;
        if (w < 600) {
            return Math.round(h * (1600 / w) * 1.2);
        }
        return h;
    })() || item.featuredImage?.height || 4000;
    const entryImageAlt = item.entryImage?.alt || item.featuredImage?.alt || stripHtml(item.title);
    const contentHtml = (item.content || "").trim();

    const content = contentHtml
        ? parse(contentHtml, {
            replace: (node) => {
                if (!(node instanceof Element)) return undefined;
                if (node.name === "img") return null;
                if (node.name === "figure") {
                    const className = node.attribs?.class || "";
                    if (className.includes("wp-block-image")) return null;
                }
                return undefined;
            },
        })
        : null;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: stripHtml(item.title),
        image: entryImageUrl,
        description: stripHtml(item.excerpt) || undefined,
        url: `${SITE_URL}/portfolio/${slug}`,
        author: { "@type": "Organization", name: "Inoma Digital" },
    };

    return (
        <main className="td-has-cta-footer">
            <DisableRightClick />
            <PortfolioFocusMode />
            <div className="td-portfolio-entry-area pb-120 pt-60">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="td-portfolio-entry-header mb-40">
                                <h1 className="td-portfolio-entry-title" dangerouslySetInnerHTML={{ __html: item.title }} />

                                {(item.categories?.length || item.date) ? (
                                    <div className="td-portfolio-entry-meta d-flex align-items-center flex-wrap">
                                        {item.categories?.map((cat) => (
                                            <span key={cat.slug || cat.name} className="td-portfolio-entry-meta-tag">
                                                {cat.name}
                                            </span>
                                        ))}
                                        {item.categories?.length && item.date ? (
                                            <span className="td-portfolio-entry-meta-sep" aria-hidden="true" />
                                        ) : null}
                                        {item.date ? (
                                            <time className="td-portfolio-entry-meta-date" dateTime={item.date}>
                                                {formatDate(item.date, "short")}
                                            </time>
                                        ) : null}
                                    </div>
                                ) : null}
                            </div>

                            <div id="td-portfolio-focus-anchor" aria-hidden="true" />
                            {content ? (
                                <div className="td-portfolio-content-wrap">
                                    <div className="td-portfolio-entry-content td-portfolio-content td-wp-content mb-40">
                                        {content}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {entryImageUrl ? (
                        <div className="td-portfolio-entry-image-wrap">
                            <PortfolioLongImage
                                src={entryImageUrl}
                                width={entryImageWidth || 1600}
                                height={entryImageHeight || 4000}
                                alt={entryImageAlt}
                            />
                        </div>
                    ) : (
                        <p>Project image coming soon.</p>
                    )}
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
