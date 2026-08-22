# SEO

This document combines SEO guidelines, the maintenance guide, and the technical SEO cleanup plan.

## SEO Guidelines


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


---





## SEO Maintenance Guide




## Table of Contents
1. [Immediate Action Items](#immediate-action-items)
2. [What the Website Handles Automatically](#what-the-website-handles-automatically)
3. [What the SEO Expert Must Maintain in WordPress](#what-the-seo-expert-must-maintain-in-wordpress)
4. [Standard Operating Procedures (SOP)](#standard-operating-procedures-sop)
5. [Technical SEO Checklist](#technical-seo-checklist)

---

## Immediate Action Items

### 1. Google Search Console Setup

**Do you need to re-authenticate?**
- **If you kept the same domain** (`inomadigital.com`): No need to re-verify. Your existing property will work.
- **If you changed domains or subdomains**: Add the new property and verify ownership.

**Steps to verify (if needed):**
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add Property" → Enter `https://inomadigital.com`
3. Choose verification method:
   - **Recommended**: DNS TXT record (add via Cloudflare)
   - Alternative: HTML file upload to `/public` folder

### 2. Request Google to Recrawl Your New Website

**Option A: Submit Sitemap (Recommended)**
1. In Google Search Console → Sitemaps
2. Enter: `https://inomadigital.com/sitemap.xml`
3. Click "Submit"
4. Google will discover all pages automatically

**Option B: Request Indexing for Key Pages**
1. In Search Console → URL Inspection
2. Enter your homepage URL: `https://inomadigital.com`
3. Click "Request Indexing"
4. Repeat for key pages:
   - `/about`
   - `/service`
   - `/portfolio`
   - `/blog`
   - `/contact`

**Option C: Force Fresh Crawl**
1. URL Inspection → Enter URL
2. Click "Request Indexing" (even if already indexed)
3. This tells Google the page has changed

### 3. Update Bing Webmaster Tools
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add/verify your site if not already done
3. Submit sitemap: `https://inomadigital.com/sitemap.xml`

### 4. Cloudflare Considerations
Since your domain is managed via Cloudflare:
- Ensure **SSL/TLS is set to "Full (strict)"**
- Enable **"Always Use HTTPS"** in SSL/TLS → Edge Certificates
- Verify **no page rules** are blocking crawlers

---

## What the Website Handles Automatically

The Next.js frontend automatically manages these SEO elements:

| Feature | Implementation | Notes |
|---------|---------------|-------|
| **Dynamic Sitemap** | `/sitemap.xml` auto-generated | Includes all static pages + blog posts + portfolio items from WordPress |
| **Robots.txt** | `/robots.txt` auto-generated | Allows all crawlers, points to sitemap |
| **Canonical URLs** | Set on every page | Prevents duplicate content issues |
| **Meta Title & Description** | Per-page metadata | Falls back to Yoast SEO data from WordPress |
| **Open Graph Tags** | Auto-generated | Facebook/LinkedIn sharing previews |
| **Twitter Cards** | Auto-generated | Twitter sharing previews |
| **Structured Data (JSON-LD)** | Global + per-page | Organization, WebSite, BlogPosting, CreativeWork schemas |
| **Heading Hierarchy** | H1 → H2 → H3 structure | Semantic and accessible |
| **Image Optimization** | Next.js Image component | Auto WebP/AVIF, lazy loading, responsive sizes |
| **Performance Optimization** | Built-in | Fast LCP, minimal CLS, optimized CSS/JS |
| **Mobile Responsive** | Fully responsive design | Mobile-first approach |
| **HTTPS Enforcement** | Via Cloudflare/Vercel | All traffic encrypted |

### Sitemap Auto-Updates
The sitemap at `https://inomadigital.com/sitemap.xml` automatically includes:
- All static pages (Home, About, Service, Portfolio, Team, Pricing, FAQ, Contact, Blog)
- All WordPress blog posts (up to 50)
- All WordPress portfolio items (up to 50)

**No manual sitemap updates needed** — new content appears within the revalidation window (5 minutes for blog, 1 hour for portfolio).

---

## What the SEO Expert Must Maintain in WordPress

The SEO expert is responsible for content-level SEO in the WordPress CMS.

### Required WordPress Plugins
1. **Yoast SEO** (or RankMath) — for meta management
2. **WPGraphQL** — exposes content to frontend
3. **WPGraphQL for Yoast SEO** — exposes SEO fields to frontend

### Content SEO Responsibilities

#### For Every Blog Post:
| Field | Location | Priority |
|-------|----------|----------|
| **SEO Title** | Yoast → Title | Required |
| **Meta Description** | Yoast → Meta description | Required |
| **Focus Keyphrase** | Yoast → Focus keyphrase | Required |
| **Slug/URL** | Post → Permalink | Required |
| **Featured Image** | Post → Featured image | Required |
| **Image Alt Text** | Media library → Alt text | Required |
| **Internal Links** | Within content | Recommended |
| **Categories/Tags** | Post → Categories | Recommended |

#### For Every Portfolio Item:
| Field | Location | Priority |
|-------|----------|----------|
| **SEO Title** | Yoast → Title | Required |
| **Meta Description** | Yoast → Meta description | Required |
| **Project Name** | Title field | Required |
| **Featured Image** | Featured image with alt text | Required |
| **Entry Image** | Custom field (long screenshot) | Optional |

#### For Hero Slides, Testimonials, Team Members:
- Add descriptive **alt text** to all images
- Use real names and titles for team members

---

## Standard Operating Procedures (SOP)

### SOP 1: Publishing a New Blog Post

**Before Publishing:**
1. ✅ Write compelling, keyword-rich title (under 60 characters)
2. ✅ Write meta description (150-160 characters, include primary keyword)
3. ✅ Set focus keyphrase in Yoast
4. ✅ Use clean, keyword-rich slug (e.g., `/blog/digital-marketing-strategy`)
5. ✅ Add featured image with descriptive alt text
6. ✅ Add internal links to 2-3 related posts/pages
7. ✅ Check Yoast SEO score (aim for green)
8. ✅ Preview Open Graph appearance in Yoast

**After Publishing:**
1. ✅ Verify post appears on frontend `/blog` page (within 5 minutes)
2. ✅ Check sitemap includes new post: `/sitemap.xml`
3. ✅ Submit URL to Google Search Console for faster indexing
4. ✅ Share on social media

### SOP 2: Adding a New Portfolio Item

**Before Publishing:**
1. ✅ Write descriptive project title
2. ✅ Write meta description summarizing the project
3. ✅ Set clean slug (e.g., `/portfolio/brand-identity-xyz`)
4. ✅ Add featured image or entry image (high quality, optimized)
5. ✅ Add alt text to all images
6. ✅ Include project details in content (optional)

**After Publishing:**
1. ✅ Verify item appears on `/portfolio` page
2. ✅ Check it's marked as "Featured" if it should appear on homepage
3. ✅ Submit to Search Console if high-priority

### SOP 3: Monthly SEO Maintenance

**Weekly Tasks:**
- [ ] Review Google Search Console for crawl errors
- [ ] Check for 404 errors and fix/redirect
- [ ] Monitor Core Web Vitals in Search Console

**Monthly Tasks:**
- [ ] Review top-performing pages in Search Console
- [ ] Identify pages with declining traffic
- [ ] Update older blog posts with fresh content
- [ ] Check all images have alt text
- [ ] Review and respond to user feedback

**Quarterly Tasks:**
- [ ] Comprehensive keyword research
- [ ] Competitor analysis
- [ ] Content gap analysis
- [ ] Technical SEO audit
- [ ] Backlink profile review

### SOP 4: Image Optimization Guidelines

**Before Uploading to WordPress:**
1. Resize images to max 2000px width (unless portfolio long screenshots)
2. Compress using TinyPNG or Squoosh
3. Use descriptive filenames: `digital-marketing-strategy.jpg` not `IMG_1234.jpg`
4. Preferred formats: WebP (best) or JPEG (photos) or PNG (graphics)

**In WordPress:**
1. Add descriptive alt text (include keywords naturally)
2. Add caption if contextually helpful
3. Use "Full" size in content for quality

---

## Technical SEO Checklist

### Already Implemented ✅

- [x] **SSL Certificate** — HTTPS enforced via Cloudflare
- [x] **Mobile-Friendly Design** — Fully responsive
- [x] **Fast Page Speed** — Optimized images, CSS, JS
- [x] **XML Sitemap** — Auto-generated at `/sitemap.xml`
- [x] **Robots.txt** — Properly configured at `/robots.txt`
- [x] **Canonical URLs** — Set on all pages
- [x] **Semantic HTML** — Proper heading hierarchy (H1 → H2 → H3)
- [x] **Structured Data** — Organization, WebSite, BlogPosting, CreativeWork schemas
- [x] **Open Graph Tags** — Facebook/LinkedIn sharing
- [x] **Twitter Cards** — Twitter sharing previews
- [x] **Image Optimization** — Next.js auto-optimization
- [x] **Lazy Loading** — Images load on scroll
- [x] **Preconnect to CMS** — Faster image loading

### To Verify After Launch

- [ ] **Google Search Console** — Site verified and sitemap submitted
- [ ] **Bing Webmaster Tools** — Site verified and sitemap submitted
- [ ] **Google Analytics 4** — Tracking code installed (if applicable)
- [ ] **Core Web Vitals** — All metrics in "Good" range
- [ ] **No Broken Links** — Run Screaming Frog or Ahrefs crawler
- [ ] **No Duplicate Content** — Canonical tags working correctly
- [ ] **404 Page** — Custom 404 page with navigation

---

## Quick Reference: URLs to Know

| Resource | URL |
|----------|-----|
| Live Website | `https://inomadigital.com` |
| Sitemap | `https://inomadigital.com/sitemap.xml` |
| Robots.txt | `https://inomadigital.com/robots.txt` |
| WordPress Admin | `https://cms.inomadigital.com/wp-admin` |
| Google Search Console | `https://search.google.com/search-console` |
| Bing Webmaster Tools | `https://www.bing.com/webmasters` |

---

## Contact

For technical issues with the frontend (sitemap, structured data, page speed), contact the development team.

For content SEO (blog posts, meta descriptions, keywords), the SEO expert handles this in WordPress.

---

*Last Updated: January 2026*



---





## Technical SEO Cleanup Plan




**Project:** Next.js 16 App Router  
**Constraints:** No WordPress headless changes. No blog/portfolio route changes. No UI/layout changes. No risky rewrites. Production-safe, minimal.

**Production canonical:** `https://inomadigital.com` (non-www)  
**SITE_URL (env):** `https://inomadigital.com/`

---

## Exact Files to Modify

| # | File | Action |
|---|------|--------|
| 1 | `src/middleware.ts` | **Create** (new file) |
| 2 | `src/app/(inner-cta)/service/[slug]/page.tsx` | **Modify** |
| 3 | `src/app/not-found.tsx` | **Modify** |
| 4 | `src/app/sitemap.ts` | **Modify** |
| 5 | `src/lib/siteUrl.ts` | **Modify** |

---

## 1. Canonical Host Enforcement

**Requirement:** Redirect only `www.inomadigital.com` → `inomadigital.com` with **308**. No pattern-based host detection. No redirect for localhost. No redirect for `*.vercel.app`.

### Implementation

**File:** `src/middleware.ts` (create)

**Logic:**
- If `request.nextUrl.hostname === "www.inomadigital.com"`: build new URL with host `inomadigital.com` (same path, search, protocol), return `NextResponse.redirect(newUrl, 308)`.
- Else: continue (no redirect).

**Matcher (use exactly):**
```ts
export const config = {
  matcher: ["/((?!_next|api|\\..*).*)"],
};
```

**Confirmation:**
- **Static files:** Matcher excludes `_next`, `api`, and paths containing a dot (e.g. `.css`, `.js`, `.jpg`) — middleware does not run for them. No effect on static assets.
- **/api:** Excluded by matcher. No effect on API routes.
- **WordPress GraphQL:** Fetches are from server/server components to external WP URL; they do not go through this middleware. No effect.
- **Preview deployments:** Hostname is e.g. `xxx.vercel.app`, not `www.inomadigital.com`, so no redirect. No effect on previews.

**Code structure outline:**
- Import `NextResponse`, `NextRequest` from `next/server`.
- Single default export: `function middleware(request: NextRequest)`.
- Read `request.nextUrl`; if `hostname === "www.inomadigital.com"`, create URL with host `inomadigital.com`, return `NextResponse.redirect(url, 308)`.
- Otherwise return `NextResponse.next()`.
- Export `config` with the matcher above.

---

## 2. Trailing Slash Normalization

**Requirement:** No trailing slash except root `/`. Redirect e.g. `/about/` → `/about`, `/portfolio/sierra-success-story/` → `/portfolio/sierra-success-story` with **308**. Apply **after** host normalization. No loops. No effect on static assets, `/_next/*`, `/api/*`.

### Implementation

**File:** Same `src/middleware.ts`

**Logic (after host check):**
- If pathname is `"/"` exactly → do nothing, return `NextResponse.next()`.
- If pathname ends with `"/"` and length > 1 → build new URL with pathname = pathname without trailing slash (same origin, same search params), return `NextResponse.redirect(newUrl, 308)`.
- Else → return `NextResponse.next()`.

**Order in middleware:** (1) If www host → redirect to non-www (308). (2) Else if trailing slash (and not root) → redirect to no-slash (308). (3) Else next().

**Confirmation:**
- Static assets and `/api`, `/_next` already excluded by matcher. No effect.
- Root `/` is explicitly skipped for trailing-slash rule. No loop.
- Other paths with trailing slash redirect once to no-slash; the redirected request will have no trailing slash, so no second redirect. No loop.

**Code structure outline:**
- After the host redirect block: get `pathname` from `request.nextUrl`.
- If `pathname !== "/"` and `pathname.endsWith("/")`, create new URL with `pathname.slice(0, -1)`, return `NextResponse.redirect(url, 308)`.
- Else `NextResponse.next()`.

---

## 3. Fix /service/[slug] — Disable Dynamic Route (404 for All Slugs)

**Requirement:** Do **not** use allowlist. In `src/app/(inner-cta)/service/[slug]/page.tsx`, immediately call `notFound()`. This disables the dynamic route entirely. `/service` (main page) stays 200; any `/service/*` returns 404.

### Implementation

**File:** `src/app/(inner-cta)/service/[slug]/page.tsx`

**Change:**
- At the top of the default export (or at the very start of the component), call `notFound()` (import from `next/navigation`). Remove or comment out the existing JSX return so the page never renders; alternatively keep the component but the first line is `notFound()` so the rest is unreachable.

**Code structure outline:**
- Add: `import { notFound } from "next/navigation";`
- In the default export: first line `notFound();` (and remove/comment the rest of the component body, or leave as dead code). No fetch, no allowlist, no params usage.

**Confirmation:**
- `/service` is a different route (`src/app/(inner)/service/page.tsx`). Unchanged. Returns 200.
- Any request to `/service/anything` hits this `[slug]` page, which calls `notFound()` → 404. No infinite 200 URLs.

---

## 4. Remove 404 Auto-Redirect

**Requirement:** In `src/app/not-found.tsx`, remove the 2-second automatic redirect to `/`. Keep HTTP 404, page styling, and the manual “Go Home” link.

### Implementation

**File:** `src/app/not-found.tsx`

**Remove:**
- The `useEffect` that calls `router.replace("/")` after 2000 ms.
- The `useRouter` import from `next/navigation` (if no longer used).

**Keep:**
- The rest of the component (heading “404”, “Page not found”, message, “Go Home” link, all styling).

**Code structure outline:**
- Delete the `useEffect` block and the `useRouter` declaration/hook usage.
- Optionally remove `"use client"` if the file no longer uses client-only APIs (Next.js allows not-found to be server or client; keeping `"use client"` is safe if other client behavior remains).

**Confirmation:**
- Next.js still returns **404** when `not-found.tsx` is rendered. Removing client-side redirect does not change the HTTP status. No SEO regression.
- Users see 404 and can click “Go Home” manually.

---

## 5. Sitemap Adjustment

**Requirement:** Add `/portfolio/details` to the sitemap. Do **not** add `/blog-sidebar`. Sitemap must use non-www and no trailing slashes; no duplicate URLs.

### Implementation

**File:** `src/app/sitemap.ts`

**Change:**
- In the `staticRoutes` array (or equivalent), add one entry for `"/portfolio/details"` in the same form as existing static routes (e.g. `url: \`${SITE_URL}/portfolio/details\``, `lastModified: new Date()`). Use the same pattern as `"/about"`, `"/service"`, etc.

**Confirmation:**
- Sitemap base URL comes from `getSiteUrl()`. After updating `siteUrl.ts` fallback to `https://inomadigital.com`, and with `SITE_URL` already `https://inomadigital.com/`, sitemap will use non-www. `getSiteUrl()` already strips trailing slash, so all sitemap URLs have no trailing slash. No duplicate URLs introduced (single entry for `/portfolio/details`).

---

## 6. Update Fallback Site URL

**Requirement:** In `src/lib/siteUrl.ts`, set `FALLBACK_SITE_URL` to `"https://inomadigital.com"` (remove www).

### Implementation

**File:** `src/lib/siteUrl.ts`

**Change:**
- Replace `const FALLBACK_SITE_URL = "https://www.inomadigital.com";` with `const FALLBACK_SITE_URL = "https://inomadigital.com";`

**Confirmation:**
- When `SITE_URL` and `VERCEL_URL` are unset (e.g. local build), metadata and sitemap will use non-www. Production already sets `SITE_URL`, so this is consistency and safety for other environments.

---

## Execution Order

1. **`src/lib/siteUrl.ts`** — Update fallback URL (no dependency).
2. **`src/middleware.ts`** — Create with www redirect + trailing slash (no dependency on other app code).
3. **`src/app/not-found.tsx`** — Remove auto-redirect (independent).
4. **`src/app/(inner-cta)/service/[slug]/page.tsx`** — Add `notFound()` (independent).
5. **`src/app/sitemap.ts`** — Add `/portfolio/details` (uses `getSiteUrl()`; benefits from step 1).

Deploy as a single release after local verification.

---

## Local Testing Checklist

- [ ] **Middleware — localhost:** Run `next dev`. Open `http://localhost:3000/about`. No redirect (host is not www.inomadigital.com). Open `http://localhost:3000/about/`. Expect redirect to `http://localhost:3000/about` with 308 (if matcher allows; otherwise confirm no crash).
- [ ] **Middleware — static/api:** Request `http://localhost:3000/assets/css/main.css` and `http://localhost:3000/api/...` (if any). No redirect; normal response.
- [ ] **404:** Visit `http://localhost:3000/nonexistent`. Expect 404 page, no redirect after 2 seconds; “Go Home” link works.
- [ ] **Service:** Visit `http://localhost:3000/service`. Expect 200. Visit `http://localhost:3000/service/any-slug`. Expect 404.
- [ ] **Sitemap:** Open `http://localhost:3000/sitemap.xml`. Confirm entry for `/portfolio/details` and base URL (non-www when applicable).
- [ ] **siteUrl:** No runtime errors; build succeeds.

---

## Production Verification Checklist (Curl)

- [ ] **www → non-www (308):**  
  `curl -sI https://www.inomadigital.com/about`  
  Expect: `HTTP/2 308`, `location: https://inomadigital.com/about`

- [ ] **non-www no redirect:**  
  `curl -sI https://inomadigital.com/about`  
  Expect: 200 (or 304), no redirect.

- [ ] **Trailing slash (308):**  
  `curl -sI https://inomadigital.com/about/`  
  Expect: `HTTP/2 308`, `location: https://inomadigital.com/about`

- [ ] **Root:**  
  `curl -sI https://inomadigital.com/`  
  Expect: 200, no redirect.

- [ ] **Service list 200:**  
  `curl -sI https://inomadigital.com/service`  
  Expect: 200.

- [ ] **Service slug 404:**  
  `curl -sI https://inomadigital.com/service/anything`  
  Expect: 404.

- [ ] **404 page status:**  
  `curl -sI https://inomadigital.com/nonexistent-page`  
  Expect: 404.

- [ ] **Sitemap:**  
  `curl -s https://inomadigital.com/sitemap.xml`  
  Expect: XML with non-www base URLs and `/portfolio/details` entry.

---

## Rollback Steps

| Step | Action |
|------|--------|
| 1 | Revert `src/lib/siteUrl.ts`: set `FALLBACK_SITE_URL` back to `"https://www.inomadigital.com"`. |
| 2 | Delete `src/middleware.ts` (or comment out redirect logic and deploy). |
| 3 | Revert `src/app/not-found.tsx`: restore `useEffect` and `router.replace("/")`. |
| 4 | Revert `src/app/(inner-cta)/service/[slug]/page.tsx`: remove `notFound()` and restore original component body. |
| 5 | Revert `src/app/sitemap.ts`: remove the `/portfolio/details` entry. |

Redeploy after rollback. No WordPress, blog, or portfolio code is changed; rollback is limited to these five files.

---

## Summary

- **Non-breaking:** No changes to WordPress integration, blog, portfolio, or UI.
- **Minimal:** Five files touched; middleware is additive; service [slug] is a single call; 404 and sitemap/siteUrl are small edits.
- **Safe for one release:** Execution order and checks are above; rollback is straightforward.

Plan ready for implementation.
