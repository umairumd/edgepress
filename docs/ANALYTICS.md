# Google Tag Manager & Analytics Implementation Audit

**Scope:** Full codebase. No code was modified.

---

## 1. Search results summary

| Term | Location (app/source only) |
|------|----------------------------|
| **GoogleTagManager** | `src/app/layout.tsx` (import + usage) |
| **@next/third-parties/google** | `src/app/layout.tsx` (import) |
| **gtag** | Not found in `src`. (Only in `package-lock.json` / dependency strings, not app code.) |
| **gtm** | `src/app/layout.tsx` (inside `GoogleTagManager` usage: `gtmId="GTM-MMSWN6S"`) |
| **dataLayer** | Not referenced in `src`. (Used internally by `@next/third-parties` in `node_modules/@next/third-parties/dist/google/gtm.js` and in ARCHITECTURE.md as documentation.) |
| **facebook** | Only as link URLs, share URLs, icon names, and content copy (FooterSix, Offcanvas, Sidebar, ServiceItem, PricingComparisonTable, signatures). No Facebook Pixel or fbevents script. |
| **fbevents** | Not found in repo. (Mentioned only in ARCHITECTURE.md as “loaded via GTM”.) |
| **next/script** | Not imported in `src`. Used only inside `node_modules/@next/third-parties/dist/google/gtm.js` (as `script_1.default`). |
| **Script** | No direct usage in `src`. (One match in ServiceItem.tsx is the word “JavaScript” in a string.) |

---

## 2. GTM initialization

### Where GTM is initialized

**File:** [src/app/layout.tsx](src/app/layout.tsx)

**Exact snippet:**

```tsx
import { GoogleTagManager } from "@next/third-parties/google";
// ...
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html ...>
      <head>...</head>
      <body suppressHydrationWarning>
        <GoogleTagManager gtmId="GTM-MMSWN6S" />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
```

- **Loaded in:** Root layout only (applies to all routes).
- **Loaded more than once:** No. Single instance in the root layout; no other layout or page renders `GoogleTagManager`.

### How @next/third-parties loads GTM

The `GoogleTagManager` component (from `node_modules/@next/third-parties/dist/google/gtm.js`):

1. Renders two **next/script** components (no `strategy` prop passed, so Next.js default applies):
   - **Script 1** (`id="_next-gtm-init"`): Inline script that initializes `window.dataLayer` and pushes `{'gtm.start': new Date().getTime(), event: 'gtm.js'}`.
   - **Script 2** (`id="_next-gtm"`): External script `https://www.googletagmanager.com/gtm.js?id=GTM-MMSWN6S`.
2. Does **not** accept a `strategy` prop (see `node_modules/@next/third-parties/dist/types/google.d.ts`: `GTMParams` has no `strategy`).

---

## 3. Custom dataLayer and sendGTMEvent

- **dataLayer.push() in app code:** None. No `dataLayer.push`, `window.dataLayer`, or similar in `src`.
- **sendGTMEvent:** Not used anywhere in `src`. The package exports `sendGTMEvent` from `@next/third-parties/google`, but the codebase does not import or call it.

---

## 4. Facebook Pixel / fbevents

- **In repo:** No Facebook Pixel or fbevents script. No `fbq`, `fbevents`, or `connect.facebook.net` in application code.
- **Facebook in codebase:** Only:
  - Links to facebook.com (e.g. FooterSix, Offcanvas, Sidebar share URL).
  - Icon component `IconFacebookF`.
  - Copy (e.g. “Facebook” in pricing/service descriptions).
- **Conclusion:** Any Facebook Pixel (e.g. fbevents.js) is loaded **only via GTM** (container tags), not by app code.

---

## 5. Other scripts and analytics

- **Manual script injection:** No analytics or GTM injected by app code. The only scripts in layout are:
  - Animate.css loader (inline script creating a `<link>`).
  - JSON-LD (Organization, WebSite).
- **Other analytics implementations:** None. No gtag, GA4, or other analytics SDK in `src`. Mentions of “tracking”, “Pixel”, “GA4” in `src` are only in **content/copy** (e.g. PricingComparisonTable, PricingData), not in implementation.

---

## 6. Route and loading behavior

- **GTM on all routes:** Yes. Because it is in the root layout, GTM loads on every route (home, about, blog, portfolio, service, team, pricing, faq, contact, etc.).
- **Per-page GTM or scripts:** No. No route-specific layout or page adds GTM or another analytics script.
- **Duplicate loading:** No. Single `<GoogleTagManager gtmId="GTM-MMSWN6S" />` in the tree.

---

## 7. Summary

| Question | Answer |
|----------|--------|
| **Single GTM?** | Yes. One GTM container (GTM-MMSWN6S), initialized only in root layout. |
| **Any duplicate loading?** | No. |
| **Any manual event pushes?** | No. No `dataLayer.push` or `sendGTMEvent` in the codebase. |
| **Any Facebook script outside GTM?** | No. No Facebook Pixel or fbevents in the repo; any Facebook tracking is via GTM only. |
| **GTM loads on all routes?** | Yes (root layout). |
| **Any page manually injects analytics scripts?** | No. |
| **Multiple analytics implementations?** | No. Only GTM (and whatever tags are inside the GTM container, e.g. GA4, Facebook, which are not in app code). |

---

## 8. File reference

| File | Relevance |
|------|-----------|
| [src/app/layout.tsx](src/app/layout.tsx) | Only place that imports and renders `GoogleTagManager`; single GTM usage. |
| [node_modules/@next/third-parties/dist/google/gtm.js](node_modules/@next/third-parties/dist/google/gtm.js) | Implements GTM via two `next/script` components and exposes `sendGTMEvent` (unused in app). |
| [node_modules/@next/third-parties/dist/types/google.d.ts](node_modules/@next/third-parties/dist/types/google.d.ts) | `GTMParams`: no `strategy`; supports `gtmId`, `gtmScriptUrl`, `dataLayer`, `dataLayerName`, `auth`, `preview`, `nonce`. |

No other files in `src` reference GTM, dataLayer, gtag, or Facebook Pixel/fbevents.
