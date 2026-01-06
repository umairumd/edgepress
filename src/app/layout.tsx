import type { Metadata } from "next";
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
  icons: {
    icon: [{ url: "/inoma-favicon.jpg", type: "image/jpeg" }],
    apple: [{ url: "/inoma-favicon.jpg" }],
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
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={fontVarsClassName}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/inoma-favicon.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/inoma-favicon.jpg" />
        {/* Preload Font Awesome fonts to prevent CLS */}
        <link rel="preload" href="/assets/fonts/fa-solid-900.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/fonts/fa-regular-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/fonts/fa-brands-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* Static CSS from public folder */}
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/animate.css" />
        <link rel="stylesheet" href="/assets/css/fontawesome-all.min.css" />
        <link rel="stylesheet" href="/assets/css/fontawesome-display.css" />
        <link rel="stylesheet" href="/assets/css/defauls-spacing.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />
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
      <body suppressHydrationWarning>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
