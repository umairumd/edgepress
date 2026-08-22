import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Service from "@/components/home/Service";
import Portfolio from "@/components/home/Portfolio";
import VideoArea from "@/components/home/VideoArea";
import Pricing from "@/components/home/Pricing";
import Testimonial from "@/components/home/Testimonial";
import Choose from "@/components/home/Choose";
import Team from "@/components/home/Team";
import Counter from "@/components/home/Counter";
import Cta from "@/components/common/Cta";
import VideoTestimonialsCarousel from "@/components/home/VideoTestimonialsCarousel";
import { getFeaturedPortfolios, getHeroSlides, getTestimonials, getTeamMembers, getVideoTestimonials } from "@/lib/wp";

export const metadata: Metadata = {
  title: {
    absolute: "Inoma Digital | Full-Service Digital Marketing & Growth Agency",
  },
  description:
    "Inoma Digital is a full-service digital agency that helps businesses grow through marketing, SEO, social media, development, and brand creativity.",
  alternates: { canonical: "/" },
};

// Revalidate homepage every hour to pick up new featured portfolios and hero slides
export const revalidate = 3600;

export default async function HomePage() {
    // Fetch data at build time (ISR)
    const [featuredPortfolios, heroSlides, testimonials, teamMembers, videoTestimonials] = await Promise.all([
        getFeaturedPortfolios(5),
        getHeroSlides(),
        getTestimonials(10),
        getTeamMembers(20),
        getVideoTestimonials(),
    ]);

    // Preload first hero slide for faster LCP (React hoists <link> to <head>)
    const firstSlideUrl = heroSlides?.[0]?.url;
    const preloadUrl = firstSlideUrl
        ? `/_next/image?url=${encodeURIComponent(firstSlideUrl)}&w=256&q=65`
        : null;

    return (
        <>
            {/* Preload LCP image - React hoists this to <head> */}
            {preloadUrl && (
                <link
                    rel="preload"
                    as="image"
                    href={preloadUrl}
                    fetchPriority="high"
                />
            )}
            <main>
                <Hero slides={heroSlides} />
                <About />
                <Service />
                <Portfolio items={featuredPortfolios} />
                <VideoTestimonialsCarousel testimonials={videoTestimonials} />
                <VideoArea />
                <Pricing />
                <Testimonial testimonials={testimonials} />
                <Choose />
                <Team members={teamMembers} />
                <Counter />
                <Cta />
            </main>
        </>
    );
}
