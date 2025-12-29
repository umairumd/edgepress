import type { Metadata } from "next";
import BreadcrumbTwo from "@/components/common/BreadcrumbTwo";
import PricingArea from "@/components/pages/pricing/PricingArea";
import Faq from "@/components/pages/services/service-details/Faq";

export const metadata: Metadata = {
    title: "Pricing",
    description:
        "Choose an outcome-based package built as a complete growth system — designed for visibility, demand generation, and long-term scale.",
};

export default function PricingPage() {
    return (
        <main>
            <BreadcrumbTwo
                sub_title="OUR PRICING PLANS"
                title={<>Our suitable pricing<br /> plans <span>for you</span></>}
                desc="Pick the perfect plan for your business needs. We offer flexible pricing options designed to help you scale and succeed in the digital landscape."
            />
            <PricingArea />
            <Faq style={true} page="inner_faq" />
        </main>
    );
}
