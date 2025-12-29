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

export default function HomePage() {
    return (
        <main>
            <Hero />
            <About />
            <Service />
            <Portfolio />
            <VideoArea />
            <Pricing />
            <Testimonial />
            <Choose />
            <Team />
            <Counter />
        </main>
    );
}
