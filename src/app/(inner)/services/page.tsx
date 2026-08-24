import type { Metadata } from "next";
import BreadcrumbTwo from "@/components/common/BreadcrumbTwo";
import ServiceArea from "@/components/pages/services/service/ServiceArea";
import ServiceItem from "@/components/pages/services/service/ServiceItem";
import Brand from "@/components/common/Brand";
import { getServices } from "@/lib/wp";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Services",
  description:
    "Discover Inoma Digital's full suite of digital services, strategy, SEO, web design, and marketing solutions built to scale your digital presence.",
    alternates: { canonical: "/services" },
};

export default async function ServicePage() {
    const services = await getServices();

    return (
        <main>
            <BreadcrumbTwo
                sub_title="STRATEGY-DRIVEN PARTNER"
                 title={<>Experience <br /> <span className="td-accent-blue">Best Service</span></>}
                desc="We deliver a complete range of digital services designed to support long-term business growth. Our approach combines strategy, creativity, and execution to help brands build a strong presence, attract the right audience, and scale with confidence. Every service we offer is aligned with measurable outcomes and real business needs."
            />
            <ServiceArea services={services} />
            <ServiceItem />
            <Brand style={true} />
        </main>
    );
}
