import type { NextConfig } from "next";

function hostFromUrl(url?: string) {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    return u.hostname;
  } catch {
    // fall back to stripping protocol/path
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
}

// Prefer explicit media domain, otherwise infer from WP GraphQL endpoint (local dev friendly).
const wpMediaHost = hostFromUrl(process.env.WP_MEDIA_DOMAIN) || hostFromUrl(process.env.WP_GRAPHQL_ENDPOINT);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: wpMediaHost
      ? [
        {
          protocol: "https",
          hostname: wpMediaHost,
        },
        {
          protocol: "http",
          hostname: wpMediaHost,
        },
      ]
      : [],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
