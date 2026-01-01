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


