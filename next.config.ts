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

function hostsFromEnv(input?: string): string[] {
  if (!input) return [];
  // Support either a single URL/host OR a comma-separated list of hosts/urls.
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => hostFromUrl(s))
    .filter((h): h is string => Boolean(h));
}

// Prefer explicit media domain(s), otherwise infer from WP GraphQL endpoint (local dev friendly).
// NOTE: some WP setups serve media from a different host than the GraphQL endpoint, so we allow multiple.
const wpMediaHosts = Array.from(
  new Set([
    ...hostsFromEnv(process.env.WP_MEDIA_DOMAIN),
    hostFromUrl(process.env.WP_GRAPHQL_ENDPOINT),
  ].filter((h): h is string => typeof h === "string" && h.length > 0))
);

const nextConfig: NextConfig = {
  // Next.js 16 enables Turbopack by default for `next dev` / `next build`.
  // There is no next.config boolean to disable it (no experimental.turbo: false).
  // Opt out via CLI: `next dev --webpack` (see package.json "dev" script).
  // Experimental optimizations for faster CSS loading
  experimental: {
    // Inline critical CSS to reduce render-blocking
    optimizeCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Allow custom quality values (65 for hero slider, 75 default)
    qualities: [65, 75],
    // Cache optimized images for 30 days (reduces re-compression)
    minimumCacheTTL: 2592000,
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      ...(wpMediaHosts.length
        ? wpMediaHosts.flatMap((hostname) => [
            { protocol: "https" as const, hostname },
            { protocol: "http" as const, hostname },
          ])
        : []),
    ],
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
