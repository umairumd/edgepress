import AboutArea from "@/components/pages/about/AboutArea";
import Feature from "@/components/pages/about/Feature";
import Testimonial from "@/components/pages/about/Testimonial";
import Team from "@/components/pages/about/Team";
import Awards from "@/components/pages/about/Awards";

// Backup of the original About page before font testing.
// Not used by Next routing (only `page.tsx` is routed).
export default function AboutPageOriginal() {
  return (
    <main>
      <AboutArea />
      <Testimonial />
      <Feature />
      <Team />
      <Awards />
    </main>
  );
}


