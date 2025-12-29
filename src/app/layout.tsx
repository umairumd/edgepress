import type { Metadata } from "next";
import "react-toastify/dist/ReactToastify.css";
import "swiper/swiper-bundle.css";
import "@/styles/globals.scss";
import LayoutWrapper from "@/components/common/LayoutWrapper";
import { fontVarsClassName } from "./fonts";
import { getSiteUrl } from "@/lib/siteUrl";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  // Don't throw during build if SITE_URL is misconfigured.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Inoma Digital",
    template: "%s | Inoma Digital",
  },
  description: "Digital marketing, design, and technology partner.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Inoma Digital",
    description: "Digital marketing, design, and technology partner.",
    url: SITE_URL,
    siteName: "Inoma Digital",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inoma Digital",
    description: "Digital marketing, design, and technology partner.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={fontVarsClassName}>
      <head>
        {/* Static CSS from public folder */}
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        {/* Animations are non-critical for mobile LCP/FCP; load only on desktop */}
        <link rel="stylesheet" href="/assets/css/animate.css" media="(min-width: 992px)" />
        <link rel="stylesheet" href="/assets/css/fontawesome-all.min.css" />
        <link rel="stylesheet" href="/assets/css/defauls-spacing.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />
        {/* preload removed to avoid unused preload warning */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Inoma Digital",
                url: SITE_URL,
                logo: `${SITE_URL}/assets/img/logo/inoma-logo-light.png`,
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Inoma Digital",
                url: SITE_URL,
              },
            ]),
          }}
        />
      </head>
      <body>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
