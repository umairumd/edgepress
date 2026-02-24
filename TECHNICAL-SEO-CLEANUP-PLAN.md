# Technical SEO Cleanup — Final Implementation Plan

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
