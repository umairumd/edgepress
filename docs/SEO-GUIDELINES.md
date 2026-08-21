# SEO Guidelines — Inoma Next.js Project

Internal engineering documentation for SEO governance and structural protection. All changes affecting URLs, redirects, sitemap, or metadata must align with these guidelines.

**Canonical domain:** `https://inomadigital.com`  
**www:** Redirects to non-www (handled at Vercel).  
**Trailing slash:** Normalized in middleware (no trailing slash except `/`).  
**Site URL / sitemap:** [src/lib/siteUrl.ts](src/lib/siteUrl.ts), [src/app/sitemap.ts](src/app/sitemap.ts).  
**Headless content:** Blog, portfolio, and team from WordPress via WPGraphQL.

---

## 1. Canonical Domain Policy

- **Non-www only.** Production canonical is `https://inomadigital.com`. No `https://www.inomadigital.com` as canonical.
- **No trailing slash** except for the root path `/`. All other URLs must be served and linked without a trailing slash.
- **308 permanent redirects only** for:
  - www → non-www (when applicable, e.g. at host/Vercel).
  - Trailing slash → no trailing slash (in middleware).
- **All canonical URLs must match sitemap output.** Metadata `alternates.canonical` and `metadataBase` must resolve to the same origin and path format as URLs in `sitemap.xml`. Use `getSiteUrl()` from [src/lib/siteUrl.ts](src/lib/siteUrl.ts) for consistency.

---

## 2. URL Structure Rules

- **Allowed top-level routes (static):**  
  `/`, `/about`, `/service`, `/portfolio`, `/portfolio/details`, `/team`, `/pricing`, `/faq`, `/contact`, `/blog`.  
  Add new top-level routes only when there is a dedicated, indexable page; add them to the sitemap and to this list.

- **Dynamic routes:**
  - **Blog:** `/blog/[slug]` — slugs from WordPress; invalid slug must call `notFound()`.
  - **Portfolio:** `/portfolio/[slug]` — slugs from WordPress; invalid slug must call `notFound()`.
  - **Service:** `/service/[slug]` — currently disabled (all slugs call `notFound()`). Future: allowlist or validation only.

- **No open catch-all dynamic routes returning 200.** Any route that accepts arbitrary path segments must validate (e.g. against CMS or allowlist) and call `notFound()` when invalid.

- **All invalid slugs must call `notFound()`.** Never render a generic template for an unknown slug with HTTP 200.

---

## 3. Middleware Governance

- **Trailing slash enforcement** is implemented in [src/middleware.ts](src/middleware.ts). Redirect paths ending with `/` (except `/`) to the same path without trailing slash using **308**.

- **Exclusions:** Middleware must not run for:
  - `/_next/*` (Next.js internals)
  - `/api/*` (API routes)
  - Static files (paths containing a dot, e.g. `.js`, `.css`, `.png`, `.jpg`, `.svg`)

  Current matcher: `["/((?!_next|api|\\..*).*)"]`. Do not relax this; relaxing can cause redirects or failures for assets and API.

- **Do not casually modify the matcher.** Changes can expose `_next`, `api`, or static files to redirect logic and break the site. Any change requires testing of static assets, API routes, and app routes.

- **No duplicate redirect logic.** Redirect rules (trailing slash, and if added later, www) must live in one place (middleware or host config). Do not add equivalent redirects in `next.config`, layout, or other middleware without a clear reason and documentation.

---

## 4. Sitemap Governance

- **Only canonical URLs.** Every URL in the sitemap must be the single canonical URL for that page (non-www, no trailing slash). Sitemap is generated in [src/app/sitemap.ts](src/app/sitemap.ts).

- **No placeholder pages.** Do not add URLs for pages that are placeholders, “coming soon,” or non-indexable (e.g. `/blog-sidebar`). Exclude such routes from the sitemap.

- **No duplicate URLs.** Each URL must appear once. Static routes and dynamic routes (blog, portfolio) must not produce overlapping or duplicate entries.

- **Any new indexable service page must be added.** When adding a new top-level service route (e.g. `/service/strategy`), add it to the static routes array in `sitemap.ts` so it appears in the sitemap.

- **Must always use `getSiteUrl()`.** Base URL for sitemap entries must come from `getSiteUrl()` in [src/lib/siteUrl.ts](src/lib/siteUrl.ts). Do not hardcode the domain. Fallback is `https://inomadigital.com`.

---

## 5. 404 Policy

- **Must return real 404 status.** Unmatched routes and invalid dynamic slugs must result in HTTP 404. Next.js returns 404 when `notFound()` is called or when no route matches.

- **No auto-redirect to homepage.** The 404 page ([src/app/not-found.tsx](src/app/not-found.tsx)) must not automatically redirect users to `/`. Users may choose “Go Home” manually. Auto-redirect can confuse users and crawlers.

- **`notFound()` required for invalid dynamic routes.** In any dynamic segment (`[slug]`, `[id]`, etc.), if the slug/id is invalid (not in CMS, not in allowlist), call `notFound()` before rendering. Do not render a generic page with 200 for invalid slugs.

---

## 6. Dynamic Route Policy

- **Service slugs** must use an allowlist or server-side validation. Do not re-enable `/service/[slug]` to render for arbitrary slugs. Either:
  - Keep current behavior (all slugs → `notFound()`), or
  - Introduce a finite allowlist and call `notFound()` for any slug not in the list.

- **Future CMS-driven dynamic routes** (e.g. services from WordPress) must validate slug existence (e.g. fetch by slug; if null, call `notFound()`). Same pattern as blog and portfolio.

- **Never allow arbitrary slug rendering.** No route should render meaningful content for any string in a dynamic segment without validation. Unvalidated slugs must result in 404.

---

## 7. Service Page Development Rules (for future buildout)

When building out dedicated service pages:

- **Prefer static routes** where possible (e.g. `/service/strategy`, `/service/seo`) so each service has a stable URL and can be added to the sitemap explicitly.

- **Unique metadata per page:** Each service page must have its own `title`, `description`, and `alternates.canonical` (or `generateMetadata`). Do not reuse the same meta for multiple service URLs.

- **Unique H1 per page:** Each service page must have a single, page-specific H1 that describes the service. No duplicate H1s across service pages.

- **Internal linking:** Service pages should be linked from the main `/service` page and, where relevant, from other service pages or content. Avoid orphan pages.

- **Avoid thin or duplicate content.** Each service URL should have substantive, distinct content. Do not create multiple URLs that differ only by slug and show the same or near-identical content.

---

## 8. Headless WordPress Integration Guidelines

- **WordPress handles blog/portfolio (and team) slug generation.** Slugs and content come from WPGraphQL. Do not change how blog or portfolio slugs are resolved or how WP data is fetched for SEO-only changes unless explicitly required.

- **Canonical alignment must match WP slug.** For blog and portfolio, canonical URL must be `{SITE_URL}/blog/{slug}` or `{SITE_URL}/portfolio/{slug}` where `slug` is the WordPress slug. If WP provides a custom canonical (e.g. via Yoast), prefer it when present; otherwise use the URL pattern above.

- **Do not override SEO metadata from WP unless intentional.** Use WP-provided title, description, and OG data when available. Override only when there is a documented product or technical reason.

- **Ensure no duplicate rendering paths.** There must be a single URL per blog post and per portfolio item. Do not create alternate routes (e.g. `/blog/post/[slug]` and `/blog/[slug]`) that serve the same content.

---

## 9. Deployment & Verification Checklist

After any change that affects URLs, redirects, sitemap, or 404 behavior:

- **www → non-www:** If using Vercel (or similar) for www redirect, confirm `https://www.inomadigital.com/about` → 308 → `https://inomadigital.com/about`. No redirect for `https://inomadigital.com/about`.

- **Trailing slash redirects:**  
  `curl -sI https://inomadigital.com/about/` → 308, `Location: https://inomadigital.com/about`.  
  `curl -sI https://inomadigital.com/` → 200, no redirect.

- **Invalid service slug:**  
  `curl -sI https://inomadigital.com/service/any-slug` → 404.

- **404 behavior:**  
  `curl -sI https://inomadigital.com/nonexistent` → 404.  
  In browser: 404 page shows, no automatic redirect to `/`.

- **Sitemap canonical output:**  
  `curl -s https://inomadigital.com/sitemap.xml` — all URLs must use `https://inomadigital.com` (non-www) and no trailing slash. Confirm `/portfolio/details` and other static routes are present; no placeholder or duplicate URLs.

- **Redirect verification (curl examples):**
  - `curl -sI https://www.inomadigital.com/about` — expect 308 and non-www Location (if www redirect is on).
  - `curl -sI https://inomadigital.com/about/` — expect 308 and Location without trailing slash.
  - `curl -sI https://inomadigital.com/about` — expect 200.

Document any deviation (e.g. temporary redirect type or host-level only www) in this file or in a linked runbook.

---

## 10. Explicit Anti-Patterns (Never Do This)

Guardrails against “quick growth hacks” that harm SEO or structure:

- **Do not create city-based or location doorway pages** (e.g. `/shopify-development-usa`, `/shopify-development-texas`) unless there is real, substantive content differentiation per page. Same applies to other geo or thin variants.

- **Do not duplicate service pages with only minor keyword variation.** One service = one canonical URL with distinct content. No near-duplicate URLs that differ only by keyword or phrasing.

- **Do not create query-based indexable URLs** (e.g. `/service?type=seo`) without canonical control. Indexable pages must have a stable path and a single canonical URL. Use path-based routes for indexable content.

- **Do not introduce catch-all routes** (e.g. `[...slug]`) without strict validation. Every segment must be validated; invalid paths must call `notFound()`. Prefer explicit static or single-segment dynamic routes.

- **Do not override WordPress canonical** (or other WP SEO metadata) unless there is a documented, intentional reason. Default to WP-provided canonicals for blog and portfolio.

---

## 11. Internal Linking Policy

SEO and crawlability depend on internal links. Apply when adding or scaling indexable pages (especially service pages):

- **Every new indexable page must have:**
  - At least one link from a higher-level page (e.g. `/service` linking to `/service/strategy`, or homepage/primary nav).
  - At least one contextual internal link in the body (not only footer or global nav).

- **No orphan pages allowed.** Every indexable URL must be reachable by following links from the homepage or a known entry point. Add new pages to the sitemap and to at least one in-content or nav link.

- **Avoid excessive exact-match anchor repetition.** Vary anchor text for the same target where it fits naturally. Do not repeat the same keyword-heavy anchor across many links.

---

## 12. Metadata Governance

Every indexable page must have explicit, consistent metadata. Protects quality when scaling pages.

- **Every indexable page must define:**
  - `title`
  - `description`
  - `alternates.canonical`

- **Titles** must not exceed ~60 characters (display truncation in SERPs). Keep them unique and descriptive.

- **Descriptions** must not exceed ~160 characters. Unique per page; no boilerplate reuse across many URLs.

- **Open Graph URL** must match the canonical URL. Use the same base URL and path (from `getSiteUrl()` and the page path). No divergent `og:url` and canonical.

- **No duplicate titles across service pages.** Each service URL must have a distinct `title`. Same for other page types where multiple URLs exist.
