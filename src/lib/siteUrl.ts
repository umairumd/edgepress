const FALLBACK_SITE_URL = "https://www.inomadigital.com";

/**
 * Returns a valid absolute site URL to use in metadata/canonicals.
 * - Prefers SITE_URL if it is a valid absolute URL.
 * - Falls back to VERCEL_URL (provided by Vercel) if present.
 * - Otherwise uses FALLBACK_SITE_URL.
 */
export function getSiteUrl(): string {
  const envSite = (process.env.SITE_URL || "").trim();
  const vercelUrl = (process.env.VERCEL_URL || "").trim();
  const candidate = envSite || (vercelUrl ? `https://${vercelUrl}` : "");

  try {
    // If candidate is empty or invalid, this will throw and we'll fall back.
    const u = new URL(candidate || FALLBACK_SITE_URL);
    // Normalize to no trailing slash for consistent concatenation.
    return u.toString().replace(/\/$/, "");
  } catch {
    return FALLBACK_SITE_URL;
  }
}
