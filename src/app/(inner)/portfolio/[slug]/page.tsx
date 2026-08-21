import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPortfolioItem, getPortfolioItems } from "@/lib/wp";
import Image from "next/image";
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
    const isDev = process.env.NODE_ENV !== "production";

    const toLikelyOriginalUrl = (url: string) => {
        try {
            const u = new URL(url);
            u.pathname = u.pathname
                .replace(/-\d+x\d+(?=\.(?:png|jpe?g|webp|gif)$)/i, "")
                .replace(/-scaled(?=\.(?:png|jpe?g|webp|gif)$)/i, "")
                .replace(/-rotated(?=\.(?:png|jpe?g|webp|gif)$)/i, "");
            return u.toString();
        } catch {
            return url
                .replace(/-\d+x\d+(?=\.(?:png|jpe?g|webp|gif)$)/i, "")
                .replace(/-scaled(?=\.(?:png|jpe?g|webp|gif)$)/i, "")
                .replace(/-rotated(?=\.(?:png|jpe?g|webp|gif)$)/i, "");
        }
    };

    const entryImage = item.entryImage?.url || item.featuredImage?.url;
    const entryAlt = item.entryImage?.alt || item.featuredImage?.alt || stripHtml(item.title);
    const entryWidth = item.entryImage?.width || item.featuredImage?.width || 1600;
    const entryHeight = item.entryImage?.height || item.featuredImage?.height || 4000;
    const contentHtml = (item.content || "").trim();
    const contentHasImages = /<img\b/i.test(contentHtml);
    const excerptText = stripHtml(item.excerpt);

    const content = contentHtml
        ? parse(contentHtml, {
            replace: (node) => {
                if (node instanceof Element && node.name === "img") {
                    const attribs = node.attribs || {};
                    const rawSrc =
                        attribs["data-orig-file"] ||
                        attribs["data-large-file"] ||
                        attribs["data-full-url"] ||
                        attribs["data-src"] ||
                        attribs["src"] ||
                        "";
                    if (!rawSrc) return undefined;
                    const src = toLikelyOriginalUrl(rawSrc);
                    const alt = attribs["alt"] || "";
                    const wAttr = attribs["width"] ? parseInt(attribs["width"], 10) : NaN;
                    const hAttr = attribs["height"] ? parseInt(attribs["height"], 10) : NaN;
                    const w = Number.isFinite(wAttr) ? wAttr : undefined;
                    const h = Number.isFinite(hAttr) ? hAttr : undefined;

                    const ratio = w && h ? h / w : undefined;
                    const isLong = (ratio && ratio >= 2.2) || (h && h >= 2200) || !h || !w;

                    // For portfolio case studies, prefer the optimized slice renderer.
                    // If the image isn't actually long, the slice endpoint will stop after the first slice.
                    // If WP reports a small "thumbnail-ish" height (like 1024), don't trust it.
                    // Let the component load slices until the slice API returns 416 (end of image).
                    const trustHeight = Boolean(h && h >= 2200);
                    if (isLong) return <PortfolioLongImage src={src} alt={alt} width={w} height={trustHeight ? h : undefined} />;

                    return <PortfolioLongImage src={src} alt={alt} width={w} height={h} sliceHeight={900} />;
                }
                // Preserve everything else as-is
                return undefined;
            },
        })
        : null;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: stripHtml(item.title),
        image: entryImage,
        description: stripHtml(item.excerpt) || undefined,
        url: `${SITE_URL}/portfolio/${slug}`,
        author: { "@type": "Organization", name: "Inoma Digital" },
    };

    return (
        <main className="td-has-cta-footer">
            <DisableRightClick />
            <PortfolioFocusMode />
            <div className="td-portfolio-entry-area pb-120 pt-120">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
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

                                {excerptText ? (
                                    <p className="td-portfolio-entry-excerpt">{excerptText}</p>
                                ) : null}
                            </div>

                            <div id="td-portfolio-focus-anchor" aria-hidden="true" />
                            {content ? (
                                <div className="td-portfolio-entry-content td-wp-content mb-40">{content}</div>
                            ) : null}

                            {/* If the WP content already contains the long screenshot/gallery images,
                                don't render the featured image again at the bottom. */}
                            {!contentHasImages && entryImage ? (
                                <div className="td-portfolio-entry-image-wrap">
                                    <Image
                                        className="w-100 td-portfolio-entry-image"
                                        src={entryImage}
                                        alt={entryAlt}
                                        width={entryWidth}
                                        height={entryHeight}
                                        sizes="(max-width: 1200px) 100vw, 1200px"
                                        style={{ height: "auto" }}
                                        quality={100}
                                        priority
                                        unoptimized={isDev && entryImage.startsWith("http")}
                                    />
                                </div>
                            ) : !contentHtml ? (
                                <p>Project image coming soon.</p>
                            ) : null}
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
