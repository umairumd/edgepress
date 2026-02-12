# WordPress → Blog (Inoma Next.js)

This site renders blog posts from **WPGraphQL**.

## Featured Blogs (Sidebar)
To show a **Featured Blogs** section in the blog sidebar, the Next.js app looks for a boolean/true-false field on each post.

### Recommended ACF field
Create an ACF Field Group assigned to **Posts** and add:
- **Field Type**: True / False
- **Field Name**: `featuredBlog`
- **Default**: Off

Then toggle it ON for the posts you want to feature.

### Notes on GraphQL field names
Depending on your WPGraphQL for ACF setup, the field may appear:
- directly on the `Post` type, OR
- nested under a group field (example: `postFields { featuredBlog }`)

You can configure this via env vars:

```bash
WP_POST_FEATURE_FIELD=featuredBlog
WP_POST_ACF_GROUP_FIELD=postFields
```

If you do not have a group field, leave `WP_POST_ACF_GROUP_FIELD` unset.

---

## FAQ Accordion Snippet

Blog content from WordPress is rendered via `dangerouslySetInnerHTML`. **Scripts in pasted HTML do not run** — the browser blocks them. The Next.js `WpContent` component automatically attaches click handlers to FAQ accordions.

### Required HTML structure (always use these classes)

- `.faq-container` — wrapper
- `.faq-item` — each Q&amp;A pair (WpContent toggles `faq-open` on this)
- `.faq-question` — the clickable button
- `.faq-answer` — the collapsible answer
- `.faq-icon` — optional chevron (▼) that rotates when open

### Do not include

- `<script>` for accordion behavior (it will not run). WpContent handles it.
- You may keep `<script type="application/ld+json">` for SEO; it is data, not executable.

### Ready-to-paste snippet

See **`docs/wordpress-faq-snippet.html`** for a complete, copy-paste FAQ block you can use in WordPress posts.

---

## Email Signatures

Team email signatures (HTML) are in **`public/signatures/`**:

- `signature-1-compact.html` – Compact horizontal layout
- `signature-2-centered.html` – Centered stacked with social icons
- `signature-3-minimal.html` – Minimal with divider

See `public/signatures/README.md` for usage and customization.



