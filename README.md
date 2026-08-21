# Next.js Headless WordPress Agency Website

A production-ready agency website built with Next.js 16 App Router and headless WordPress via WPGraphQL. Designed for digital agencies that need non-technical team members to manage content while maintaining full frontend control.

## Live Demo

[https://inomadigital.com/](https://inomadigital.com/)

## Screenshots



## Architecture

**Headless WordPress.** The CMS stays in WordPress so editors keep the admin they already know: posts, portfolio items, featured images, excerpts, and custom fields. The public site is a Next.js application, so developers control routing, performance, SEO metadata, and UI without fighting a PHP theme.

**WPGraphQL.** All CMS content is fetched over GraphQL rather than the REST posts API. Queries are explicit, payloads stay small, and TypeScript types in `src/lib/wp.ts` map cleanly onto posts, portfolio items, media, taxonomies, and Yoast-style SEO fields.

**ISR with 5-minute revalidation.** Blog, portfolio, and privacy pages use Incremental Static Regeneration (`revalidate = 300`). GraphQL fetches in production use the same 300-second cache. Pages stay statically fast; content updates appear without a full rebuild. Marketing pages that change less often can use a longer window.

**WordPress-driven redirects.** Middleware loads a redirect map from a custom WordPress REST endpoint (`/wp-json/[namespace]/v1/redirects`) and applies 301/302/307/308 responses at the edge. Editors can change URLs for SEO without a code deploy. The map is cached in memory for five minutes.

**PurgeCSS + CSSO in postbuild.** After `next build`, unused Bootstrap and theme CSS is stripped, then CSSO minifies the remaining files. Production CSS stays small without rewriting the SCSS source.

**Resend for transactional email.** The contact form posts to a Next.js Route Handler that sends mail through Resend. Delivery is handled by a dedicated email API instead of the WordPress server.

## Features

- [x] Dynamic blog with cursor-based pagination
- [x] Portfolio with image slicing and excerpt support
- [x] WordPress-driven 301 redirects
- [x] Contact form with Resend
- [x] Privacy policy page from WordPress
- [x] Automatic XML sitemap
- [x] Google Tag Manager (server-side env var)
- [x] Headless font loading (Clash Display)
- [x] Mobile-responsive with Bootstrap grid



## WordPress Requirements



### Plugins

- **WPGraphQL** — GraphQL endpoint at `/graphql`
- **Advanced Custom Fields (ACF)** — custom fields on posts and portfolio items
- **WPGraphQL for Advanced Custom Fields** — expose ACF fields in the GraphQL schema
- **Custom Post Type UI** — register the Portfolio custom post type
- **Yoast SEO** (recommended) — titles, meta descriptions, canonicals, and Open Graph data consumed by the frontend
- A **custom REST endpoint** that returns the redirect map at `/wp-json/[namespace]/v1/redirects`

Replace `[namespace]` with your WordPress plugin namespace. The response should be a JSON object keyed by path (no leading slash), for example:

```json
{
  "old-page": { "target": "/new-page", "type": 301 }
}
```

`target` may be a relative path or an absolute URL. `type` should be `301`, `302`, `307`, or `308`.

### Portfolio CPT

Register a publicly queryable post type exposed to WPGraphQL as `portfolioItems`. Each item should include:


| Field                     | Use                                                            |
| ------------------------- | -------------------------------------------------------------- |
| Title                     | Listing and detail headings                                    |
| Content                   | Case study body                                                |
| Excerpt                   | Cards and meta descriptions                                    |
| Featured image            | Listing thumbnail                                              |
| Categories                | Filters (typical slugs: `case-studies`, `websites`, `logos`)   |
| ACF `portfolioEntryImage` | Tall “entry” image on the detail page (sliced for performance) |
| ACF `featured` (optional) | Pins items to the top of the listing                           |


If your GraphQL field names differ, override them with the optional `WP_PORTFOLIO_*` environment variables in `.env.example`.

### Blog posts

Standard WordPress posts power `/blog`. An optional ACF true/false field (`featuredBlog` by default) marks posts for the sidebar. Configure names with `WP_POST_FEATURE_FIELD` and `WP_POST_ACF_GROUP_FIELD` if needed.

### Privacy policy

Publish a WordPress page whose slug is `privacy-policy`. The Next.js route at `/privacy-policy` fetches that page over GraphQL.

## Project Structure

```
src/
  app/          # Next.js App Router pages and layouts
  components/   # React components
  lib/          # WordPress data fetching (wp.ts), shared utils
  styles/       # SCSS source files
  data/         # Static data (menus, services)
  hooks/        # Custom React hooks
public/
  assets/       # CSS, fonts, images
docs/           # Architecture and SEO documentation
```



## Getting Started

1. **Clone the repo**
  ```bash
   git clone <your-repo-url>
   cd <project-directory>
  ```
2. **Configure environment variables**
  ```bash
   cp .env.example .env.local
  ```
   Fill in WordPress, Resend, site URL, and GTM values. See `.env.example` for descriptions.
3. **Set up WordPress** with the plugins, Portfolio CPT, ACF fields, and redirects endpoint listed above. Confirm GraphQL works in WPGraphQL IDE.
4. **Install dependencies**
  ```bash
   npm install
  ```
5. **Run the development server**
  ```bash
   npm run dev
  ```
   Open [http://localhost:3000](http://localhost:3000). Content is fetched live from WordPress (no ISR cache in development).



### Production build

```bash
npm run build
npm run start
```

`postbuild` runs PurgeCSS and CSSO on the compiled CSS in `public/assets/css/`.

## Environment Variables

See `[.env.example](.env.example)` for all required and optional variables with descriptions.


| Variable                              | Required | Purpose                                                          |
| ------------------------------------- | -------- | ---------------------------------------------------------------- |
| `WP_GRAPHQL_ENDPOINT`                 | Yes      | Full URL to the WPGraphQL endpoint                               |
| `WP_MEDIA_DOMAIN`                     | Yes      | Host(s) for WordPress media (comma-separated if needed)          |
| `SITE_URL`                            | Yes      | Canonical origin for sitemaps and metadata                       |
| `WP_REDIRECTS_API_URL`                | No       | Custom REST URL for WordPress-driven redirects; skipped if unset |
| `RESEND_API_KEY`                      | Yes      | Resend API key for the contact form                              |
| `CONTACT_TO_EMAIL`                    | Yes      | Inbox that receives inquiries                                    |
| `CONTACT_FROM_EMAIL`                  | Yes      | From name and address (must be a verified Resend domain)         |
| `GTM_ID`                              | Yes      | Google Tag Manager container ID (e.g. `GTM-XXXXXXX`)             |
| `WP_PORTFOLIO_*` / `WP_POST_*`        | No       | Override ACF / taxonomy GraphQL field names                      |
| `GOOGLE_*` / `NEXT_PUBLIC_SUPABASE_*` | No       | Only if those integrations are enabled                           |


Set `WP_REDIRECTS_API_URL` to your redirects REST URL (`/wp-json/[namespace]/v1/redirects`). If it is unset, middleware skips CMS redirects.

## Deployment

Optimized for **Vercel**.

1. Import the Git repository into a Vercel project.
2. Set every required variable from `.env.example` in the project dashboard (Production, Preview, and Development as needed). Do not commit `.env.local`.
3. Deploy. Vercel runs `npm run build` (including the CSS postbuild) and serves the App Router with ISR.

Allowlist your WordPress media host in `WP_MEDIA_DOMAIN` so `next/image` can optimize remote images (AVIF/WebP via Sharp). After go-live, confirm `/sitemap.xml`, contact form delivery, GTM, and a sample WordPress redirect.

## Docs

See the `docs/` folder for:

- SEO architecture decisions and guidelines (`SEO-GUIDELINES.md`, `SEO-ROUTING-AUDIT.md`, `SEO-MAINTENANCE-GUIDE.md`, `TECHNICAL-SEO-CLEANUP-PLAN.md`)
- CMS configuration notes (`wordpress-blog.md`, `wordpress-portfolio.md`, `CMS-BROWSER-REQUEST-AUDIT.md`)
- Performance audit reports (`ABOUT-PAGE-PERFORMANCE-PLAN.md`, `GTM-ANALYTICS-AUDIT.md`)



## Tech Stack


| Technology  | Purpose                                                |
| ----------- | ------------------------------------------------------ |
| Next.js 16  | App Router, ISR, Route Handlers, image optimization    |
| TypeScript  | Typed GraphQL mapping and application code             |
| WordPress   | Headless CMS for posts, portfolio, and pages           |
| WPGraphQL   | Typed content API                                      |
| Bootstrap 5 | Responsive grid and layout utilities                   |
| SCSS        | Component and layout styles                            |
| Resend      | Transactional email for the contact form               |
| Vercel      | Hosting, edge middleware, and ISR                      |
| PurgeCSS    | Remove unused CSS after build                          |
| Sharp       | Image decoding, slicing, and `next/image` optimization |


