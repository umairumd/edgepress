import "swiper/swiper-bundle.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <div id="smooth-wrapper">
                <div id="smooth-content">
                    {children}
                    <Footer style />
                </div>
            </div>
        </>
    );
}
