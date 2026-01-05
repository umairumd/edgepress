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
  featured?: boolean;
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
  featured?: boolean;
  seo?: YoastSeo;
};

const PORTFOLIO_TAX_FIELD = (process.env.WP_PORTFOLIO_TAX_FIELD || "").trim() || "portfolioCategories";
const PORTFOLIO_ENTRY_FIELD = (process.env.WP_PORTFOLIO_ENTRY_FIELD || "").trim() || "portfolioEntryImage";
const PORTFOLIO_ACF_GROUP_FIELD = (process.env.WP_PORTFOLIO_ACF_GROUP_FIELD || "").trim() || undefined;
const PORTFOLIO_FEATURE_FIELD = (process.env.WP_PORTFOLIO_FEATURE_FIELD || "").trim() || "featured";

// Blog post "featured" flag (ACF True/False recommended)
const POST_ACF_GROUP_FIELD = (process.env.WP_POST_ACF_GROUP_FIELD || "").trim() || undefined;
const POST_FEATURE_FIELD = (process.env.WP_POST_FEATURE_FIELD || "").trim() || "featuredBlog";
const POST_FEATURE_FIELD_CANDIDATES = Array.from(
  new Set([POST_FEATURE_FIELD, "featuredBlog", "featured", "isFeatured", "isfeatured"].filter(Boolean))
);

const POST_ACF_GROUP_FIELD_CANDIDATES = Array.from(
  new Set([POST_ACF_GROUP_FIELD, "postFields", "blogFields", "acfFields", "acf"].filter(Boolean))
);

const PORTFOLIO_ENTRY_FIELD_CANDIDATES = Array.from(
  // Prefer the most common WPGraphQL-for-ACF casing first to avoid avoidable GraphQL errors.
  new Set(["portfolioEntryImage", PORTFOLIO_ENTRY_FIELD, "portfolioentryimage"].filter(Boolean))
);

const PORTFOLIO_FEATURE_FIELD_CANDIDATES = Array.from(
  new Set([PORTFOLIO_FEATURE_FIELD, "featured", "isFeatured", "isfeatured"].filter(Boolean))
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

function coerceBoolean(value: unknown): boolean | undefined {
  if (value === true) return true;
  if (value === false) return false;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (["1", "true", "yes", "on"].includes(v)) return true;
    if (["0", "false", "no", "off"].includes(v)) return false;
  }
  return undefined;
}

function getPortfolioFeaturedFlag(node: WpPortfolioNode): boolean | undefined {
  if (PORTFOLIO_ACF_GROUP_FIELD) {
    const group = node?.[PORTFOLIO_ACF_GROUP_FIELD] as Record<string, unknown> | null | undefined;
    for (const key of PORTFOLIO_FEATURE_FIELD_CANDIDATES) {
      const v = coerceBoolean(group?.[key]);
      if (v !== undefined) return v;
    }
    return undefined;
  }
  for (const key of PORTFOLIO_FEATURE_FIELD_CANDIDATES) {
    const v = coerceBoolean(node?.[key]);
    if (v !== undefined) return v;
  }
  return undefined;
}

function getPostFeaturedFlag(node: WpPostNode): boolean | undefined {
  const base = node as unknown as Record<string, unknown>;
  for (const groupKey of POST_ACF_GROUP_FIELD_CANDIDATES) {
    if (!groupKey) continue;
    const group = base?.[groupKey] as Record<string, unknown> | null | undefined;
    if (!group) continue;
    for (const key of POST_FEATURE_FIELD_CANDIDATES) {
      const v = coerceBoolean(group?.[key]);
      if (v !== undefined) return v;
    }
  }
  for (const key of POST_FEATURE_FIELD_CANDIDATES) {
    const v = coerceBoolean(base?.[key]);
    if (v !== undefined) return v;
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
  const baseSelection = `
    slug
    title
    excerpt
    date
    categories(first: 1) { nodes { name } }
    featuredImage { node { sourceUrl altText mediaDetails { width height } } }
  `;

  const wrapFeature = (group: string | undefined, field: string) => (group ? `${group} { ${field} }` : `${field}`);

  // Try to include a "featured" ACF field if it exists; otherwise fall back to the base query.
  let nodes: WpPostNode[] | undefined;
  for (const group of [undefined, ...POST_ACF_GROUP_FIELD_CANDIDATES]) {
    for (const candidate of POST_FEATURE_FIELD_CANDIDATES) {
      const queryWithFeature = `
        query GetPosts($limit: Int!) {
          posts(first: $limit, where: {orderby: {field: DATE, order: DESC}}) {
            nodes { ${baseSelection} ${wrapFeature(group, candidate)} }
          }
        }
      `;
      const raw = await wpFetchRaw<{ posts?: { nodes?: WpPostNode[] } }>(queryWithFeature, { limit });
      if (raw && !raw.errors && raw.data?.posts?.nodes) {
        nodes = raw.data.posts.nodes;
        break;
      }
    }
    if (nodes) break;
  }

  if (!nodes) {
    const queryBase = `
      query GetPosts($limit: Int!) {
        posts(first: $limit, where: {orderby: {field: DATE, order: DESC}}) {
          nodes { ${baseSelection} }
        }
      }
    `;
    const data = await wpFetch<{ posts: { nodes: WpPostNode[] } }>(queryBase, { limit });
    nodes = data?.posts?.nodes;
  }

  if (!nodes) return [];

  return nodes.map((node) => ({
    slug: node.slug ?? "",
    title: node.title ?? "",
    excerpt: node.excerpt ?? undefined,
    date: node.date ?? undefined,
    category: node.categories?.nodes?.[0]?.name ?? undefined,
    featuredImage: mapWpImage(node.featuredImage?.node),
    featured: getPostFeaturedFlag(node) ?? false,
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
  const baseSelection = `
    slug
    title
    date
    categories(first: 1) { nodes { name } }
    featuredImage { node { sourceUrl altText mediaDetails { width height } } }
  `;

  const wrapFeature = (group: string | undefined, field: string) => (group ? `${group} { ${field} }` : `${field}`);

  let nodes: WpPostNode[] | undefined;
  for (const group of [undefined, ...POST_ACF_GROUP_FIELD_CANDIDATES]) {
    for (const candidate of POST_FEATURE_FIELD_CANDIDATES) {
      const queryWithFeature = `
        query GetRecentPosts($limit: Int!) {
          posts(first: $limit, where: {orderby: {field: DATE, order: DESC}}) {
            nodes { ${baseSelection} ${wrapFeature(group, candidate)} }
          }
        }
      `;
      const raw = await wpFetchRaw<{ posts?: { nodes?: WpPostNode[] } }>(queryWithFeature, { limit });
      if (raw && !raw.errors && raw.data?.posts?.nodes) {
        nodes = raw.data.posts.nodes;
        break;
      }
    }
    if (nodes) break;
  }

  if (!nodes) {
    const queryBase = `
      query GetRecentPosts($limit: Int!) {
        posts(first: $limit, where: {orderby: {field: DATE, order: DESC}}) {
          nodes { ${baseSelection} }
        }
      }
    `;
    const data = await wpFetch<{ posts: { nodes: WpPostNode[] } }>(queryBase, { limit });
    nodes = data?.posts?.nodes;
  }

  if (!nodes) return [];

  return nodes.map((node) => ({
    slug: node.slug ?? "",
    title: node.title ?? "",
    date: node.date ?? undefined,
    category: node.categories?.nodes?.[0]?.name ?? undefined,
    featuredImage: mapWpImage(node.featuredImage?.node),
    featured: getPostFeaturedFlag(node) ?? false,
  }));
}

export async function getFeaturedPosts(limit = 2): Promise<Post[]> {
  // Fetch a reasonable amount and filter client-side for maximum WPGraphQL compatibility.
  const all = await getPosts(50);
  return (all || []).filter((p) => p.featured).slice(0, limit);
}

export async function getFeaturedPortfolios(limit = 5): Promise<PortfolioItem[]> {
  // Fetch all portfolios and filter for featured ones.
  // This approach maximizes WPGraphQL compatibility (no custom where clauses needed).
  const all = await getPortfolioItems(100);
  return (all || []).filter((p) => p.featured).slice(0, limit);
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

export async function getPortfolioItems(limit = 200): Promise<PortfolioItem[]> {
  const taxSelection = `${PORTFOLIO_TAX_FIELD} { nodes { slug name } }`;
  const buildQueryFull = (entryField: string, featureField: string, shape: "edge" | "direct") => {
    const entrySelection =
      shape === "edge"
        ? `${entryField} { node { sourceUrl altText mediaDetails { width height } } }`
        : `${entryField} { sourceUrl altText mediaDetails { width height } }`;
    const featureSelection = featureField ? `${featureField}` : "";
    const entryFieldSelection = PORTFOLIO_ACF_GROUP_FIELD
      ? `${PORTFOLIO_ACF_GROUP_FIELD} { ${entrySelection} ${featureSelection} }`
      : `${entrySelection} ${featureSelection}`;
    return `
      query GetPortfolioItems($first: Int!, $after: String) {
        portfolioItems(first: $first, after: $after, where: {orderby: {field: DATE, order: DESC}}) {
          pageInfo { hasNextPage endCursor }
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
    query GetPortfolioItems($first: Int!, $after: String) {
      portfolioItems(first: $first, after: $after, where: {orderby: {field: DATE, order: DESC}}) {
        pageInfo { hasNextPage endCursor }
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
  type PortfolioItemsConnection = { nodes?: WpPortfolioNode[]; pageInfo?: { hasNextPage?: boolean; endCursor?: string | null } };
  let raw: WPGraphQlResponse<{ portfolioItems?: PortfolioItemsConnection }> | null = null;
  let chosenQuery: string | null = null;
  for (const candidate of PORTFOLIO_ENTRY_FIELD_CANDIDATES) {
    for (const featureCandidate of PORTFOLIO_FEATURE_FIELD_CANDIDATES) {
      const qEdge = buildQueryFull(candidate, featureCandidate, "edge");
      raw = await wpFetchRaw<{ portfolioItems?: PortfolioItemsConnection }>(qEdge, { first: Math.min(limit, 50), after: null });
      if (raw && !raw.errors) {
        chosenQuery = qEdge;
        break;
      }
      const qDirect = buildQueryFull(candidate, featureCandidate, "direct");
      raw = await wpFetchRaw<{ portfolioItems?: PortfolioItemsConnection }>(qDirect, { first: Math.min(limit, 50), after: null });
      if (raw && !raw.errors) {
        chosenQuery = qDirect;
        break;
      }
    }
    if (raw && !raw.errors) break;
  }

  // Pagination: gather all items up to `limit` (default 200) so Portfolio page shows everything.
  const out: WpPortfolioNode[] = [];
  let after: string | null | undefined = null;
  let hasNextPage = true;
  const first = Math.min(Math.max(limit, 1), 50);

  // If our dynamic query selection failed, fall back to a minimal query but still paginate.
  if (!chosenQuery) chosenQuery = queryBase;

  while (hasNextPage && out.length < limit) {
    const data: { portfolioItems?: PortfolioItemsConnection } | null = await wpFetch<{ portfolioItems?: PortfolioItemsConnection }>(chosenQuery, { first, after });
    const conn: PortfolioItemsConnection | undefined = data?.portfolioItems;
    const nodes: WpPortfolioNode[] = conn?.nodes ?? [];
    out.push(...nodes);
    hasNextPage = Boolean(conn?.pageInfo?.hasNextPage);
    after = conn?.pageInfo?.endCursor ?? null;
    if (!after) break;
  }

  const nodes = out.slice(0, limit);
  if (!nodes.length) return [];

  return nodes.map((node) => {
    const categories = mapWpTerms(getPortfolioTaxonomyConnection(node));
    return {
      slug: node.slug ?? "",
      title: node.title ?? "",
      date: node.date ?? undefined,
      featuredImage: mapWpImage(node.featuredImage?.node),
      entryImage: mapWpImage(getPortfolioEntryImageNode(node)),
      featured: getPortfolioFeaturedFlag(node) ?? false,
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
    const featureSelection = PORTFOLIO_FEATURE_FIELD ? `${PORTFOLIO_FEATURE_FIELD}` : "";
    return PORTFOLIO_ACF_GROUP_FIELD
      ? `${PORTFOLIO_ACF_GROUP_FIELD} { ${entrySelection} ${featureSelection} }`
      : `${entrySelection} ${featureSelection}`;
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
    featured: getPortfolioFeaturedFlag(item) ?? false,
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

/**
 * Fetch hero slider images from WordPress.
 * Supports multiple approaches (in order of priority):
 * 1. Page content with WordPress Gallery block (NO PLUGINS NEEDED)
 * 2. Page with ACF Gallery field (ACF Pro)
 * 3. Hero Slides CPT - each post's featured image is a slide
 * 4. ACF Options page with gallery field (ACF Pro)
 */
export async function getHeroSlides(): Promise<WPImage[]> {
  type GalleryImage = {
    sourceUrl?: string | null;
    altText?: string | null;
    mediaDetails?: {
      width?: number | null;
      height?: number | null;
    } | null;
  };

  const pageSlugs = [
    "hero-slider",
    "homepage-slider", 
    "slider-settings",
    "homepage-settings",
    "hero-settings",
    "site-settings",
    "home-settings",
  ];

  // Approach 1: Page content with native WordPress Gallery block (NO PLUGINS NEEDED)
  for (const slug of pageSlugs) {
    const contentQuery = `
      query GetHeroSlidesFromContent {
        page(id: "${slug}", idType: URI) {
          content
        }
      }
    `;

    const contentRaw = await wpFetchRaw<{ page?: { content?: string | null } | null }>(contentQuery);
    
    if (contentRaw && !contentRaw.errors && contentRaw.data?.page?.content) {
      const content = contentRaw.data.page.content;
      // Parse image URLs from WordPress gallery block or img tags
      const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*>/gi;
      const images: WPImage[] = [];
      let match;
      
      while ((match = imgRegex.exec(content)) !== null) {
        const url = match[1];
        const alt = match[2] || undefined;
        if (url && !url.includes('emoji') && !url.includes('smilies')) {
          images.push({
            url: normalizeWpMediaUrl(url)!,
            alt,
            width: null,
            height: null,
          });
        }
      }
      
      if (images.length >= 8) {
        return images;
      }
    }
  }

  // Approach 2: Page with ACF Gallery field (ACF Pro)
  const galleryFieldNames = ["heroSlides", "heroSlider", "hero_slides", "hero_slider", "sliderImages", "slider_images", "images"];

  for (const slug of pageSlugs) {
    for (const fieldName of galleryFieldNames) {
      const pageQuery = `
        query GetHeroSlidesFromPage {
          page(id: "${slug}", idType: URI) {
            ${fieldName} {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
          }
        }
      `;

      const raw = await wpFetchRaw<{ page?: Record<string, GalleryImage[] | null> | null }>(pageQuery);
      
      if (raw && !raw.errors && raw.data?.page) {
        const gallery = raw.data.page[fieldName];
        
        if (Array.isArray(gallery) && gallery.length > 0) {
          return gallery
            .filter((img): img is GalleryImage => !!img?.sourceUrl)
            .map((img) => ({
              url: normalizeWpMediaUrl(img.sourceUrl!)!,
              alt: img.altText ?? undefined,
              width: img.mediaDetails?.width ?? null,
              height: img.mediaDetails?.height ?? null,
            }));
        }
      }
    }
  }

  // Approach 3: Hero Slides Custom Post Type
  const cptCandidates = ["heroSlides", "hero_slides", "heroSlide", "hero_slide"];
  
  for (const cptName of cptCandidates) {
    const cptQuery = `
      query GetHeroSlides {
        ${cptName}(first: 15, where: {orderby: {field: MENU_ORDER, order: ASC}}) {
          nodes {
            featuredImage {
              node {
                sourceUrl
                altText
                mediaDetails {
                  width
                  height
                }
              }
            }
          }
        }
      }
    `;

    type CptNode = {
      featuredImage?: {
        node?: WpMediaNode | null;
      } | null;
    };

    const raw = await wpFetchRaw<Record<string, { nodes?: CptNode[] } | null>>(cptQuery);
    
    if (raw && !raw.errors && raw.data) {
      const cptData = raw.data[cptName];
      const nodes = cptData?.nodes;
      
      if (Array.isArray(nodes) && nodes.length > 0) {
        const images = nodes
          .map((node) => mapWpImage(node.featuredImage?.node))
          .filter((img): img is WPImage => !!img?.url);
        
        if (images.length > 0) return images;
      }
    }
  }

  // Approach 3: ACF Options page (requires ACF Pro)
  const ACF_OPTIONS_FIELD_CANDIDATES = ["acfOptionsHeroSettings", "acfOptionsHero", "acfOptionsSiteSettings", "acfOptions"];

  for (const optionsField of ACF_OPTIONS_FIELD_CANDIDATES) {
    for (const galleryField of galleryFieldNames) {
      const query = `
        query GetHeroSlides {
          ${optionsField} {
            ${galleryField} {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
          }
        }
      `;

      const raw = await wpFetchRaw<Record<string, Record<string, GalleryImage[] | null> | null>>(query);
      
      if (raw && !raw.errors && raw.data) {
        const optionsData = raw.data[optionsField];
        const gallery = optionsData?.[galleryField];
        
        if (Array.isArray(gallery) && gallery.length > 0) {
          return gallery
            .filter((img): img is GalleryImage => !!img?.sourceUrl)
            .map((img) => ({
              url: normalizeWpMediaUrl(img.sourceUrl!)!,
              alt: img.altText ?? undefined,
              width: img.mediaDetails?.width ?? null,
              height: img.mediaDetails?.height ?? null,
            }));
        }
      }
    }
  }

  // If no data found, return empty array (fallback to static images in Hero component)
  return [];
}

