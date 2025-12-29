const WP_ENDPOINT = (process.env.WP_GRAPHQL_ENDPOINT || "").trim() || undefined;

type WPImage = {
  url: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
};

type WpMediaNode = {
  sourceUrl?: string | null;
  altText?: string | null;
  mediaDetails?: {
    width?: number | null;
    height?: number | null;
  } | null;
};

type WpSeoNode = {
  title?: string | null;
  metaDesc?: string | null;
  canonical?: string | null;
  opengraphTitle?: string | null;
  opengraphDescription?: string | null;
  opengraphImage?: WpMediaNode | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: WpMediaNode | null;
};

type WpCategoryNode = {
  slug?: string | null;
  name?: string | null;
  count?: number | null;
};

type WpPostNode = {
  slug?: string | null;
  title?: string | null;
  excerpt?: string | null;
  content?: string | null;
  date?: string | null;
  categories?: { nodes?: WpCategoryNode[] | null } | null;
  author?: { node?: { name?: string | null } | null } | null;
  featuredImage?: { node?: WpMediaNode | null } | null;
  seo?: WpSeoNode | null;
};

function normalizeWpMediaUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (!WP_ENDPOINT) return url;
  try {
    const endpoint = new URL(WP_ENDPOINT);
    const media = new URL(url);

    // If media is served from the same host as the GraphQL endpoint, normalize
    // protocol to match the endpoint. This fixes local dev setups where WP
    // returns https URLs with a self-signed cert (Next/Image fetch fails).
    if (media.hostname === endpoint.hostname && media.protocol !== endpoint.protocol) {
      media.protocol = endpoint.protocol;
      return media.toString();
    }
  } catch {
    // ignore, return original url
  }
  return url;
}

function mapWpImage(node: WpMediaNode | null | undefined): WPImage | undefined {
  if (!node?.sourceUrl) return undefined;
  return {
    url: normalizeWpMediaUrl(node.sourceUrl)!,
    alt: node.altText,
    width: node.mediaDetails?.width ?? null,
    height: node.mediaDetails?.height ?? null,
  };
}

export type YoastSeo = {
  title?: string | null;
  metaDesc?: string | null;
  canonical?: string | null;
  opengraphTitle?: string | null;
  opengraphDescription?: string | null;
  opengraphImage?: WPImage;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: WPImage;
};

export type Post = {
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  date?: string;
  category?: string;
  featuredImage?: WPImage;
  author?: string;
  seo?: YoastSeo;
};

export type PortfolioItem = {
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  date?: string;
  category?: string;
  featuredImage?: WPImage;
  seo?: YoastSeo;
};

async function wpFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T | null> {
  if (!WP_ENDPOINT) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[wpFetch] Missing WP_GRAPHQL_ENDPOINT env var");
    }
    return null;
  }
  try {
    const isProd = process.env.NODE_ENV === "production";
    const res = await fetch(WP_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      // In dev, avoid caching so WordPress changes show up immediately.
      ...(isProd ? { next: { revalidate: 300 } } : { cache: "no-store" }),
    });
    if (!res.ok) {
      if (!isProd) {
        const text = await res.text().catch(() => "");
        console.error(`[wpFetch] HTTP ${res.status} from ${WP_ENDPOINT}`, text.slice(0, 500));
      }
      return null;
    }
    const json = await res.json().catch((e: unknown) => {
      if (!isProd) console.error("[wpFetch] Invalid JSON response", e);
      return null;
    });
    if (!json) return null;
    if ((json as { errors?: unknown }).errors) {
      if (!isProd) console.error("[wpFetch] GraphQL errors", (json as { errors?: unknown }).errors);
      return null;
    }
    return (json as { data?: T }).data ?? null;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[wpFetch] Request failed", err);
    }
    return null;
  }
}

type WPGraphQlResponse<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

async function wpFetchRaw<T>(query: string, variables?: Record<string, unknown>): Promise<WPGraphQlResponse<T> | null> {
  if (!WP_ENDPOINT) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[wpFetchRaw] Missing WP_GRAPHQL_ENDPOINT env var");
    }
    return null;
  }
  try {
    const isProd = process.env.NODE_ENV === "production";
    const res = await fetch(WP_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      ...(isProd ? { next: { revalidate: 300 } } : { cache: "no-store" }),
    });
    if (!res.ok) {
      if (!isProd) {
        const text = await res.text().catch(() => "");
        console.error(`[wpFetchRaw] HTTP ${res.status} from ${WP_ENDPOINT}`, text.slice(0, 500));
      }
      return null;
    }
    return (await res.json()) as WPGraphQlResponse<T>;
  } catch {
    return null;
  }
}

function isMissingYoastSeoField(errors?: Array<{ message?: string }>) {
  if (!errors?.length) return false;
  return errors.some((e) => (e.message || "").includes('Cannot query field "seo"'));
}

export async function getPosts(limit = 12): Promise<Post[]> {
  const data = await wpFetch<{
    posts: { nodes: WpPostNode[] };
  }>(
    `
    query GetPosts($limit: Int!) {
      posts(first: $limit, where: {orderby: {field: DATE, order: DESC}}) {
        nodes {
          slug
          title
          excerpt
          date
          categories(first: 1) { nodes { name } }
          featuredImage { node { sourceUrl altText mediaDetails { width height } } }
        }
      }
    }
    `,
    { limit }
  );

  if (!data?.posts?.nodes) return [];

  return data.posts.nodes.map((node) => ({
    slug: node.slug ?? "",
    title: node.title ?? "",
    excerpt: node.excerpt ?? undefined,
    date: node.date ?? undefined,
    category: node.categories?.nodes?.[0]?.name ?? undefined,
    featuredImage: mapWpImage(node.featuredImage?.node),
  }));
}

export async function getPost(slug: string): Promise<Post | null> {
  type PostResponse = { post: WpPostNode | null };

  const queryWithSeo = `
    query GetPost($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        slug
        title
        excerpt
        content
        date
        categories(first: 1) { nodes { name } }
        author { node { name } }
        featuredImage { node { sourceUrl altText mediaDetails { width height } } }
        seo {
          title
          metaDesc
          canonical
          opengraphTitle
          opengraphDescription
          opengraphImage { sourceUrl altText mediaDetails { width height } }
          twitterTitle
          twitterDescription
          twitterImage { sourceUrl altText mediaDetails { width height } }
        }
      }
    }
  `;

  const queryBase = `
    query GetPost($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        slug
        title
        excerpt
        content
        date
        categories(first: 1) { nodes { name } }
        author { node { name } }
        featuredImage { node { sourceUrl altText mediaDetails { width height } } }
      }
    }
  `;

  const raw = await wpFetchRaw<PostResponse>(queryWithSeo, { slug });
  const fallback = raw?.errors && isMissingYoastSeoField(raw.errors)
    ? await wpFetch<PostResponse>(queryBase, { slug })
    : raw?.data;

  const post = fallback?.post;
  if (!post) return null;

  return {
    slug: post.slug ?? "",
    title: post.title ?? "",
    excerpt: post.excerpt ?? undefined,
    content: post.content ?? undefined,
    date: post.date ?? undefined,
    category: post.categories?.nodes?.[0]?.name ?? undefined,
    author: post.author?.node?.name ?? undefined,
    featuredImage: mapWpImage(post.featuredImage?.node),
    seo: post.seo
      ? {
          title: post.seo.title,
          metaDesc: post.seo.metaDesc,
          canonical: post.seo.canonical,
          opengraphTitle: post.seo.opengraphTitle,
          opengraphDescription: post.seo.opengraphDescription,
          opengraphImage: mapWpImage(post.seo.opengraphImage),
          twitterTitle: post.seo.twitterTitle,
          twitterDescription: post.seo.twitterDescription,
          twitterImage: mapWpImage(post.seo.twitterImage),
        }
      : undefined,
  };
}

export async function getRecentPosts(limit = 5): Promise<Post[]> {
  const data = await wpFetch<{
    posts: { nodes: WpPostNode[] };
  }>(
    `
    query GetRecentPosts($limit: Int!) {
      posts(first: $limit, where: {orderby: {field: DATE, order: DESC}}) {
        nodes {
          slug
          title
          date
          categories(first: 1) { nodes { name } }
          featuredImage { node { sourceUrl altText mediaDetails { width height } } }
        }
      }
    }
    `,
    { limit }
  );

  if (!data?.posts?.nodes) return [];

  return data.posts.nodes.map((node) => ({
    slug: node.slug ?? "",
    title: node.title ?? "",
    date: node.date ?? undefined,
    category: node.categories?.nodes?.[0]?.name ?? undefined,
    featuredImage: mapWpImage(node.featuredImage?.node),
  }));
}

export type Category = { slug: string; name: string; count?: number };

export async function getCategories(): Promise<Category[]> {
  const data = await wpFetch<{
    categories: { nodes: WpCategoryNode[] };
  }>(
    `
    query GetCategories {
      categories(first: 50, where: {hideEmpty: true}) {
        nodes {
          slug
          name
          count
        }
      }
    }
    `
  );

  if (!data?.categories?.nodes) return [];
  return data.categories.nodes.map((c) => ({
    slug: c.slug ?? "",
    name: c.name ?? "",
    count: c.count ?? undefined,
  }));
}

export async function getPortfolioItems(limit = 12): Promise<PortfolioItem[]> {
  const data = await wpFetch<{
    portfolioItems?: { nodes: WpPostNode[] };
  }>(
    `
    query GetPortfolioItems($limit: Int!) {
      portfolioItems(first: $limit, where: {orderby: {field: DATE, order: DESC}}) {
        nodes {
          slug
          title
          excerpt
          date
          featuredImage { node { sourceUrl altText mediaDetails { width height } } }
        }
      }
    }
    `,
    { limit }
  );

  const nodes = data?.portfolioItems?.nodes;
  if (!nodes) return [];

  return nodes.map((node) => ({
    slug: node.slug ?? "",
    title: node.title ?? "",
    excerpt: node.excerpt ?? undefined,
    date: node.date ?? undefined,
    featuredImage: mapWpImage(node.featuredImage?.node),
  }));
}

export async function getPortfolioItem(slug: string): Promise<PortfolioItem | null> {
  type PortfolioResponse = { portfolioItem?: WpPostNode | null };

  const queryWithSeo = `
    query GetPortfolioItem($slug: ID!) {
      portfolioItem(id: $slug, idType: SLUG) {
        slug
        title
        excerpt
        content
        date
        featuredImage { node { sourceUrl altText mediaDetails { width height } } }
        seo {
          title
          metaDesc
          canonical
          opengraphTitle
          opengraphDescription
          opengraphImage { sourceUrl altText mediaDetails { width height } }
          twitterTitle
          twitterDescription
          twitterImage { sourceUrl altText mediaDetails { width height } }
        }
      }
    }
  `;

  const queryBase = `
    query GetPortfolioItem($slug: ID!) {
      portfolioItem(id: $slug, idType: SLUG) {
        slug
        title
        excerpt
        content
        date
        featuredImage { node { sourceUrl altText mediaDetails { width height } } }
      }
    }
  `;

  const raw = await wpFetchRaw<PortfolioResponse>(queryWithSeo, { slug });
  const fallback = raw?.errors && isMissingYoastSeoField(raw.errors)
    ? await wpFetch<PortfolioResponse>(queryBase, { slug })
    : raw?.data;

  const item = fallback?.portfolioItem;
  if (!item) return null;

  return {
    slug: item.slug ?? "",
    title: item.title ?? "",
    excerpt: item.excerpt ?? undefined,
    content: item.content ?? undefined,
    date: item.date ?? undefined,
    featuredImage: mapWpImage(item.featuredImage?.node),
    seo: item.seo
      ? {
          title: item.seo.title,
          metaDesc: item.seo.metaDesc,
          canonical: item.seo.canonical,
          opengraphTitle: item.seo.opengraphTitle,
          opengraphDescription: item.seo.opengraphDescription,
          opengraphImage: mapWpImage(item.seo.opengraphImage),
          twitterTitle: item.seo.twitterTitle,
          twitterDescription: item.seo.twitterDescription,
          twitterImage: mapWpImage(item.seo.twitterImage),
        }
      : undefined,
  };
}

