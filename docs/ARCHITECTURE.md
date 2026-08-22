# Architecture

This document combines CMS request flow, routing, and About-page performance notes.

## CMS Browser Request Audit


**Scope:** Entire `src` directory. No files were modified.

---

## 1. Search results summary

| Search term | Findings in `src` |
|-------------|-------------------|
| `https://cms.inomadigital.com` / `cms.inomadigital.com` | [src/middleware.ts](src/middleware.ts), [src/app/layout.tsx](src/app/layout.tsx), [src/app/api/img/slice/route.ts](src/app/api/img/slice/route.ts) |
| `wp-content` | [src/styles/globals.scss](src/styles/globals.scss) (CSS class names only, e.g. `.td-wp-content`), [src/middleware.ts](src/middleware.ts) (in redirect API URL: `/wp-json/...`) |
| `wp-json` | [src/middleware.ts](src/middleware.ts) only (redirect API path) |
| `fetch("http` | None |
| `axios` | None |
| `useEffect` fetching WordPress | None (no client-side WP fetch in `src`) |
| Direct `<img src="https://cms` | None (no literal string; see “Blog post body HTML” below for dynamic case) |
| `<video>` / `<audio>` / media tags using CMS URLs | None |
| next/image `remotePatterns` | [next.config.ts](next.config.ts) (root, not under `src`) — builds `remotePatterns` from `WP_MEDIA_DOMAIN` / `WP_GRAPHQL_ENDPOINT` |

---

## 2. Findings (file, snippet, server vs client, browser → CMS?)

### 2.1 Middleware — redirect API

**File:** [src/middleware.ts](src/middleware.ts)

**Snippet:**
```ts
const REDIRECT_API_URL = "https://cms.inomadigital.com/wp-json/inomadigital/v1/redirects";
// ...
const res = await fetch(REDIRECT_API_URL, { cache: "no-store" });
```

**Server vs client:** **Server (Edge).** Next.js middleware runs in the Edge runtime. The `fetch` is issued by the Edge runtime when handling the request, not by the user’s browser.

**Browser connects directly to cms.inomadigital.com?** **No.** The browser only talks to the app origin. The Edge server fetches from the CMS; the browser never sees the CMS URL.

---

### 2.2 Root layout — preconnect

**File:** [src/app/layout.tsx](src/app/layout.tsx)

**Snippet:**
```tsx
<link rel="preconnect" href="https://cms.inomadigital.com" />
<link rel="dns-prefetch" href="https://cms.inomadigital.com" />
```

**Server vs client:** These are emitted by the server and instruct the **browser** to preconnect to `cms.inomadigital.com` when it will later request that origin. They do not themselves perform a request.

**Browser connects directly to cms.inomadigital.com?** Only if some other resource on the page actually uses a URL on that origin (see 2.5).

---

### 2.3 API route — image slice

**File:** [src/app/api/img/slice/route.ts](src/app/api/img/slice/route.ts)

**Snippet:**
```ts
out.add("cms.inomadigital.com");  // in allowedHosts()
// Route fetches image from URL in query (e.g. CMS URL), processes with sharp, returns image.
```

**Server vs client:** **Server (Node).** The route runs on the server. The browser requests `/api/img/slice?src=...` from the **app** origin. The server fetches the source image (e.g. from CMS) and returns the slice.

**Browser connects directly to cms.inomadigital.com?** **No.** The browser only requests the app’s `/api/img/slice` URL.

---

### 2.4 WordPress data (GraphQL, hero slides, posts, portfolio, etc.)

**File:** [src/lib/wp.ts](src/lib/wp.ts) — used from Server Components and from [sitemap](src/app/sitemap.ts), etc.

**Snippet (concept):** All WP data is fetched via `fetch(WP_GRAPHQL_ENDPOINT, ...)` or similar inside `wp.ts`. Callers are server-only (e.g. `getPost`, `getPosts`, `getHeroSlides`, `getPortfolioItem` in page components or sitemap).

**Server vs client:** **Server only.** No `useEffect` or client-side fetch to WordPress in `src`. No axios. No `fetch("http..."` in app code.

**Browser connects directly to cms.inomadigital.com?** **No.** All WP API calls are from the Next server/Edge to the CMS.

---

### 2.5 Blog post body HTML (WpContent)

**Files:**  
- [src/app/(inner-cta)/blog/[slug]/page.tsx](src/app/(inner-cta)/blog/[slug]/page.tsx) — passes `post.content` to `BlogSidebarArea`.  
- [src/components/pages/blog-sidebar/BlogSidebarArea.tsx](src/components/pages/blog-sidebar/BlogSidebarArea.tsx) — passes `contentHtml` to `WpContent`.  
- [src/components/common/WpContent.tsx](src/components/common/WpContent.tsx) — renders that HTML with `dangerouslySetInnerHTML={{ __html: html }}`.

**Snippet (WpContent):**
```tsx
return <div ref={rootRef} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
```

**Server vs client:** The HTML is produced on the **server** (from `post.content` from WP). It is then sent to the **client** and rendered in the **browser**. Any `<img src="...">` in that HTML is loaded by the **browser**.

**Browser connects directly to cms.inomadigital.com?** **Yes, when the post content contains such URLs.** WordPress often returns post content with image URLs like `https://cms.inomadigital.com/wp-content/uploads/...`. If that HTML is rendered as-is, the browser will request those image URLs **directly** from `cms.inomadigital.com`. There is no rewrite or proxy in the codebase that replaces those `src` values with app-origin URLs for blog body content.

**Conclusion:** On **blog post detail pages** (`/blog/[slug]`) that include inline images in the body, the browser can and often will connect directly to `cms.inomadigital.com` to load those images.

---

### 2.6 Portfolio detail content (parsed HTML, not raw)

**File:** [src/app/(inner)/portfolio/[slug]/page.tsx](src/app/(inner)/portfolio/[slug]/page.tsx)

**Snippet (concept):** Portfolio body content is parsed with `html-react-parser` and **`<img>` nodes are replaced** with `PortfolioLongImage`, which uses `src={sliceUrl(...)}` → `/api/img/slice?src=...`. So the browser only ever requests the app’s slice API.

**Server vs client:** Server builds the React tree; browser renders it and requests `/api/img/slice` (app origin).

**Browser connects directly to cms.inomadigital.com?** **No.** All portfolio content images go through the app’s slice API.

---

### 2.7 Next/Image and other explicit image usage

- **Next/Image** with `src` from WP (e.g. featured images, hero slides, team thumbs): the browser requests `/_next/image?url=...` from the **app** origin. The Next server (or Edge) fetches from the CMS and returns the image. **Browser does not connect to CMS** for these.
- **PortfolioLongImage:** uses `<img src={sliceUrl(...)}>` where `sliceUrl` points to `/api/img/slice?...`. **Browser does not connect to CMS.**
- **Raw `<img>` in `src`:** All other `<img>` usages in `src` use local paths (e.g. `/assets/...`) or data from static/API that is not a direct CMS URL in `src`. The only place where arbitrary HTML (and thus potential CMS image URLs) is rendered is **blog body content** (2.5).

---

## 3. Client-side fetch to WordPress

- **None.** No `fetch("http...`)`, no `axios`, no `useEffect` that fetches from WordPress in `src`. All WP data is fetched server-side in `wp.ts` or in API routes / middleware.

---

## 4. Raw `<img>` / tags using CMS URLs directly

- **Explicit in code:** No literal `<img src="https://cms...">` in `src`.
- **Dynamic:** **Yes** — blog post body HTML rendered by `WpContent` can contain `<img src="https://cms.inomadigital.com/...">`. When that HTML is injected, the browser loads those URLs **directly** from the CMS. No proxy or Next/Image is used for those inline body images.

---

## 5. Dynamic import / script loading from CMS

- **None.** No dynamic import or script in `src` that loads from `cms.inomadigital.com`.

---

## 6. Pages embedding CMS media without Next/Image

- **Blog post detail** (`/blog/[slug]`): body content is rendered as raw HTML via `WpContent`. Any images in that HTML that use full CMS URLs are loaded by the browser directly from the CMS (no Next/Image, no proxy).
- **Portfolio detail** (`/portfolio/[slug]`): content images are replaced with `PortfolioLongImage` → `/api/img/slice`, so they do **not** embed CMS media directly in the browser.
- **Home, about, team, etc.:** WP-sourced media is used via Next/Image or static/local assets; no direct CMS embed in the browser.

---

## 7. Direct answers

**Does the browser ever directly connect to cms.inomadigital.com?**  
**Yes.**

**Where?**  
On **blog post detail pages** (`/blog/[slug]`) when the post body HTML contains `<img>` (or other resources) with `src` (or similar) pointing to `https://cms.inomadigital.com/...`. That HTML is rendered as-is by `WpContent`; the browser then requests those URLs directly from the CMS. There is no rewrite or proxy for blog body images.

**If no, confirm preconnect is unnecessary globally.**  
**N/A** — the browser **does** connect to the CMS on blog post pages when body content includes CMS image URLs. So a **global** preconnect is not “unnecessary”: it can still help on routes where the browser loads CMS resources (e.g. blog). Making preconnect **conditional** (e.g. only on blog/portfolio) remains a valid optimization so that non-blog routes (e.g. /about) do not preconnect when they never request the CMS; the audit does not change that.

---

## 8. Summary table

| Location | Request type | Server vs client | Browser → cms.inomadigital.com? |
|----------|--------------|------------------|----------------------------------|
| [src/middleware.ts](src/middleware.ts) | Fetch redirects API | Server (Edge) | No |
| [src/app/layout.tsx](src/app/layout.tsx) | Preconnect links | N/A (hint only) | Only if page has CMS resources |
| [src/app/api/img/slice/route.ts](src/app/api/img/slice/route.ts) | Slice API fetches image | Server (Node) | No |
| [src/lib/wp.ts](src/lib/wp.ts) | GraphQL/data fetch | Server only | No |
| Blog body via [WpContent](src/components/common/WpContent.tsx) | Inline HTML with `<img>` | HTML sent to client; browser loads images | **Yes** (when body has CMS image URLs) |
| Portfolio body | Parsed; img → PortfolioLongImage → /api/img/slice | Server + client requests app API | No |
| Next/Image (featured, hero, team, etc.) | `/_next/image?url=...` | Browser → app; server → CMS | No |

No other files in `src` were found that cause the browser to request `cms.inomadigital.com` directly.


---





## SEO Routing Audit




**Project:** inoma-next (Next.js 16.1.1, App Router)  
**Audit date:** 2025  
**Scope:** Domain canonicalization, sitemap, robots.txt, canonical tags, 404 handling, status codes, duplicate routes, dynamic route risks.

---

## 1. Domain canonicalization

### 1.1 Is www or non-www enforced?

**No.** There is no application-level enforcement of www vs non-www.

- **No middleware** exists in the project (`middleware.ts` / `middleware.js` not present).
- **No redirects** are configured in `next.config.ts` (only security headers).
- **No `vercel.json`** (or other host config) was found in the repo for redirect rules.

**Conclusion:** Canonical host (www vs non-www) is **not** enforced in code. It must be configured at the host (e.g. Vercel “Redirects” or “Domains”) or CDN/proxy level.

### 1.2 Where redirect logic is implemented

| Location | Purpose |
|----------|--------|
| **Middleware** | None present. |
| **next.config.ts** | No `redirects()` or `async redirects()`. Only `headers()`. |
| **Server / host config** | No `vercel.json` or similar in repo. |

**File:** `next.config.ts`  
Only security headers are set; no redirect logic:

```ts
// next.config.ts (excerpt)
async headers() {
  return [
    {
      source: "/(.*)",
      headers: [
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        // ... no redirects
      ],
    },
  ];
}
```

### 1.3 301 vs 302

No redirects are implemented in the codebase, so there are no 301/302 rules to audit. Any canonical/redirect behavior would come from:

- Host (e.g. Vercel) redirects: recommend **301** for permanent canonicalization.
- Optional future middleware: use **308** (permanent) or **307** (temporary) for method-safe redirects.

---

## 2. Sitemap generation

### 2.1 Implementation

**File:** `src/app/sitemap.ts`

The sitemap is generated by the Next.js App Router `sitemap.ts` route handler.

### 2.2 Base URL

**Not hardcoded in the sitemap.** The base URL comes from `getSiteUrl()` in `src/lib/siteUrl.ts`:

```ts
// src/lib/siteUrl.ts
const FALLBACK_SITE_URL = "https://www.inomadigital.com";

export function getSiteUrl(): string {
  const envSite = (process.env.SITE_URL || "").trim();
  const vercelUrl = (process.env.VERCEL_URL || "").trim();
  const candidate = envSite || (vercelUrl ? `https://${vercelUrl}` : "");
  try {
    const u = new URL(candidate || FALLBACK_SITE_URL);
    return u.toString().replace(/\/$/, "");
  } catch {
    return FALLBACK_SITE_URL;
  }
}
```

- **Build/runtime:** `SITE_URL` → else `https://${VERCEL_URL}` → else `https://www.inomadigital.com`.
- **Sitemap** uses this same `getSiteUrl()` (see below), so base URL is consistent with the rest of the app.

### 2.3 Does the sitemap match the canonical domain?

**Yes.** Both sitemap and canonicals use `getSiteUrl()`:

- **Sitemap:** `src/app/sitemap.ts` — `const SITE_URL = getSiteUrl();` then `${SITE_URL}${route || "/"}` etc.
- **Root layout:** `src/app/layout.tsx` — `metadataBase: new URL(SITE_URL)` and `alternates.canonical: "/"` (relative, resolved with `metadataBase`).
- **Per-page metadata** use relative `canonical` (e.g. `"/about"`) or absolute URLs built from `SITE_URL` in dynamic pages.

So the sitemap base URL and canonical domain are aligned **as long as `SITE_URL` (or fallback) is set to the same host you want as canonical** (e.g. `https://www.inomadigital.com`).

### 2.4 Sitemap contents (code reference)

```ts
// src/app/sitemap.ts (excerpt)
const staticRoutes = ["", "/about", "/service", "/portfolio", "/team", "/pricing", "/faq", "/contact", "/blog"].map((route) => ({
  url: `${SITE_URL}${route || "/"}`,
  lastModified: new Date(),
}));
// + blog posts from getPosts(50), portfolio from getPortfolioItems(50)
```

- **Not in sitemap:** `/portfolio/details`, `/blog-sidebar`. Add them if they are public, indexable URLs.

---

## 3. robots.txt

**File:** `src/app/robots.ts`

```ts
import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

const SITE_URL = getSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- **Allow:** `"/"` for all user agents.
- **Sitemap:** Uses same `getSiteUrl()` as sitemap and metadata, so `sitemap.xml` URL matches the canonical domain.
- No `disallow` rules; no separate rules for specific bots unless you add them later.

---

## 4. Canonical tags & metadata

### 4.1 Global metadata

**File:** `src/app/layout.tsx`

- **metadataBase:** `new URL(SITE_URL)` — so all relative URLs in metadata (including `alternates.canonical`) resolve to the same origin as sitemap/robots.
- **Default canonical:** `alternates: { canonical: "/" }` → resolves to `SITE_URL` (e.g. `https://www.inomadigital.com/`).
- **Default title template:** `template: "%s | Inoma Digital"`.
- **Open Graph / Twitter:** Set with `url: SITE_URL` and relative image paths (resolved via `metadataBase`).

```ts
// src/app/layout.tsx (excerpt)
const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Inoma Digital", template: "%s | Inoma Digital" },
  // ...
  alternates: { canonical: "/" },
  openGraph: { url: SITE_URL, ... },
};
```

### 4.2 Per-page canonical

| Page / type | File | Canonical |
|-------------|------|-----------|
| Home | `(home)/page.tsx` | `alternates: { canonical: "/" }` |
| About | `(inner)/about/page.tsx` | `alternates: { canonical: "/about" }` |
| Service | `(inner)/service/page.tsx` | `alternates: { canonical: "/service" }` |
| Portfolio list | `(inner)/portfolio/page.tsx` | `alternates: { canonical: "/portfolio" }` |
| Pricing | `(inner)/pricing/page.tsx` | `alternates: { canonical: "/pricing" }` |
| FAQ | `(inner)/faq/page.tsx` | `alternates: { canonical: "/faq" }` |
| Contact | `(inner)/contact/page.tsx` | `alternates: { canonical: "/contact" }` |
| Blog list | `(inner-cta)/blog/page.tsx` | `alternates: { canonical: "/blog" }` |
| Team | `(inner-cta)/team/page.tsx` | `alternates: { canonical: "/team" }` |
| Blog post | `(inner-cta)/blog/[slug]/page.tsx` | `generateMetadata`: `canonical = post?.seo?.canonical \|\| \`${SITE_URL}/blog/${slug}\`` |
| Portfolio item | `(inner)/portfolio/[slug]/page.tsx` | `generateMetadata`: `canonical = item?.seo?.canonical \|\| \`${SITE_URL}/portfolio/${slug}\`` |

- **Static pages:** Use relative `canonical`; Next resolves them with `metadataBase` → same domain as sitemap.
- **Dynamic (blog/portfolio):** Use absolute canonical from CMS when present, otherwise `SITE_URL/blog/{slug}` or `SITE_URL/portfolio/{slug}`.

**Conclusion:** Canonicals use the same `getSiteUrl()`-derived domain and match the sitemap base URL. Ensure `SITE_URL` (or host redirect) enforces the chosen canonical host (e.g. www).

---

## 5. 404 handling

### 5.1 Non-existent routes — HTTP status

- **App Router behavior:** When no route matches (e.g. `/nonexistent-page`), Next.js serves the `not-found` UI and returns **HTTP 404**.
- **Custom not-found UI:** `src/app/not-found.tsx` is used for that response.

So non-existent routes **do not** return 200; they return **404** with the custom 404 page.

### 5.2 Does the site send everything to homepage with 200?

**No.** Unmatched routes get the 404 page and a **404 status**, not a redirect to the homepage in the initial HTTP response.

### 5.3 Client-side redirect to homepage (UX only)

**File:** `src/app/not-found.tsx`

```tsx
"use client";
// ...
useEffect(() => {
  const timer = setTimeout(() => {
    router.replace("/");
  }, 2000);
  return () => clearTimeout(timer);
}, [router]);
```

- **After 2 seconds,** the user is client-side redirected to `/`.
- **HTTP response** for the 404 request is still **404**; the redirect does not change that.
- For SEO this is fine (crawlers see 404). For UX you may prefer to keep users on the 404 page and not auto-redirect.

---

## 6. Pages that return 200 when they should return 404

### 6.1 Dynamic routes that correctly call `notFound()`

- **Blog:** `src/app/(inner-cta)/blog/[slug]/page.tsx` — `if (!post) return notFound();` → 404 for unknown slugs.
- **Portfolio:** `src/app/(inner)/portfolio/[slug]/page.tsx` — `if (!item) return notFound();` → 404 for unknown slugs.

So `/blog/unknown-slug` and `/portfolio/unknown-slug` correctly return **404** when the CMS has no matching post/item.

### 6.2 Route that always returns 200: `/service/[slug]`

**File:** `src/app/(inner-cta)/service/[slug]/page.tsx`

- No `notFound()`.
- No `generateStaticParams()` or slug validation.
- Any path like `/service/foo`, `/service/bar`, `/service/anything` renders the same template and returns **200**.

So **any** `/service/:slug` URL returns **200** even when “foo” or “bar” is not a real service. That can create:

- Soft 404s (pages that look like content but are generic).
- Many URLs with duplicate or thin content.

**Recommendation:** If “services” are a finite set from a CMS or config, fetch by slug and call `notFound()` when missing. If the page is intentionally a single template for all slugs, consider noindex or consolidating to one URL (e.g. `/service`) and using query or hash for variation.

---

## 7. Duplicate route patterns (trailing slash vs non-trailing slash)

- **Next.js default:** Trailing slash is **not** added by default (e.g. `/about` and `/about/` can both exist unless configured otherwise).
- **next.config.ts:** No `trailingSlash: true` (or similar), so the app uses default behavior.
- **getSiteUrl():** Strips trailing slash: `return u.toString().replace(/\/$/, "");` — so sitemap and canonicals use no trailing slash.

**Recommendation:** If the host (e.g. Vercel) does not normalize trailing slashes, add a single canonical form (e.g. no trailing slash) in middleware or host config and redirect the other form (301) to avoid duplicate URLs.

---

## 8. Dynamic routes and infinite URL risk

### 8.1 Blog and portfolio

- **Blog:** `generateStaticParams()` returns a finite list from `getPosts(30)`. Requests for slugs not in that list still hit the page; `getPost(slug)` then runs and `notFound()` is called if missing → **404**. No infinite URL generation.
- **Portfolio:** Same idea with `getPortfolioItems(200)` and `getPortfolioItem(slug)` + `notFound()`.

So `/blog/[slug]` and `/portfolio/[slug]` do **not** generate infinite URLs; they are bounded by CMS data and return 404 for unknown slugs.

### 8.2 Service slug

- **`/service/[slug]`** does not validate the slug. Every string is accepted and returns 200. So in theory an infinite set of URLs (e.g. `/service/1`, `/service/2`, …) could be requested and all return 200. That is the only route with “infinite URL” risk in practice; fixing it (e.g. validate slug and call `notFound()`) also addresses the “200 where you want 404” issue above.

### 8.3 Static vs dynamic overlap

- **`/portfolio/details`** is a **static** route: `(inner)/portfolio/details/page.tsx`.
- **`/portfolio/[slug]`** is dynamic.
- Next.js matches the more specific segment first, so `/portfolio/details` correctly serves the static details page, not the dynamic slug page. No conflict.

---

## STEP 2 — 404 behavior summary

| Scenario | HTTP status | Where |
|----------|-------------|--------|
| Non-existent path (e.g. `/no-such-page`) | **404** | Next App Router + `src/app/not-found.tsx` |
| Unknown blog slug | **404** | `blog/[slug]/page.tsx` → `notFound()` |
| Unknown portfolio slug | **404** | `portfolio/[slug]/page.tsx` → `notFound()` |
| Any `/service/:slug` | **200** | `service/[slug]/page.tsx` (no `notFound()`) |

The site does **not** send everything to the homepage with 200. Only unmatched routes and blog/portfolio unknown slugs get 404. The 404 page then triggers a **client-side** redirect to `/` after 2 seconds; the initial response remains 404.

---

## STEP 3 — Canonical & metadata system (Next 13+ App Router)

### Global

- **File:** `src/app/layout.tsx`
- **metadataBase:** `new URL(getSiteUrl())` → one base for all relative URLs.
- **Default canonical:** `alternates.canonical: "/"` (home).
- **Title template:** `"%s | Inoma Digital"`.
- **OG/Twitter:** Use `SITE_URL` and relative paths; resolved via `metadataBase`.

### Per-page

- **Static pages:** Export `metadata` with `alternates: { canonical: "/path" }` (relative). Resolved with `metadataBase` → same domain as sitemap.
- **Dynamic (blog/portfolio):** `generateMetadata()` builds:
  - `canonical = cms.seo.canonical || \`${SITE_URL}/blog|portfolio/${slug}\``
  - `alternates: { canonical }`, `openGraph.url: canonical`.

### Consistency

- Canonical domain is driven by **`getSiteUrl()`** (env + fallback `https://www.inomadigital.com`).
- Sitemap, robots, and metadata all use that same helper, so **canonical domain matches sitemap** as long as `SITE_URL` (or fallback) is the intended canonical host.
- **Enforced domain:** Not enforced in app code; must be set via `SITE_URL` and/or host-level redirect (e.g. non-www → www with 301).

---

## Recommendations (short)

1. **Canonical host:** Add middleware or host (e.g. Vercel) redirects so either www or non-www is the single canonical host (301).
2. **Sitemap:** Add `/portfolio/details` and `/blog-sidebar` if they are indexable.
3. **404 page:** Consider removing or increasing the 2s auto-redirect to home so users can stay on the 404 page if desired.
4. **`/service/[slug]`:** Validate slug (e.g. against CMS or allowlist) and call `notFound()` when invalid so those URLs return 404 instead of 200.
5. **Trailing slash:** If the host doesn’t normalize, add a single convention (e.g. no trailing slash) and redirect the other (301) in middleware or host config.

---

*End of audit.*


---





## About Page Performance Plan




Prioritized by impact. Only code snippets where changes are required. No changes to WordPress fetching, routing, SEO metadata, or sitemap.

---

## High impact

### 1. LCP: Ensure hero image is the true LCP and is not delayed

**Root cause:** The hero image in AboutArea is the largest above-the-fold content and is the true LCP element, but:
- Its wrapper uses **wow.js** (`wow fadeInLeft` + `data-wow-delay=".5s"`), which delays visibility until the animation runs and adds ~1.8s “element render delay.”
- The image has `priority` and explicit `width`/`height` but is missing **`fetchPriority="high"`** so the browser may not prioritize it.
- **`data-speed=".9"`** on the Image is typically for parallax; it does not need to be on the LCP image and can be removed to avoid any JS that might affect paint.

**File:** [src/components/pages/about/AboutArea.tsx](src/components/pages/about/AboutArea.tsx)

**Changes:**

1. **Remove animation from the LCP image wrapper** so the image can paint immediately. Keep only layout/visual classes.

   **Before:**
   ```tsx
   <div className="td-about-main-thumb mb-40 fix td-rounded-10 wow fadeInLeft" data-wow-delay=".5s" data-wow-duration="1s">
   ```

   **After:**
   ```tsx
   <div className="td-about-main-thumb mb-40 fix td-rounded-10">
   ```

2. **Add `fetchPriority="high"`** and **remove `data-speed`** from the LCP Image.

   **Before:**
   ```tsx
   <Image
       data-speed=".9"
       className="w-100 td-rounded-10"
       src="/assets/img/about/main/inoma-about-1.jpg"
       ...
       priority
       sizes="(max-width: 992px) 100vw, 40vw"
   ```

   **After:**
   ```tsx
   <Image
       className="w-100 td-rounded-10"
       src="/assets/img/about/main/inoma-about-1.jpg"
       alt="About Inoma Digital - Full-service digital agency with 7+ years of experience"
       width={650}
       height={650}
       priority
       fetchPriority="high"
       sizes="(max-width: 992px) 100vw, 40vw"
   ```

**Checklist:** Hero image is the LCP element; wrapper has no wow.js/fadeIn; image has `priority`, `fetchPriority="high"`, and explicit `width`/`height`; no CSS/JS on this element delays render (animation removed).

---

### 2. Accessibility: Discernible link names (same file)

Two icon-only “Contact” links fail the “Links do not have a discernible name” audit.

**Change:** Add `aria-label="Contact us"` to both circle links.

```tsx
<Link className="td-btn-circle about-brand-circle" href="/contact" aria-label="Contact us">
    <IconArrowRight />
</Link>
```
(Apply to both instances around lines 49 and 53.)

---

## Medium impact

### 3. Third-party scripts (GTM, and Facebook via GTM)

**Current state:**
- **GTM:** Loaded in root layout as `<GoogleTagManager gtmId="GTM-MMSWN6S" />` from `@next/third-parties/google`. That component uses `next/script` internally and does **not** accept a `strategy` prop (see [node_modules/@next/third-parties/dist/types/google.d.ts](node_modules/@next/third-parties/dist/types/google.d.ts) — `GTMParams` has no strategy).
- **Facebook Pixel:** Not present in the repo; it is almost certainly loaded **via GTM** (e.g. fbevents.js). So GTM load time controls when Facebook loads.

**Behavior:** `next/script` without an explicit strategy defaults to **`afterInteractive`** in the App Router, so GTM (and thus Facebook) likely already load after the page is interactive. No code change is strictly required for “afterInteractive.”

**Optional hardening:** If you want to **defer further** (e.g. `lazyOnload`) to reduce TBT on slow devices, you must replace the third-party component with a small custom GTM loader using `next/script` and `strategy="lazyOnload"`. Tracking still works; events can be pushed to `dataLayer` before the script loads and will fire when GTM loads. Example:

```tsx
// In layout.tsx, replace <GoogleTagManager gtmId="GTM-MMSWN6S" /> with:
import Script from "next/script";

// In body:
<Script id="gtm-init" strategy="lazyOnload">
  {`(function(w,l){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});})(window,'dataLayer');`}
</Script>
<Script id="gtm" src="https://www.googletagmanager.com/gtm.js?id=GTM-MMSWN6S" strategy="lazyOnload" />
```

Use `sendGTMEvent` from `@next/third-parties/google` only if you rely on it; otherwise keep pushing to `window.dataLayer` as today. **Recommendation:** Treat this as optional; only do it if Lighthouse still flags GTM as a long task after the high-impact LCP and preconnect changes.

---

### 4. Preconnect: Conditional on routes that use CMS

**Finding:** `/about` does **not** request `cms.inomadigital.com` in the browser. The page uses `getTestimonials()` from WP at **build/ISR time** (server-side). No client-side requests go to the CMS on /about, so the preconnect in root layout is unused there and Lighthouse reports “Unused preconnect.”

**Recommendation:** Make preconnect conditional so it only appears on routes that load CMS assets (blog, portfolio). Other routes (about, service, team, pricing, etc.) should not send it.

**Minimal implementation:**

1. **Remove** preconnect/dns-prefetch for `cms.inomadigital.com` from [src/app/layout.tsx](src/app/layout.tsx) (delete the two `<link>` lines).

2. **Add** the same preconnect only in layouts that wrap blog and portfolio:
   - [src/app/(inner-cta)/blog/layout.tsx](src/app/(inner-cta)/blog/layout.tsx) (create if missing)
   - [src/app/(inner)/portfolio/layout.tsx](src/app/(inner)/portfolio/layout.tsx) (create if missing)

**Blog layout** — create `src/app/(inner-cta)/blog/layout.tsx`:

```tsx
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://cms.inomadigital.com" />
      <link rel="dns-prefetch" href="https://cms.inomadigital.com" />
      {children}
    </>
  );
}
```

**Portfolio layout** — create `src/app/(inner)/portfolio/layout.tsx` with the same two `<link>` tags and `{children}`.

Next will hoist these `<link>` elements into `<head>` for `/blog`, `/blog/[slug]`, `/portfolio`, and `/portfolio/[slug]` only. No preconnect on /about or other pages.

---

## Optional / lower priority

### 5. Header logo images: explicit width and height

Lighthouse flags logo `<img>`s without dimensions (CLS). In [HeaderSix.tsx](src/components/layout/HeaderSix.tsx) and [Offcanvas.tsx](src/components/layout/headers/Menu/Offcanvas.tsx), add `width` and `height` to each logo `<img>` (e.g. `width={180}` `height={40}` or actual asset dimensions). Improves CLS and diagnostics; impact is smaller than LCP and preconnect.

### 6. Render-blocking CSS and unused JS

- **CSS:** Next.js chunk CSS and layout-loaded bootstrap/main.css block render. `experimental.optimizeCss: true` is already set. Further gains need route-level or component-level critical CSS and are out of scope for this plan.
- **Unused JS:** From Next chunks and third parties (GTM, Facebook). Reducing it implies code-splitting and possibly deferring more third-party code; no minimal change suggested here.

---

## Summary

| Priority   | Item                          | Action |
|-----------|---------------------------------|--------|
| High      | LCP hero image                  | Remove wow.js from wrapper; add `fetchPriority="high"`; remove `data-speed`. |
| High      | Accessibility (contact links)   | Add `aria-label="Contact us"` to both circle links. |
| Medium    | Third-party scripts             | GTM already likely `afterInteractive`. Optional: custom GTM with `lazyOnload` if needed. |
| Medium    | Preconnect                     | Remove from root layout; add only in blog and portfolio layouts. |
| Optional  | Logo dimensions, CSS/JS tuning | Add logo width/height; leave render-blocking and unused JS for later. |

Implement High first, then Medium; Optional when convenient. No changes to WordPress fetching, routing, SEO metadata, or sitemap.
