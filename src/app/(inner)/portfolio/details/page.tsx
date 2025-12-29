import PortfolioBreadcrumb from "@/components/pages/portfolio-details/PortfolioBreadcrumb";
import PortfolioDetailsArea from "@/components/pages/portfolio-details/PortfolioDetailsArea";
import PortfolioThumbArea from "@/components/pages/portfolio-details/PortfolioThumbArea";
import PortfolioVisualIdentity from "@/components/pages/portfolio-details/PortfolioVisualIdentity";

export default function PortfolioDetailsPage() {
    return (
        <main>
            <PortfolioBreadcrumb />
            <PortfolioDetailsArea />
            <PortfolioThumbArea />
            <PortfolioVisualIdentity />
        </main>
    );
}
