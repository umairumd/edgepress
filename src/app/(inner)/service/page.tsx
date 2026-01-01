import type { Metadata } from "next";
import BreadcrumbTwo from "@/components/common/BreadcrumbTwo";
import ServiceArea from "@/components/pages/services/service/ServiceArea";
import ServiceItem from "@/components/pages/services/service/ServiceItem";
import Brand from "@/components/common/Brand";

export const metadata: Metadata = {
    title: "Services",
    description:
        "Explore Inoma Digital services: strategy, design, development, marketing, SEO, and more — all aligned to measurable growth outcomes.",
    alternates: { canonical: "/service" },
};

export default function ServicePage() {
    return (
        <main>
            <BreadcrumbTwo
                sub_title="STRATEGY-DRIVEN PARTNER"
                title={<>Experience <br /> The <span>Best Service </span></>}
                desc="We deliver a complete range of digital services designed to support long-term business growth. Our approach combines strategy, creativity, and execution to help brands build a strong presence, attract the right audience, and scale with confidence. Every service we offer is aligned with measurable outcomes and real business needs."
            />
            <ServiceArea />
            <ServiceItem />
            <Brand style={true} />
        </main>
    );
}
