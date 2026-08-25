import type { MetadataRoute } from "next";
import { getPosts, getPortfolioItems, getServices } from "@/lib/wp";

import { getSiteUrl } from "@/lib/siteUrl";

const SITE_URL = getSiteUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    ...["", "/about", "/services", "/portfolio", "/team", "/pricing", "/faq", "/contact", "/blog"].map((route) => ({
      url: `${SITE_URL}${route || "/"}`,
      lastModified: new Date(),
    })),
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  const [posts, portfolio, services] = await Promise.all([
    getPosts(50),
    getPortfolioItems(50),
    getServices(),
  ]);

  if (posts?.length) {
    dynamicRoutes = dynamicRoutes.concat(
      posts.map((p) => ({
        url: `${SITE_URL}/blog/${p.slug}`,
        lastModified: p.date ? new Date(p.date) : new Date(),
      }))
    );
  }

  if (portfolio?.length) {
    dynamicRoutes = dynamicRoutes.concat(
      portfolio.map((p) => ({
        url: `${SITE_URL}/portfolio/${p.slug}`,
        lastModified: p.date ? new Date(p.date) : new Date(),
      }))
    );
  }

  if (services?.length) {
    dynamicRoutes = dynamicRoutes.concat(
      services.map((service) => ({
        url: `${SITE_URL}/services/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }))
    );
  }

  return [...staticRoutes, ...dynamicRoutes];
}

