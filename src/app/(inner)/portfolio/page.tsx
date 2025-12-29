import type { Metadata } from "next";
import BreadcrumbOne from "@/components/common/BreadcrumbOne";
import PortfolioArea from "@/components/pages/portfolio/PortfolioArea";
import { getPortfolioItems } from "@/lib/wp";

export const revalidate = 300;

export const metadata: Metadata = {
    title: "Portfolio",
    description: "Browse selected work by Inoma Digital — strategy-led projects built for real business results.",
};

export default async function PortfolioPage() {
    const items = await getPortfolioItems();
    return (
        <main>
            <BreadcrumbOne
                sub_title="LATEST PORTFOLIO"
                title={<>Classic <span>grid</span></>}
            />
            <PortfolioArea items={items} />
        </main>
    );
}
