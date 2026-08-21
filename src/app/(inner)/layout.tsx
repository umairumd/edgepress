import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function InnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header variant="default" />
            <div id="smooth-wrapper">
                <div id="smooth-content">
                    {children}
                    <Footer />
                </div>
            </div>
        </>
    );
}
