import type { MetadataRoute } from "next";
import { getPosts, getPortfolioItems } from "@/lib/wp";

import { getSiteUrl } from "@/lib/siteUrl";

const SITE_URL = getSiteUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/about", "/service", "/portfolio", "/portfolio/details", "/team", "/pricing", "/faq", "/contact", "/blog"].map((route) => ({
    url: `${SITE_URL}${route || "/"}`,
    lastModified: new Date(),
  }));

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  const [posts, portfolio] = await Promise.all([getPosts(50), getPortfolioItems(50)]);

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

  return [...staticRoutes, ...dynamicRoutes];
}

