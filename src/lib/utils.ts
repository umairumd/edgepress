export function stripHtml(html?: string | null): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
}

/** Rewrite a canonical URL onto the site origin while preserving path/search/hash. */
export function normalizeCanonical(
  url: string,
  canonicalOrigin: string,
  fallback: string
): string {
  try {
    const u = new URL(url);
    const origin = new URL(canonicalOrigin);
    u.protocol = origin.protocol;
    u.hostname = origin.hostname;
    u.port = origin.port;
    return u.toString();
  } catch {
    return fallback;
  }
}

export type FormatDateStyle = "upper-short" | "short" | "long" | "numeric-short";

export function formatDate(
  dateString?: string | null,
  style: FormatDateStyle = "short",
  locale = "en-US"
): string {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (style === "upper-short") {
      return d
        .toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" })
        .toUpperCase();
    }
    if (style === "long") {
      return d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
    }
    if (style === "numeric-short") {
      return d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
    }
    return d.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return dateString;
  }
}
