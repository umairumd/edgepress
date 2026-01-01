import "swiper/swiper-bundle.css";
import HeaderSix from "@/components/layout/HeaderSix";
import FooterSix from "@/components/layout/FooterSix";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <HeaderSix />
            <div id="smooth-wrapper">
                <div id="smooth-content">
                    {children}
                    <FooterSix />
                </div>
            </div>
        </>
    );
}
