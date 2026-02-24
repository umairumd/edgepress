import type { Metadata } from "next";
import BreadcrumbTwo from "@/components/common/BreadcrumbTwo";
import PricingArea from "@/components/pages/pricing/PricingArea";
import PricingComparisonTable from "@/components/pricing/PricingComparisonTable";
import Faq from "@/components/pages/services/service-details/Faq";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Explore Inoma Digital's pricing for digital marketing, development, and strategy services. Choose transparent plans built to scale your business online.",
    alternates: { canonical: "/pricing" },
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
            <PricingComparisonTable />
            <Faq style={true} page="inner_faq" />
        </main>
    );
}
