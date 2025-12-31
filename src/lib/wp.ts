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

type WpMediaEdge = {
  node?: WpMediaNode | null;
} | null;

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

type WpTermNode = {
  slug?: string | null;
  name?: string | null;
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

type WpPortfolioNode = WpPostNode & {
  // Taxonomy connection name can differ per WPGraphQL schema; we fetch dynamically.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
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
  categories?: Array<{ slug: string; name: string }>;
  featuredImage?: WPImage;
  entryImage?: WPImage;
  seo?: YoastSeo;
};

const PORTFOLIO_TAX_FIELD = (process.env.WP_PORTFOLIO_TAX_FIELD || "").trim() || "portfolioCategories";
const PORTFOLIO_ENTRY_FIELD = (process.env.WP_PORTFOLIO_ENTRY_FIELD || "").trim() || "portfolioEntryImage";
const PORTFOLIO_ACF_GROUP_FIELD = (process.env.WP_PORTFOLIO_ACF_GROUP_FIELD || "").trim() || undefined;

const PORTFOLIO_ENTRY_FIELD_CANDIDATES = Array.from(
  // Prefer the most common WPGraphQL-for-ACF casing first to avoid avoidable GraphQL errors.
  new Set(["portfolioEntryImage", PORTFOLIO_ENTRY_FIELD, "portfolioentryimage"].filter(Boolean))
);

function mapWpTerms(terms?: { nodes?: WpTermNode[] | null } | null): Array<{ slug: string; name: string }> | undefined {
  const nodes = terms?.nodes;
  if (!nodes?.length) return undefined;
  const out = nodes
    .map((t) => ({ slug: t.slug ?? "", name: t.name ?? "" }))
    .filter((t) => t.slug || t.name);
  return out.length ? out : undefined;
}

function getPortfolioTaxonomyConnection(node: WpPortfolioNode): { nodes?: WpTermNode[] | null } | null | undefined {
  const value = node?.[PORTFOLIO_TAX_FIELD] as { nodes?: WpTermNode[] | null } | null | undefined;
  return value;
}

function getPortfolioEntryImageNode(node: WpPortfolioNode): WpMediaNode | null | undefined {
  if (PORTFOLIO_ACF_GROUP_FIELD) {
    const group = node?.[PORTFOLIO_ACF_GROUP_FIELD] as Record<string, unknown> | null | undefined;
    for (const key of PORTFOLIO_ENTRY_FIELD_CANDIDATES) {
      const field = group?.[key] as unknown;
      if (!field) continue;
      const edge = field as WpMediaEdge;
      if (edge && typeof edge === "object" && "node" in edge) return edge.node ?? undefined;
      return field as WpMediaNode | null | undefined;
    }
    return undefined;
  }
  for (const key of PORTFOLIO_ENTRY_FIELD_CANDIDATES) {
    const field = node?.[key] as unknown;
    if (!field) continue;
    const edge = field as WpMediaEdge;
    if (edge && typeof edge === "object" && "node" in edge) return edge.node ?? undefined;
    return (field as WpMediaNode | null | undefined) ?? undefined;
  }
  return undefined;
}

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
  const taxSelection = `${PORTFOLIO_TAX_FIELD} { nodes { slug name } }`;
  const buildQueryFull = (entryField: string, shape: "edge" | "direct") => {
    const entrySelection =
      shape === "edge"
        ? `${entryField} { node { sourceUrl altText mediaDetails { width height } } }`
        : `${entryField} { sourceUrl altText mediaDetails { width height } }`;
    const entryFieldSelection = PORTFOLIO_ACF_GROUP_FIELD
      ? `${PORTFOLIO_ACF_GROUP_FIELD} { ${entrySelection} }`
      : entrySelection;
    return `
      query GetPortfolioItems($limit: Int!) {
        portfolioItems(first: $limit, where: {orderby: {field: DATE, order: DESC}}) {
          nodes {
            slug
            title
            date
            featuredImage { node { sourceUrl altText mediaDetails { width height } } }
            ${taxSelection}
            ${entryFieldSelection}
          }
        }
      }
    `;
  };

  const queryBase = `
    query GetPortfolioItems($limit: Int!) {
      portfolioItems(first: $limit, where: {orderby: {field: DATE, order: DESC}}) {
        nodes {
          slug
          title
          date
          featuredImage { node { sourceUrl altText mediaDetails { width height } } }
        }
      }
    }
  `;

  // Try a few likely field names for the entry image (WPGraphQL for ACF often camelCases).
  let raw: WPGraphQlResponse<{ portfolioItems?: { nodes: WpPortfolioNode[] } }> | null = null;
  for (const candidate of PORTFOLIO_ENTRY_FIELD_CANDIDATES) {
    raw = await wpFetchRaw<{ portfolioItems?: { nodes: WpPortfolioNode[] } }>(buildQueryFull(candidate, "edge"), { limit });
    if (raw && !raw.errors) break;
    raw = await wpFetchRaw<{ portfolioItems?: { nodes: WpPortfolioNode[] } }>(buildQueryFull(candidate, "direct"), { limit });
    if (raw && !raw.errors) break;
  }

  const fallback = raw?.errors
    ? await wpFetch<{ portfolioItems?: { nodes: WpPortfolioNode[] } }>(queryBase, { limit })
    : raw?.data;
  const nodes = fallback?.portfolioItems?.nodes;
  if (!nodes?.length) return [];

  return nodes.map((node) => {
    const categories = mapWpTerms(getPortfolioTaxonomyConnection(node));
    return {
      slug: node.slug ?? "",
      title: node.title ?? "",
      date: node.date ?? undefined,
      featuredImage: mapWpImage(node.featuredImage?.node),
      entryImage: mapWpImage(getPortfolioEntryImageNode(node)),
      categories,
      // Keep a simple string category for backwards-compat UI. Prefer first term name.
      category: categories?.[0]?.name ?? undefined,
    };
  });
}

export async function getPortfolioItem(slug: string): Promise<PortfolioItem | null> {
  type PortfolioResponse = { portfolioItem?: WpPortfolioNode | null };

  const taxSelection = `${PORTFOLIO_TAX_FIELD} { nodes { slug name } }`;
  const buildEntryFieldSelection = (entryField: string, shape: "edge" | "direct") => {
    const entrySelection =
      shape === "edge"
        ? `${entryField} { node { sourceUrl altText mediaDetails { width height } } }`
        : `${entryField} { sourceUrl altText mediaDetails { width height } }`;
    return PORTFOLIO_ACF_GROUP_FIELD
      ? `${PORTFOLIO_ACF_GROUP_FIELD} { ${entrySelection} }`
      : entrySelection;
  };

  const buildQueryWithSeo = (entryField: string, shape: "edge" | "direct") => `
      query GetPortfolioItem($slug: ID!) {
        portfolioItem(id: $slug, idType: SLUG) {
          slug
          title
          content
          date
          featuredImage { node { sourceUrl altText mediaDetails { width height } } }
          ${taxSelection}
          ${buildEntryFieldSelection(entryField, shape)}
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

  const buildQueryBase = (entryField: string, shape: "edge" | "direct") => `
      query GetPortfolioItem($slug: ID!) {
        portfolioItem(id: $slug, idType: SLUG) {
          slug
          title
          content
          date
          featuredImage { node { sourceUrl altText mediaDetails { width height } } }
          ${taxSelection}
          ${buildEntryFieldSelection(entryField, shape)}
        }
      }
    `;

  const minimalQuery = `
    query GetPortfolioItem($slug: ID!) {
      portfolioItem(id: $slug, idType: SLUG) {
        slug
        title
        content
        date
        featuredImage { node { sourceUrl altText mediaDetails { width height } } }
      }
    }
  `;

  let item: WpPortfolioNode | null | undefined;
  for (const candidate of PORTFOLIO_ENTRY_FIELD_CANDIDATES) {
    for (const shape of ["edge", "direct"] as const) {
      const raw = await wpFetchRaw<PortfolioResponse>(buildQueryWithSeo(candidate, shape), { slug });
      const data = raw?.errors && isMissingYoastSeoField(raw.errors)
        ? await wpFetch<PortfolioResponse>(buildQueryBase(candidate, shape), { slug })
        : raw?.data;
      item = data?.portfolioItem;
      if (item) break;
    }
    if (item) break;
  }

  // Final fallback: avoid breaking the page if ACF/tax fields are not queryable.
  if (!item) {
    const data = await wpFetch<PortfolioResponse>(minimalQuery, { slug });
    item = data?.portfolioItem ?? null;
  }

  if (!item) return null;

  const categories = mapWpTerms(getPortfolioTaxonomyConnection(item));

  return {
    slug: item.slug ?? "",
    title: item.title ?? "",
    content: item.content ?? undefined,
    date: item.date ?? undefined,
    featuredImage: mapWpImage(item.featuredImage?.node),
    entryImage: mapWpImage(getPortfolioEntryImageNode(item)),
    categories,
    category: categories?.[0]?.name ?? undefined,
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

