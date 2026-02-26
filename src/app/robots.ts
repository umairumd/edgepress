import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

const SITE_URL = getSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: [
          "/*?*",
          "/feed/",
          "*/feed/",
          "/comments/",
          "/search/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}