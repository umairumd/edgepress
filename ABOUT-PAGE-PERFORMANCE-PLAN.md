# About Page Performance — Revised Plan (Root Causes)

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
