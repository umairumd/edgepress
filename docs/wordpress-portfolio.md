# WordPress → Portfolio (Inoma Next.js)

This site renders the Portfolio list and detail pages from **WPGraphQL**.

## 1) WordPress plugins
- **WPGraphQL**
- **Advanced Custom Fields (ACF)**
- **WPGraphQL for ACF**

## 2) Portfolio post type
Your WordPress must expose a `portfolioItems` post type in WPGraphQL (it already does if the website is currently showing CMS portfolio items).

## 3) Taxonomy for filtering
Create/confirm a taxonomy for portfolio items (commonly “Portfolio Categories”), and create these terms (slugs matter):
- `case-studies`
- `websites`
- `logos`

Assign exactly one of these categories to each portfolio item (you can assign multiple, but the UI filter assumes these slugs).

## 4) Two images per portfolio item
Each portfolio item should have:
- **Featured Image**: used as the **thumbnail** on `/portfolio`
- **ACF field**: used as the **long image** on `/portfolio/[slug]`

### Create the ACF field
Create an ACF Field Group assigned to **Portfolio Items** and add:
- **Field Type**: Image
- **Field Name**: `portfolioEntryImage`
- **Return Format**: Image Array

Upload your long “portfolio entry image” (tall JPG/PNG/WebP) to this field.

## 5) Confirm GraphQL field names (important)
In WPGraphQL IDE (GraphiQL), run an introspection-style query to confirm the exact field names. This code assumes:
- Taxonomy field: `portfolioCategories { nodes { slug name } }`
- ACF image field: `portfolioEntryImage { sourceUrl altText mediaDetails { width height } }`

If your schema uses different names, you can configure them via env vars in Next.js:
- `WP_PORTFOLIO_TAX_FIELD` (default: `portfolioCategories`)
- `WP_PORTFOLIO_ENTRY_FIELD` (default: `portfolioEntryImage`)
- `WP_PORTFOLIO_ACF_GROUP_FIELD` (optional; if your ACF fields are nested under a group field)

Example:
```bash
WP_PORTFOLIO_TAX_FIELD=portfolioCategories
WP_PORTFOLIO_ENTRY_FIELD=portfolioEntryImage
WP_PORTFOLIO_ACF_GROUP_FIELD=acfFields
```


