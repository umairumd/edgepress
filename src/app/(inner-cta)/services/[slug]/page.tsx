import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getService, getServices } from "@/lib/wp";
import { getSiteUrl } from "@/lib/siteUrl";
import { stripHtml, normalizeCanonical } from "@/lib/utils";
import ServiceDetailComponent from "@/components/pages/services/service/ServiceDetail";
import Brand from "@/components/common/Brand";

const SITE_URL = getSiteUrl();

export const revalidate = 300;

export async function generateStaticParams() {
    const services = await getServices();
    return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const service = await getService(slug);
    if (!service) return {};

    const title = service.seo?.title ? stripHtml(service.seo.title) : service.title;
    const description = service.seo?.metaDesc
        ? stripHtml(service.seo.metaDesc)
        : service.excerpt
            ? stripHtml(service.excerpt)
            : undefined;
    const canonicalOrigin = new URL(SITE_URL).origin;
    const fallbackCanonical = `${SITE_URL}/services/${slug}`;
    const canonical = service.seo?.canonical
        ? normalizeCanonical(service.seo.canonical, canonicalOrigin, fallbackCanonical)
        : fallbackCanonical;
    const image = service.seo?.opengraphImage?.url;
    const ogTitle = service.seo?.opengraphTitle ? stripHtml(service.seo.opengraphTitle) : title;
    const ogDesc = service.seo?.opengraphDescription
        ? stripHtml(service.seo.opengraphDescription)
        : description;
    const twitterTitle = service.seo?.twitterTitle ? stripHtml(service.seo.twitterTitle) : title;
    const twitterDesc = service.seo?.twitterDescription
        ? stripHtml(service.seo.twitterDescription)
        : description;
    const twitterImage = service.seo?.twitterImage?.url || image;

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

export default async function ServiceDetailPage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const service = await getService(slug);
    if (!service) notFound();

    return (
        <main>
            <div className="td-service-breadcrumb-hero">
                <div className="container">
                    <div className="td-service-hero-inner">

                        <div className="td-service-hero-text">
                            <nav aria-label="Breadcrumb" className="td-service-hero-trail">
                                <ol>
                                    <li><Link href="/">Home</Link></li>
                                    <li><Link href="/services">Services</Link></li>
                                </ol>
                            </nav>
                            <h1 className="td-service-hero-title">
                                {service.title}
                            </h1>
                        </div>

                        {service.iconUrl && (
                            <div className="td-service-hero-icon" aria-hidden="true">
                                <img
                                    src={service.iconUrl}
                                    alt=""
                                    width={80}
                                    height={80}
                                    style={{ objectFit: "contain" }}
                                />
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {service.heroHeadline && (
                <div className="td-service-hero-headline-wrap">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-9 text-center">
                                <p className="td-service-detail-headline">
                                    {service.heroHeadline}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ServiceDetailComponent service={service} />
            <Brand style={true} />
        </main>
    );
}
