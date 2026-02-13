import type { Metadata } from "next";
import BreadcrumbOne from "@/components/common/BreadcrumbOne";
import PortfolioArea from "@/components/pages/portfolio/PortfolioArea";
import { getPortfolioItems } from "@/lib/wp";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore Inoma Digital's portfolio to see how our web design, development, SEO, branding, and digital marketing solutions drive real business results.",
    alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
    const items = await getPortfolioItems();
    return (
        <main>
            <BreadcrumbOne
          
                title={
                    <>
                        Where Strategy Meets{" "}
                        <span
                            className="td-accent-blue"
                            style={{ fontFamily: "var(--td-ff-dm)", fontStyle: "italic", fontWeight: 400 }}
                        >
                            Execution
                        </span>
                    </>
                }
                description="This portfolio highlights selected projects across branding, web development, digital marketing, and growth systems. Each project represents a structured approach — aligning strategy, design, and execution to solve real business problems and deliver measurable outcomes."
                className="td-breadcrumb--portfolio"
                variant="about"
            />
            <PortfolioArea items={items} />
        </main>
    );
}
