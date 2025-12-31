import type { Metadata } from "next";
import AboutArea from "@/components/pages/about/AboutArea";
import Feature from "@/components/pages/about/Feature";
import Testimonial from "@/components/pages/about/Testimonial";
import Founders from "@/components/pages/about/Founders";
import Awards from "@/components/pages/about/Awards";

export const metadata: Metadata = {
    title: "About",
    description: "Learn about Inoma Digital — a strategy-led growth and creative partner helping brands design, build, and grow with clarity.",
};

export default function AboutPage() {
    return (
        <main>
            <AboutArea />
            <Testimonial />
            <Feature />
            <Founders />
            <Awards />
        </main>
    );
}
