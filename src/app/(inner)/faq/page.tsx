import type { Metadata } from "next";
import BreadcrumbTwo from "@/components/common/BreadcrumbTwo";
import FaqArea from "@/components/pages/faq/FaqArea";

export const metadata: Metadata = {
    title: "FAQ",
    description: "Answers to common questions about Inoma Digital, our packages, process, and how we deliver growth.",
};

export default function FaqPage() {
    return (
        <main>
            <BreadcrumbTwo
                sub_title="OUR FAQ"
                title={<>Frequently asked <br /> <span>question</span></>}
                desc="Have questions? We have answers. Explore our frequently asked questions to find information about our services, process, and how we can help your business thrive."
            />
            <FaqArea />
        </main>
    );
}
