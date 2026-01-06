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
        {/* Preconnect to WordPress media origin for faster image loading */}
        <link rel="preconnect" href="https://cms.inomadigital.com" />
        <link rel="dns-prefetch" href="https://cms.inomadigital.com" />
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
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
