import InnerHeader from "@/components/layout/InnerHeader";
import FooterSix from "@/components/layout/FooterSix";

export default function InnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <InnerHeader />
            <div id="smooth-wrapper">
                <div id="smooth-content">
                    {children}
                    <FooterSix />
                </div>
            </div>
        </>
    );
}
