# Inoma Digital — SEO Maintenance Guide

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

