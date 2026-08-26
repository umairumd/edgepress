import type { Metadata } from "next";
import Script from "next/script";
import "@/styles/globals.scss";
import LayoutWrapper from "@/components/common/LayoutWrapper";
import { fontVarsClassName } from "./fonts";
import { getSiteUrl } from "@/lib/siteUrl";

const SITE_URL = getSiteUrl();
const GTM_ID = (process.env.GTM_ID || "").trim();

export const metadata: Metadata = {
  // Don't throw during build if SITE_URL is misconfigured.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Inoma Digital",
    template: "%s | Inoma Digital",
  },
  description: "Digital marketing, design, and technology partner.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [{ url: "/icon.png" }],
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
        {GTM_ID ? (
          <>
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
              src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
              strategy="lazyOnload"
            />
          </>
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "@id": "https://inomadigital.com/#organization",
              "name": "Inoma Digital",
              "url": "https://inomadigital.com",
              "logo": "https://inomadigital.com/assets/img/logo/inoma-logo-dark.png",
              "image": "https://inomadigital.com/assets/img/logo/inoma-og.jpg",
              "description": "Full-service digital agency specializing in web development, SEO, digital marketing, and brand strategy for US and international clients.",
              "foundingDate": "2019",
              "numberOfEmployees": {
                "@type": "QuantitativeValue",
                "minValue": 15
              },
              "email": "info@inomadigital.com",
              "sameAs": [
                "https://www.behance.net/inoma",
                "https://www.linkedin.com/company/inoma-digital",
                "https://www.facebook.com/inomadigital",
                "https://www.instagram.com/inomadigital"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Digital Agency Services",
                "itemListElement": [
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Web Development" }},
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "SEO Services" }},
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Digital Marketing" }},
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Business Strategy" }},
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "UI/UX Design" }},
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Graphics Design" }},
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "App Development" }},
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "E-Commerce Development" }}
                ]
              }
            })
          }}
        />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
