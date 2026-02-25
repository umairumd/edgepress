import type { Metadata } from "next";
import Script from "next/script";
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
  // Canonical URL - tells search engines this is the main URL for this page
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Inoma Digital",
    description: "Digital marketing, design, and technology partner.",
    url: SITE_URL,
    siteName: "Inoma Digital",
    type: "website",
    images: [
      {
        url: "/assets/img/logo/inoma-og.jpg",
        width: 1200,
        height: 630,
        alt: "Inoma Digital - Digital Marketing, Design & Technology Partner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inoma Digital",
    description: "Digital marketing, design, and technology partner.",
    images: ["/assets/img/logo/inoma-og.jpg"],
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
        {/* Hero background is now pure CSS gradient - no preload needed */}
        {/* Critical CSS - loaded synchronously */}
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        {/* Font Awesome removed - using inline SVG icons instead (saves ~82 KiB) */}
        <link rel="stylesheet" href="/assets/css/defauls-spacing.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />
        {/* Non-critical CSS - deferred until after first paint using preload */}
        <link
          rel="preload"
          href="/assets/css/animate.css"
          as="style"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              requestAnimationFrame(function(){
                var l=document.createElement('link');
                l.rel='stylesheet';
                l.href='/assets/css/animate.css';
                document.head.appendChild(l);
              });
            `,
          }}
        />
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
        <Script id="gtm-init" strategy="lazyOnload">
          {`
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
  });
`}
        </Script>
        <Script
          id="gtm"
          src="https://www.googletagmanager.com/gtm.js?id=GTM-MMSWN6S"
          strategy="lazyOnload"
        />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
