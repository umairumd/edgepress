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
import { getFeaturedPortfolios, getHeroSlides } from "@/lib/wp";

// Revalidate homepage every hour to pick up new featured portfolios and hero slides
export const revalidate = 3600;

export default async function HomePage() {
    // Fetch data at build time (ISR)
    const [featuredPortfolios, heroSlides] = await Promise.all([
        getFeaturedPortfolios(5),
        getHeroSlides(),
    ]);

    return (
        <main>
            <Hero slides={heroSlides} />
            <About />
            <Service />
            <Portfolio items={featuredPortfolios} />
            <VideoArea />
            <Pricing />
            <Testimonial />
            <Choose />
            <Team />
            <Counter />
        </main>
    );
}
