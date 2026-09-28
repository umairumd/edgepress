import type { Metadata } from "next";
import VideoTestimonialsCarousel from "@/components/home/VideoTestimonialsCarousel";
import { getVideoTestimonials } from "@/lib/wp";

export const metadata: Metadata = {
  title: "Client Testimonials",
  description:
    "See what our clients say about working with Inoma Digital — real video testimonials from businesses we've helped grow through Google Ads, SEO, Shopify, and web development.",
  alternates: { canonical: "/testimonials" },
  openGraph: {
    title: "Client Testimonials | Inoma Digital",
    description:
      "Real video testimonials from businesses we've helped grow through Google Ads, SEO, Shopify, and web development.",
    url: "/testimonials",
    type: "website",
  },
};

export const revalidate = 3600;

export default async function TestimonialsPage() {
  const videoTestimonials = await getVideoTestimonials();

  return (
    <main>
      <VideoTestimonialsCarousel
        testimonials={videoTestimonials}
        introText="Hear directly from business owners who partnered with Inoma Digital for Google Ads management, SEO, Shopify development, and web design. These are real clients, real campaigns, and real results."
      />
    </main>
  );
}
