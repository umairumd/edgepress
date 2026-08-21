# Audit: Does the browser directly request resources from https://cms.inomadigital.com?

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
