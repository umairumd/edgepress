import type { Metadata } from "next";
import AboutArea from "@/components/pages/about/AboutArea";
import Feature from "@/components/pages/about/Feature";
import Testimonial from "@/components/pages/about/Testimonial";
import Founders from "@/components/pages/about/Founders";
import Awards from "@/components/pages/about/Awards";
import { getTestimonials } from "@/lib/wp";

export const metadata: Metadata = {
    title: "About",
    description: "Learn about Inoma Digital — a strategy-led growth and creative partner helping brands design, build, and grow with clarity.",
    alternates: { canonical: "/about" },
};

// Revalidate about page every hour to pick up new testimonials
export const revalidate = 3600;

export default async function AboutPage() {
    // Fetch testimonials at build time (ISR)
    const testimonials = await getTestimonials(10);

    return (
        <main>
            <AboutArea />
            <Testimonial testimonials={testimonials} />
            <Feature />
            <Founders />
            <Awards />
        </main>
    );
}
