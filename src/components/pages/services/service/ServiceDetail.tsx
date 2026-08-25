import Image from "next/image";
import Link from "next/link";
import type { ServiceDetail } from "@/lib/wp";

interface ServiceSectionProps {
    heading?: string;
    text?: string;
    imageUrl?: string;
    imageSide: "left" | "right";
    hasText: boolean;
    hasImage: boolean;
    index: number;
}

function ServiceSection({
    heading,
    text,
    imageUrl,
    imageSide,
    hasText,
    hasImage,
}: ServiceSectionProps) {
    const bannerImage = imageUrl ? (
        <div className="td-service-detail-image-wrap">
            <Image
                src={imageUrl}
                alt={heading ?? ""}
                width={600}
                height={450}
                sizes="(max-width: 768px) 100vw, 80vw"
                style={{ width: "100%", height: "auto" }}
                loading="lazy"
            />
        </div>
    ) : null;

    const splitImage = imageUrl ? (
        <div className="td-service-detail-image-wrap">
            <Image
                src={imageUrl}
                alt={heading ?? ""}
                width={600}
                height={450}
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ width: "100%", height: "auto" }}
                loading="lazy"
            />
        </div>
    ) : null;

    const textCol = (
        <div className={`col-lg-${hasImage ? 6 : 7}`}>
            <div className="td-service-detail-text-wrap">
                {heading && (
                    <h2 className="td-service-detail-section-heading mb-25">{heading}</h2>
                )}
                {text && (
                    <div
                        className="td-service-detail-body"
                        dangerouslySetInnerHTML={{ __html: text }}
                    />
                )}
            </div>
        </div>
    );

    const imageCol = splitImage ? (
        <div className="col-lg-6">{splitImage}</div>
    ) : null;

    // Case B — heading only + image: stacked banner
    if (hasImage && heading && !text) {
        return (
            <div className="td-service-detail-section mb-80">
                <div className="row justify-content-center">
                    <div className="col-lg-8 offset-lg-2 text-center">
                        <div className="td-service-detail-text-wrap">
                            <h2 className="td-service-detail-section-heading mb-25">{heading}</h2>
                        </div>
                    </div>
                    <div className="col-12">
                        {bannerImage}
                    </div>
                </div>
            </div>
        );
    }

    // Case C — image only
    if (hasImage && !hasText) {
        return (
            <div className="td-service-detail-section mb-80">
                <div className="row justify-content-center">
                    <div className="col-lg-10 offset-lg-1">
                        {bannerImage}
                    </div>
                </div>
            </div>
        );
    }

    // Case A — body + image (50/50); Case D — text only (centered col-lg-8)
    return (
        <div className="td-service-detail-section mb-80">
            <div className={`row align-items-center${!hasImage ? " justify-content-center" : ""}`}>
                {hasImage && imageSide === "left"
                    ? <>{imageCol}{textCol}</>
                    : <>{textCol}{imageCol}</>
                }
            </div>
        </div>
    );
}

type SectionIndex = 1 | 2 | 3;

function getSectionData(service: ServiceDetail, n: SectionIndex) {
    const headingKey = `section${n}Heading` as keyof ServiceDetail;
    const textKey = `section${n}Text` as keyof ServiceDetail;
    const imageUrlKey = `section${n}ImageUrl` as keyof ServiceDetail;
    const imageSideKey = `section${n}ImageSide` as keyof ServiceDetail;

    return {
        heading: service[headingKey] as string | undefined,
        text: service[textKey] as string | undefined,
        imageUrl: service[imageUrlKey] as string | undefined,
        imageSide: (service[imageSideKey] as "left" | "right" | undefined) ?? "right",
    };
}

interface Props {
    service: ServiceDetail;
}

export default function ServiceDetailComponent({ service }: Props) {
    const sections: SectionIndex[] = [1, 2, 3];

    return (
        <div className="td-service-detail-area pt-40 pb-120">
            <div className="container">

                {sections.map((n) => {
                        const { heading, text, imageUrl, imageSide } = getSectionData(service, n);
                        const hasText = Boolean(heading || text);
                        const hasImage = Boolean(imageUrl);

                        if (!hasText && !hasImage) return null;

                        return (
                            <ServiceSection
                                key={n}
                                heading={heading}
                                text={text}
                                imageUrl={imageUrl}
                                imageSide={imageSide}
                                hasText={hasText}
                                hasImage={hasImage}
                                index={n}
                            />
                        );
                    })}

                    {(service.ctaHeading || service.ctaButtonLabel) && (
                        <div className="td-service-detail-cta text-center pt-80">
                            {service.ctaHeading && (
                                <h2 className="mb-30">{service.ctaHeading}</h2>
                            )}
                            <Link href="/contact" className="td-btn-2 td-btn-primary">
                                {service.ctaButtonLabel ?? "Get In Touch"}
                            </Link>
                        </div>
                    )}

            </div>
        </div>
    );
}
