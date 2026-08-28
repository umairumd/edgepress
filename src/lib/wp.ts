import { stripHtml } from "@/lib/utils";

const WP_ENDPOINT = (process.env.WP_GRAPHQL_ENDPOINT || "").trim() || undefined;

function toLikelyOriginalUrl(url: string): string {
  try {
    const u = new URL(url);
    // Strip WordPress size suffixes: -300x200, -scaled, -rotated from filename
    u.pathname = u.pathname
      .replace(/-\d+x\d+(\.[a-z]+)$/i, "$1")
      .replace(/-scaled(\.[a-z]+)$/i, "$1")
      .replace(/-rotated(\.[a-z]+)$/i, "$1");
    return u.toString();
  } catch {
    return url;
  }
}

type WPImage = {
  url: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
};

type WpMediaNode = {
  sourceUrl?: string | null;
  guid?: string | null;
  mediaItemUrl?: string | null;
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
  const raw = (node?.guid || node?.sourceUrl || node?.mediaItemUrl || "").trim();
  if (!raw) return undefined;
  const url = normalizeWpMediaUrl(toLikelyOriginalUrl(raw));
  if (!url) return undefined;
  return {
    url,
    alt: node?.altText,
    width: node?.mediaDetails?.width ?? null,
    height: node?.mediaDetails?.height ?? null,
  };
}

/**
 * Ensures an alt text is present; returns the fallback if alt is empty/undefined.
 * Used to guarantee all images have meaningful alt text for SEO.
 */
function ensureAlt(alt: string | null | undefined, fallback: string): string {
  return alt?.trim() || fallback;
}

/**
 * Maps a WordPress image with a guaranteed alt fallback.
 */
function mapWpImageWithAlt(node: WpMediaNode | null | undefined, fallbackAlt: string): WPImage | undefined {
  const img = mapWpImage(node);
  if (!img) return undefined;
  return { ...img, alt: ensureAlt(img.alt, fallbackAlt) };
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
  categories?: Array<{ slug: string; name: string }>;
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

function isMissingExcerptField(errors?: Array<{ message?: string }>) {
  if (!errors?.length) return false;
  return errors.some((e) => (e.message || "").includes('Cannot query field "excerpt"'));
}

export interface SiteSettings {
  maintenanceActive: boolean;
  maintenancePassword: string;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await wpFetch<{
    page: {
      siteSettings: {
        maintenanceActive: boolean;
        maintenancePassword: string;
      };
    } | null;
  }>(
    `query GetSiteSettings {
      page(id: "maintenance-settings", idType: URI) {
        siteSettings {
          maintenanceActive
          maintenancePassword
        }
      }
    }`
  );
  return {
    maintenanceActive: data?.page?.siteSettings?.maintenanceActive ?? false,
    maintenancePassword: data?.page?.siteSettings?.maintenancePassword ?? "",
  };
}

export async function getPosts(limit = 12): Promise<Post[]> {
  const baseSelection = `
    slug
    title
    excerpt
    date
    categories { nodes { slug name } }
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

  return nodes.map((node) => {
    const title = node.title ?? "";
    const categories = mapWpTerms(node.categories);
    return {
      slug: node.slug ?? "",
      title,
      excerpt: node.excerpt ?? undefined,
      date: node.date ?? undefined,
      categories,
      category: categories?.[0]?.name ?? node.categories?.nodes?.[0]?.name ?? undefined,
      featuredImage: mapWpImageWithAlt(node.featuredImage?.node, stripHtml(title) || "Blog post"),
      featured: getPostFeaturedFlag(node) ?? false,
    };
  });
}

const POST_LISTING_SELECTION = `
  slug
  title
  excerpt
  date
  categories { nodes { slug name } }
  featuredImage { node { sourceUrl altText mediaDetails { width height } } }
`;

type PostsConnection = {
  nodes?: WpPostNode[];
  pageInfo?: {
    hasNextPage?: boolean;
    endCursor?: string | null;
    offsetPagination?: {
      total?: number | null;
      hasMore?: boolean | null;
      hasPrevious?: boolean | null;
    } | null;
  };
};

export type PostsPage = {
  posts: Post[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

function mapPostListingNodes(nodes: WpPostNode[]): Post[] {
  return nodes.map((node) => {
    const title = node.title ?? "";
    const categories = mapWpTerms(node.categories);
    return {
      slug: node.slug ?? "",
      title,
      excerpt: node.excerpt ?? undefined,
      date: node.date ?? undefined,
      categories,
      category: categories?.[0]?.name ?? node.categories?.nodes?.[0]?.name ?? undefined,
      featuredImage: mapWpImageWithAlt(node.featuredImage?.node, stripHtml(title) || "Blog post"),
    };
  });
}

function buildPostsPageResult(
  nodes: WpPostNode[],
  page: number,
  perPage: number,
  total: number,
  hasMore?: boolean | null,
  hasPrevious?: boolean | null
): PostsPage {
  const totalPages = total > 0 ? Math.max(1, Math.ceil(total / perPage)) : 1;
  return {
    posts: mapPostListingNodes(nodes),
    page,
    perPage,
    total,
    totalPages,
    hasPreviousPage: hasPrevious ?? page > 1,
    hasNextPage: hasMore ?? (total > 0 ? page < totalPages : nodes.length === perPage),
  };
}

function sanitizeCategoryName(input?: string): string | undefined {
  if (!input) return undefined;
  const name = input.trim();
  return name || undefined;
}

function postsWhereGraphql(opts: { withOffset?: boolean; withCategory?: boolean }): string {
  const lines = ["orderby: { field: DATE, order: DESC }"];
  if (opts.withOffset) {
    lines.unshift("offsetPagination: { size: $size, offset: $offset }");
  }
  if (opts.withCategory) {
    lines.push("categoryName: $categoryName");
  }
  return lines.join("\n          ");
}

async function getPostsPaginatedOffset(
  page: number,
  perPage: number,
  categoryName?: string
): Promise<PostsPage | null> {
  const offset = (page - 1) * perPage;
  const withCategory = Boolean(categoryName);
  const query = `
    query GetPostsPaginated($size: Int!, $offset: Int!${withCategory ? ", $categoryName: String!" : ""}) {
      posts(
        where: {
          ${postsWhereGraphql({ withOffset: true, withCategory })}
        }
      ) {
        nodes { ${POST_LISTING_SELECTION} }
        pageInfo {
          offsetPagination {
            total
            hasMore
            hasPrevious
          }
        }
      }
    }
  `;

  const raw = await wpFetchRaw<{ posts?: PostsConnection }>(query, {
    size: perPage,
    offset,
    ...(categoryName ? { categoryName } : {}),
  });
  if (raw?.errors?.length) return null;

  const conn = raw?.data?.posts;
  const nodes = conn?.nodes ?? [];
  const pagination = conn?.pageInfo?.offsetPagination;
  const total = pagination?.total ?? 0;

  return buildPostsPageResult(
    nodes,
    page,
    perPage,
    total,
    pagination?.hasMore,
    pagination?.hasPrevious
  );
}

const POST_TOTAL_CACHE_TTL_MS = 300_000;
let postTotalCache: { key: string; total: number; fetchedAt: number } | null = null;

function postsCursorCountQuery(withCategory: boolean): string {
  return `
    query GetPostsCursorPage($first: Int!, $after: String${withCategory ? ", $categoryName: String!" : ""}) {
      posts(
        first: $first
        after: $after
        where: {
          ${postsWhereGraphql({ withCategory })}
        }
      ) {
        nodes { slug }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;
}

async function countPostsWithCursor(categoryName?: string): Promise<number> {
  const withCategory = Boolean(categoryName);
  const query = postsCursorCountQuery(withCategory);
  let total = 0;
  let after: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const data: { posts?: PostsConnection } | null = await wpFetch<{ posts?: PostsConnection }>(
      query,
      { first: 100, after, ...(categoryName ? { categoryName } : {}) }
    );
    const conn: PostsConnection | undefined = data?.posts;
    const batch = conn?.nodes ?? [];
    total += batch.length;
    hasNextPage = Boolean(conn?.pageInfo?.hasNextPage);
    after = conn?.pageInfo?.endCursor ?? null;
    if (!batch.length) break;
  }

  return total;
}

async function getPostTotalCount(categoryName?: string): Promise<number> {
  const cacheKey = categoryName ?? "";
  const now = Date.now();
  if (
    postTotalCache &&
    postTotalCache.key === cacheKey &&
    now - postTotalCache.fetchedAt < POST_TOTAL_CACHE_TTL_MS
  ) {
    return postTotalCache.total;
  }

  const withCategory = Boolean(categoryName);
  const totalQuery = `
    query GetPostTotal${withCategory ? "($categoryName: String!)" : ""} {
      posts(where: {
        offsetPagination: { size: 1, offset: 0 }
        ${withCategory ? "categoryName: $categoryName" : ""}
      }) {
        pageInfo {
          offsetPagination {
            total
          }
        }
      }
    }
  `;
  const raw = await wpFetchRaw<{ posts?: PostsConnection }>(
    totalQuery,
    categoryName ? { categoryName } : undefined
  );
  const offsetTotal = raw?.data?.posts?.pageInfo?.offsetPagination?.total;
  const total =
    typeof offsetTotal === "number" && offsetTotal >= 0
      ? offsetTotal
      : await countPostsWithCursor(categoryName);

  postTotalCache = { key: cacheKey, total, fetchedAt: now };
  return total;
}

async function getPostsPaginatedCursor(
  page: number,
  perPage: number,
  categoryName?: string
): Promise<PostsPage> {
  if (process.env.NODE_ENV !== "production") {
    console.warn("[getPostsPaginated] offsetPagination unavailable; using cursor fallback");
  }

  const total = await getPostTotalCount(categoryName);
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const withCategory = Boolean(categoryName);

  const query = `
    query GetPostsCursorPage($first: Int!, $after: String${withCategory ? ", $categoryName: String!" : ""}) {
      posts(
        first: $first
        after: $after
        where: {
          ${postsWhereGraphql({ withCategory })}
        }
      ) {
        nodes { ${POST_LISTING_SELECTION} }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  let after: string | null = null;
  let currentPage = 1;
  let nodes: WpPostNode[] = [];

  while (currentPage <= page) {
    const data: { posts?: PostsConnection } | null = await wpFetch<{ posts?: PostsConnection }>(query, {
      first: perPage,
      after,
      ...(categoryName ? { categoryName } : {}),
    });
    const conn: PostsConnection | undefined = data?.posts;
    nodes = conn?.nodes ?? [];
    const hasNextPage = Boolean(conn?.pageInfo?.hasNextPage);
    after = conn?.pageInfo?.endCursor ?? null;

    if (currentPage === page) {
      return buildPostsPageResult(
        nodes,
        page,
        perPage,
        total,
        page < totalPages,
        page > 1
      );
    }

    if (!hasNextPage) {
      return buildPostsPageResult([], page, perPage, total, false, page > 1);
    }
    currentPage += 1;
  }

  return buildPostsPageResult(nodes, page, perPage, total, page < totalPages, page > 1);
}

export async function getPostsPaginated(
  page = 1,
  perPage = 12,
  categoryName?: string
): Promise<PostsPage> {
  const safePage = Math.max(1, Math.floor(page) || 1);
  const safePerPage = Math.max(1, Math.floor(perPage) || 12);
  const safeCategoryName = sanitizeCategoryName(categoryName);

  const offsetResult = await getPostsPaginatedOffset(safePage, safePerPage, safeCategoryName);
  if (offsetResult) return offsetResult;

  return getPostsPaginatedCursor(safePage, safePerPage, safeCategoryName);
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

  const title = post.title ?? "";
  const titleAlt = stripHtml(title) || "Blog post";

  return {
    slug: post.slug ?? "",
    title,
    excerpt: post.excerpt ?? undefined,
    content: post.content ?? undefined,
    date: post.date ?? undefined,
    category: post.categories?.nodes?.[0]?.name ?? undefined,
    author: post.author?.node?.name ?? undefined,
    featuredImage: mapWpImageWithAlt(post.featuredImage?.node, titleAlt),
    seo: post.seo
      ? {
          title: post.seo.title,
          metaDesc: post.seo.metaDesc,
          canonical: post.seo.canonical,
          opengraphTitle: post.seo.opengraphTitle,
          opengraphDescription: post.seo.opengraphDescription,
          opengraphImage: mapWpImageWithAlt(post.seo.opengraphImage, titleAlt),
          twitterTitle: post.seo.twitterTitle,
          twitterDescription: post.seo.twitterDescription,
          twitterImage: mapWpImageWithAlt(post.seo.twitterImage, titleAlt),
        }
      : undefined,
  };
}

export async function getRecentPosts(limit = 5): Promise<Post[]> {
  const baseSelection = `
    slug
    title
    date
    categories { nodes { slug name } }
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

  return nodes.map((node) => {
    const title = node.title ?? "";
    const categories = mapWpTerms(node.categories);
    return {
      slug: node.slug ?? "",
      title,
      date: node.date ?? undefined,
      categories,
      category: categories?.[0]?.name ?? node.categories?.nodes?.[0]?.name ?? undefined,
      featuredImage: mapWpImageWithAlt(node.featuredImage?.node, stripHtml(title) || "Blog post"),
      featured: getPostFeaturedFlag(node) ?? false,
    };
  });
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
  try {
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
  } catch {
    console.warn("[wp] getCategories failed, returning []");
    return [];
  }
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
    const title = node.title ?? "";
    const titleAlt = stripHtml(title) || "Portfolio project";
    return {
      slug: node.slug ?? "",
      title,
      date: node.date ?? undefined,
      featuredImage: mapWpImageWithAlt(node.featuredImage?.node, titleAlt),
      entryImage: mapWpImageWithAlt(getPortfolioEntryImageNode(node), titleAlt),
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
  const mediaFields = "sourceUrl guid mediaItemUrl altText mediaDetails { width height }";
  const buildEntryFieldSelection = (entryField: string, shape: "edge" | "direct") => {
    const entrySelection =
      shape === "edge"
        ? `${entryField} { node { ${mediaFields} } }`
        : `${entryField} { ${mediaFields} }`;
    const featureSelection = PORTFOLIO_FEATURE_FIELD ? `${PORTFOLIO_FEATURE_FIELD}` : "";
    return PORTFOLIO_ACF_GROUP_FIELD
      ? `${PORTFOLIO_ACF_GROUP_FIELD} { ${entrySelection} ${featureSelection} }`
      : `${entrySelection} ${featureSelection}`;
  };

  const buildQueryWithSeo = (entryField: string, shape: "edge" | "direct", includeExcerpt: boolean) => `
      query GetPortfolioItem($slug: ID!) {
        portfolioItem(id: $slug, idType: SLUG) {
          slug
          title
          ${includeExcerpt ? "excerpt" : ""}
          content
          date
          featuredImage { node { ${mediaFields} } }
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

  const buildQueryBase = (entryField: string, shape: "edge" | "direct", includeExcerpt: boolean) => `
      query GetPortfolioItem($slug: ID!) {
        portfolioItem(id: $slug, idType: SLUG) {
          slug
          title
          ${includeExcerpt ? "excerpt" : ""}
          content
          date
          featuredImage { node { ${mediaFields} } }
          ${taxSelection}
          ${buildEntryFieldSelection(entryField, shape)}
        }
      }
    `;

  const buildMinimalQuery = (includeExcerpt: boolean) => `
    query GetPortfolioItem($slug: ID!) {
      portfolioItem(id: $slug, idType: SLUG) {
        slug
        title
        ${includeExcerpt ? "excerpt" : ""}
        content
        date
        featuredImage { node { ${mediaFields} } }
      }
    }
  `;

  async function resolvePortfolioResponse(
    raw: WPGraphQlResponse<PortfolioResponse> | null,
    entryField: string,
    shape: "edge" | "direct"
  ): Promise<WpPortfolioNode | null | undefined> {
    if (!raw) return undefined;

    // Prefer success with no errors.
    if (!raw.errors?.length && raw.data?.portfolioItem) {
      return raw.data.portfolioItem;
    }

    let includeExcerpt = true;
    let includeSeo = true;

    if (raw.errors && isMissingExcerptField(raw.errors)) {
      includeExcerpt = false;
    }
    if (raw.errors && isMissingYoastSeoField(raw.errors)) {
      includeSeo = false;
    }

    // If the only issue was a missing field we know how to drop, retry.
    if (raw.errors && (!includeExcerpt || !includeSeo)) {
      if (includeSeo) {
        const retrySeo = await wpFetchRaw<PortfolioResponse>(
          buildQueryWithSeo(entryField, shape, includeExcerpt),
          { slug }
        );
        if (retrySeo && !retrySeo.errors?.length && retrySeo.data?.portfolioItem) {
          return retrySeo.data.portfolioItem;
        }
        // SEO query still failed (e.g. excerpt ok but seo missing was detected on retry path).
        if (retrySeo?.errors && isMissingYoastSeoField(retrySeo.errors)) {
          includeSeo = false;
        }
      }

      if (!includeSeo) {
        const retryBase = await wpFetchRaw<PortfolioResponse>(
          buildQueryBase(entryField, shape, includeExcerpt),
          { slug }
        );
        if (retryBase && !retryBase.errors?.length && retryBase.data?.portfolioItem) {
          return retryBase.data.portfolioItem;
        }
        // Base still fails solely on excerpt — strip it.
        if (retryBase?.errors && isMissingExcerptField(retryBase.errors) && includeExcerpt) {
          const retryBaseNoExcerpt = await wpFetch<PortfolioResponse>(
            buildQueryBase(entryField, shape, false),
            { slug }
          );
          return retryBaseNoExcerpt?.portfolioItem;
        }
      }
    }

    // No actionable field errors — use data if present (partial success), else undefined.
    return raw.data?.portfolioItem ?? undefined;
  }

  let item: WpPortfolioNode | null | undefined;
  for (const candidate of PORTFOLIO_ENTRY_FIELD_CANDIDATES) {
    for (const shape of ["edge", "direct"] as const) {
      const raw = await wpFetchRaw<PortfolioResponse>(
        buildQueryWithSeo(candidate, shape, true),
        { slug }
      );
      item = await resolvePortfolioResponse(raw, candidate, shape);
      if (item) break;
    }
    if (item) break;
  }

  // Final fallback: avoid breaking the page if ACF/tax fields are not queryable.
  // Try minimal with excerpt first; if excerpt is unsupported, retry without it.
  if (!item) {
    const rawMinimal = await wpFetchRaw<PortfolioResponse>(buildMinimalQuery(true), { slug });
    if (rawMinimal && !rawMinimal.errors?.length && rawMinimal.data?.portfolioItem) {
      item = rawMinimal.data.portfolioItem;
    } else if (rawMinimal?.errors && isMissingExcerptField(rawMinimal.errors)) {
      const data = await wpFetch<PortfolioResponse>(buildMinimalQuery(false), { slug });
      item = data?.portfolioItem ?? null;
    } else {
      const data = await wpFetch<PortfolioResponse>(buildMinimalQuery(false), { slug });
      item = data?.portfolioItem ?? null;
    }
  }

  if (!item) return null;

  const categories = mapWpTerms(getPortfolioTaxonomyConnection(item));
  const title = item.title ?? "";
  const titleAlt = stripHtml(title) || "Portfolio project";

  return {
    slug: item.slug ?? "",
    title,
    excerpt: item.excerpt ?? undefined,
    content: item.content ?? undefined,
    date: item.date ?? undefined,
    featuredImage: mapWpImageWithAlt(item.featuredImage?.node, titleAlt),
    entryImage: mapWpImageWithAlt(getPortfolioEntryImageNode(item), titleAlt),
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
          opengraphImage: mapWpImageWithAlt(item.seo.opengraphImage, titleAlt),
          twitterTitle: item.seo.twitterTitle,
          twitterDescription: item.seo.twitterDescription,
          twitterImage: mapWpImageWithAlt(item.seo.twitterImage, titleAlt),
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
            alt: ensureAlt(alt, "Inoma Digital creative showcase"),
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
              alt: ensureAlt(img.altText, "Inoma Digital creative showcase"),
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
          .map((node) => mapWpImageWithAlt(node.featuredImage?.node, "Inoma Digital creative showcase"))
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
              alt: ensureAlt(img.altText, "Inoma Digital creative showcase"),
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

// ============================================================================
// TESTIMONIALS
// ============================================================================

export type Testimonial = {
  id: number;
  name: string;
  designation?: string;
  text: string;
};

type WpTestimonialNode = {
  databaseId?: number | null;
  title?: string | null;
  content?: string | null;
  testimonialFields?: {
    videoType?: string | string[] | null;
    companyName?: string | null;
    [key: string]: unknown;
  } | null;
  // ACF fields - try multiple field name patterns
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

const TESTIMONIAL_ACF_GROUP_CANDIDATES = ["testimonialDetails", "testimonialFields", "acf", "acfFields"];
const TESTIMONIAL_DESIGNATION_FIELD_CANDIDATES = ["designation", "role", "company", "position", "title"];

function getTestimonialDesignation(node: WpTestimonialNode): string | undefined {
  // Try grouped ACF fields first
  for (const groupKey of TESTIMONIAL_ACF_GROUP_CANDIDATES) {
    const group = node?.[groupKey] as Record<string, unknown> | null | undefined;
    if (!group) continue;
    for (const fieldKey of TESTIMONIAL_DESIGNATION_FIELD_CANDIDATES) {
      const val = group?.[fieldKey];
      if (typeof val === "string" && val.trim()) return val.trim();
    }
  }
  // Try top-level fields
  for (const fieldKey of TESTIMONIAL_DESIGNATION_FIELD_CANDIDATES) {
    const val = node?.[fieldKey];
    if (typeof val === "string" && val.trim()) return val.trim();
  }
  return undefined;
}

/**
 * Fetch testimonials from WordPress.
 * Supports Custom Post Type "testimonials" or "testimonial".
 */
export async function getTestimonials(limit = 10): Promise<Testimonial[]> {
  const cptCandidates = ["testimonials", "testimonial"];

  // Build ACF field selection dynamically
  const acfFieldSelection = TESTIMONIAL_DESIGNATION_FIELD_CANDIDATES.join(" ");
  const acfGroupSelections = TESTIMONIAL_ACF_GROUP_CANDIDATES.map(
    (g) => `${g} { ${acfFieldSelection} }`
  ).join(" ");

  for (const cptName of cptCandidates) {
    // Try with ACF fields first
    const queryWithAcf = `
      query GetTestimonials($limit: Int!) {
        ${cptName}(first: $limit, where: {orderby: {field: DATE, order: DESC}}) {
          nodes {
            databaseId
            title
            content
            testimonialFields { youtubeId }
            ${acfGroupSelections}
            ${acfFieldSelection}
          }
        }
      }
    `;

    const rawWithAcf = await wpFetchRaw<Record<string, { nodes?: WpTestimonialNode[] } | null>>(
      queryWithAcf,
      { limit }
    );

    if (rawWithAcf && !rawWithAcf.errors && rawWithAcf.data) {
      const cptData = rawWithAcf.data[cptName];
      const nodes = cptData?.nodes;

      if (Array.isArray(nodes) && nodes.length > 0) {
        const items: Testimonial[] = [];
        for (const [idx, node] of nodes.entries()) {
          const fields = node?.testimonialFields as Record<string, unknown> | null | undefined;
          const youtubeId = fields?.youtubeId ?? fields?.youtube_id ?? null;

          // Skip video testimonials
          if (youtubeId && String(youtubeId).trim() !== "") continue;

          // Skip posts with no text content
          if (!node.content || node.content.trim() === "") continue;

          items.push({
            id: node.databaseId ?? idx + 1,
            name: node.title ?? "Anonymous",
            designation: getTestimonialDesignation(node),
            text: stripHtml(node.content ?? ""),
          });
        }
        if (items.length > 0) return items;
      }
    }

    // Fallback: try without ACF fields
    const queryBase = `
      query GetTestimonials($limit: Int!) {
        ${cptName}(first: $limit, where: {orderby: {field: DATE, order: DESC}}) {
          nodes {
            databaseId
            title
            content
          }
        }
      }
    `;

    const rawBase = await wpFetchRaw<Record<string, { nodes?: WpTestimonialNode[] } | null>>(
      queryBase,
      { limit }
    );

    if (rawBase && !rawBase.errors && rawBase.data) {
      const cptData = rawBase.data[cptName];
      const nodes = cptData?.nodes;

      if (Array.isArray(nodes) && nodes.length > 0) {
        const items: Testimonial[] = [];
        for (const [idx, node] of nodes.entries()) {
          // Without ACF we can still skip empty-content (video) posts
          if (!node.content || node.content.trim() === "") continue;
          items.push({
            id: node.databaseId ?? idx + 1,
            name: node.title ?? "Anonymous",
            designation: undefined,
            text: stripHtml(node.content ?? ""),
          });
        }
        if (items.length > 0) return items;
      }
    }
  }

  // No testimonials found
  return [];
}

export type TestimonialItem = {
  id: string;
  slug: string;
  title: string;
  youtubeId: string;
  thumbnailUrl?: string;
  companyName?: string;
  aspectRatio: "16:9" | "9:16";
};

function extractYoutubeId(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname.replace(/^www\./, "") === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id || undefined;
    }
    const fromQuery = url.searchParams.get("v");
    if (fromQuery) return fromQuery;
    const parts = url.pathname.split("/").filter(Boolean);
    const embedIdx = parts.indexOf("embed");
    if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];
    const shortsIdx = parts.indexOf("shorts");
    if (shortsIdx >= 0 && parts[shortsIdx + 1]) return parts[shortsIdx + 1];
  } catch {
    return trimmed;
  }
  return trimmed;
}

function getTestimonialYoutubeId(node: WpTestimonialNode): string | undefined {
  const group = node?.testimonialFields as Record<string, unknown> | null | undefined;
  return extractYoutubeId(group?.youtubeId) ?? extractYoutubeId(node?.youtubeId);
}

function getTestimonialThumbnailUrl(node: WpTestimonialNode): string | undefined {
  const readMedia = (field: unknown): string | undefined => {
    if (!field || typeof field !== "object") return undefined;
    const edge = field as WpMediaEdge;
    if (edge && typeof edge === "object" && "node" in edge) {
      return mapWpImage(edge.node)?.url;
    }
    return mapWpImage(field as WpMediaNode)?.url;
  };
  const group = node?.testimonialFields as Record<string, unknown> | null | undefined;
  return readMedia(group?.customThumbnail) ?? readMedia(node?.customThumbnail);
}

/**
 * Fetch video testimonials (YouTube) from WordPress.
 * Uses CPT "testimonials" / "testimonial" and ACF group "testimonialFields".
 */
export async function getVideoTestimonials(limit = 20): Promise<TestimonialItem[]> {
  try {
    const cptCandidates = ["testimonials", "testimonial"];
    const thumbSelections = [
      `testimonialFields { youtubeId companyName customThumbnail { node { sourceUrl altText mediaDetails { width height } } } }`,
      `testimonialFields { youtubeId companyName customThumbnail { sourceUrl altText mediaDetails { width height } } }`,
      `testimonialFields { youtubeId companyName } youtubeId customThumbnail { node { sourceUrl altText mediaDetails { width height } } }`,
      `testimonialFields { youtubeId companyName } youtubeId`,
      `youtubeId customThumbnail { node { sourceUrl altText mediaDetails { width height } } }`,
      `youtubeId`,
    ];

    for (const cptName of cptCandidates) {
      for (const extraSelection of thumbSelections) {
        const query = `
          query GetVideoTestimonials($limit: Int!) {
            ${cptName}(first: $limit, where: {orderby: {field: DATE, order: DESC}}) {
              nodes {
                databaseId
                slug
                title
                ${extraSelection}
              }
            }
          }
        `;

        const raw = await wpFetchRaw<Record<string, { nodes?: WpTestimonialNode[] } | null>>(query, {
          limit,
        });
        if (!raw || raw.errors?.length || !raw.data) continue;

        const nodes = raw.data[cptName]?.nodes;
        if (!Array.isArray(nodes) || !nodes.length) continue;

        const items: TestimonialItem[] = [];
        for (const [idx, node] of nodes.entries()) {
          const youtubeId = getTestimonialYoutubeId(node);
          if (!youtubeId) continue;
          const thumbnailUrl = getTestimonialThumbnailUrl(node);
          const rawCompany = node?.testimonialFields?.companyName;
          const companyName =
            typeof rawCompany === "string" && rawCompany.trim()
              ? rawCompany.trim()
              : undefined;
          items.push({
            id: String(node.databaseId ?? node.slug ?? idx),
            slug: String(node.slug ?? node.databaseId ?? idx),
            title: node.title ?? "Client",
            youtubeId,
            aspectRatio: "16:9" as const,
            ...(thumbnailUrl ? { thumbnailUrl } : {}),
            ...(companyName ? { companyName } : {}),
          });
        }

        if (items.length) return items;
      }
    }

    return [];
  } catch (err) {
    console.error("[wp] getTestimonials failed:", err);
    return [];
  }
}

// ============================================================================
// TEAM MEMBERS
// ============================================================================

export type TeamMember = {
  id: number;
  name: string;
  role?: string;
  image?: WPImage;
};

type WpTeamMemberNode = {
  databaseId?: number | null;
  title?: string | null;
  featuredImage?: { node?: WpMediaNode | null } | null;
  // ACF fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

const TEAM_ACF_GROUP_CANDIDATES = ["teamDetails", "teamFields", "acf", "acfFields"];
const TEAM_ROLE_FIELD_CANDIDATES = [
  "role",
  "designation",
  "position",
  "jobTitle",
  "job_title",
  "member_role",
  "team_role",
  "staff_role",
  "title",
];

function getTeamMemberRole(node: WpTeamMemberNode): string | undefined {
  // Try grouped ACF fields first (e.g. teamDetails from "Team Details" field group)
  for (const groupKey of TEAM_ACF_GROUP_CANDIDATES) {
    const group = node?.[groupKey] as Record<string, unknown> | null | undefined;
    if (!group) continue;
    for (const fieldKey of TEAM_ROLE_FIELD_CANDIDATES) {
      const val = group?.[fieldKey];
      if (typeof val === "string" && val.trim()) return val.trim();
    }
  }
  // Try top-level fields (ACF interface can expose fields on parent)
  for (const fieldKey of TEAM_ROLE_FIELD_CANDIDATES) {
    const val = node?.[fieldKey];
    if (typeof val === "string" && val.trim()) return val.trim();
  }
  return undefined;
}

/**
 * Fetch team members from WordPress.
 * Supports Custom Post Types: "teamMembers", "team_members", "team".
 */
export async function getTeamMembers(limit = 20): Promise<TeamMember[]> {
  const cptCandidates = ["teamMembers", "team_members", "teamMember", "team", "teams"];

  // ACF "Team Details" group - request only "role" to avoid GraphQL validation
  // errors. If your ACF field uses a different name (e.g. designation), add it
  // here and in TEAM_ROLE_FIELD_CANDIDATES.
  const teamDetailsSelection = "teamDetails { role }";

  for (const cptName of cptCandidates) {
    // Try with ACF teamDetails first (matches "Team Details" field group, GraphQL Type TeamDetails)
    const queryWithAcf = `
      query GetTeamMembers($limit: Int!) {
        ${cptName}(first: $limit, where: {orderby: {field: MENU_ORDER, order: ASC}}) {
          nodes {
            databaseId
            title
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
            ${teamDetailsSelection}
          }
        }
      }
    `;

    const rawWithAcf = await wpFetchRaw<Record<string, { nodes?: WpTeamMemberNode[] } | null>>(
      queryWithAcf,
      { limit }
    );

    if (rawWithAcf && !rawWithAcf.errors && rawWithAcf.data) {
      const cptData = rawWithAcf.data[cptName];
      const nodes = cptData?.nodes;

      if (Array.isArray(nodes) && nodes.length > 0) {
        return nodes.map((node, idx) => {
          const name = node.title ?? "Team Member";
          const role = getTeamMemberRole(node);
          return {
            id: node.databaseId ?? idx + 1,
            name,
            role,
            image: mapWpImageWithAlt(node.featuredImage?.node, `${name}${role ? ` - ${role}` : ""}`),
          };
        });
      }
    }

    // Fallback: try without ACF fields, just featured image
    const queryBase = `
      query GetTeamMembers($limit: Int!) {
        ${cptName}(first: $limit, where: {orderby: {field: MENU_ORDER, order: ASC}}) {
          nodes {
            databaseId
            title
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

    const rawBase = await wpFetchRaw<Record<string, { nodes?: WpTeamMemberNode[] } | null>>(
      queryBase,
      { limit }
    );

    if (rawBase && !rawBase.errors && rawBase.data) {
      const cptData = rawBase.data[cptName];
      const nodes = cptData?.nodes;

      if (Array.isArray(nodes) && nodes.length > 0) {
        return nodes.map((node, idx) => {
          const name = node.title ?? "Team Member";
          return {
            id: node.databaseId ?? idx + 1,
            name,
            role: undefined,
            image: mapWpImageWithAlt(node.featuredImage?.node, name),
          };
        });
      }
    }
  }

  // No team members found
  return [];
}

// ============================================================================
// PAGES
// ============================================================================

export type WpPage = {
  slug: string;
  title: string;
  content?: string;
};

/**
 * Fetch the Privacy Policy WordPress page by slug.
 * WPGraphQL PageIdType supports URI (not SLUG) on this schema.
 */
export async function getPrivacyPolicy(): Promise<WpPage | null> {
  type PageResponse = {
    page: { slug?: string | null; title?: string | null; content?: string | null } | null;
  };

  const query = `
    query GetPrivacyPolicy($id: ID!) {
      page(id: $id, idType: URI) {
        slug
        title
        content
      }
    }
  `;

  for (const id of ["privacy-policy", "/privacy-policy"]) {
    const data = await wpFetch<PageResponse>(query, { id });
    if (data?.page) {
      return {
        slug: data.page.slug ?? "privacy-policy",
        title: data.page.title ?? "Privacy Policy",
        content: data.page.content ?? undefined,
      };
    }
  }

  return null;
}

// ============================================================================
// SERVICES
// ============================================================================

export interface ServiceListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  iconUrl?: string;
}

export interface ServiceDetail extends ServiceListItem {
  tagline?: string;
  heroHeadline?: string;
  section1Heading?: string;
  section1Text?: string;
  section1ImageUrl?: string;
  section1ImageSide?: "left" | "right";
  section2Heading?: string;
  section2Text?: string;
  section2ImageUrl?: string;
  section2ImageSide?: "left" | "right";
  section3Heading?: string;
  section3Text?: string;
  section3ImageUrl?: string;
  section3ImageSide?: "left" | "right";
  ctaHeading?: string;
  ctaButtonLabel?: string;
  seo?: YoastSeo;
}

type WpServiceNode = {
  databaseId?: number | null;
  slug?: string | null;
  title?: string | null;
  serviceFields?: {
    excerptSummary?: string | null;
    tagline?: string | null;
    heroHeadline?: string | null;
    icon?: { node?: { mediaItemUrl?: string | null } | null } | null;
    section1Heading?: string | null;
    section1Text?: string | null;
    section1Image?: {
      node?: {
        mediaItemUrl?: string | null;
        altText?: string | null;
        mediaDetails?: { width?: number | null; height?: number | null } | null;
      } | null;
    } | null;
    section1ImageSide?: unknown;
    section2Heading?: string | null;
    section2Text?: string | null;
    section2Image?: {
      node?: {
        mediaItemUrl?: string | null;
        altText?: string | null;
        mediaDetails?: { width?: number | null; height?: number | null } | null;
      } | null;
    } | null;
    section2ImageSide?: unknown;
    section3Heading?: string | null;
    section3Text?: string | null;
    section3Image?: {
      node?: {
        mediaItemUrl?: string | null;
        altText?: string | null;
        mediaDetails?: { width?: number | null; height?: number | null } | null;
      } | null;
    } | null;
    section3ImageSide?: unknown;
    ctaHeading?: string | null;
    ctaButtonLabel?: string | null;
  } | null;
  seo?: WpSeoNode | null;
};

export async function getServices(): Promise<ServiceListItem[]> {
  try {
    const data = await wpFetch<{ services?: { nodes?: WpServiceNode[] } | null }>(
      `
      query GetServices {
        services(first: 50, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
          nodes {
            databaseId
            slug
            title
            serviceFields {
              excerptSummary
              icon { node { mediaItemUrl } }
            }
          }
        }
      }
      `
    );
    const nodes = data?.services?.nodes;
    if (!nodes?.length) return [];
    return nodes.map((node) => ({
      id: String(node.databaseId ?? node.slug ?? ""),
      slug: node.slug ?? "",
      title: node.title ?? "",
      excerpt: node.serviceFields?.excerptSummary ?? "",
      iconUrl: normalizeWpMediaUrl(node.serviceFields?.icon?.node?.mediaItemUrl ?? undefined),
    }));
  } catch (err) {
    console.error("[wp] getServices failed:", err);
    return [];
  }
}

export async function getService(slug: string): Promise<ServiceDetail | null> {
  type ServiceResponse = { service?: WpServiceNode | null };

  const queryWithSeo = `
    query GetService($slug: ID!) {
      service(id: $slug, idType: SLUG) {
        databaseId
        slug
        title
        serviceFields {
          tagline
          heroHeadline
          excerptSummary
          icon { node { mediaItemUrl } }
          section1Heading
          section1Text
          section1Image { node { mediaItemUrl altText mediaDetails { width height } } }
          section1ImageSide
          section2Heading
          section2Text
          section2Image { node { mediaItemUrl altText mediaDetails { width height } } }
          section2ImageSide
          section3Heading
          section3Text
          section3Image { node { mediaItemUrl altText mediaDetails { width height } } }
          section3ImageSide
          ctaHeading
          ctaButtonLabel
        }
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
    query GetService($slug: ID!) {
      service(id: $slug, idType: SLUG) {
        databaseId
        slug
        title
        serviceFields {
          tagline
          heroHeadline
          excerptSummary
          icon { node { mediaItemUrl } }
          section1Heading
          section1Text
          section1Image { node { mediaItemUrl altText mediaDetails { width height } } }
          section1ImageSide
          section2Heading
          section2Text
          section2Image { node { mediaItemUrl altText mediaDetails { width height } } }
          section2ImageSide
          section3Heading
          section3Text
          section3Image { node { mediaItemUrl altText mediaDetails { width height } } }
          section3ImageSide
          ctaHeading
          ctaButtonLabel
        }
      }
    }
  `;

  try {
    const raw = await wpFetchRaw<ServiceResponse>(queryWithSeo, { slug });
    const fallback =
      raw?.errors && isMissingYoastSeoField(raw.errors)
        ? await wpFetch<ServiceResponse>(queryBase, { slug })
        : raw?.data;

    const node = fallback?.service;
    if (!node) return null;

    const sf = node.serviceFields;
    const title = node.title ?? "";

    const mapImageSide = (value?: unknown): "left" | "right" | undefined => {
      if (value == null || value === "") return undefined;
      const raw = Array.isArray(value) ? value[0] : value;
      if (raw == null || raw === "") return undefined;
      const str =
        typeof raw === "string"
          ? raw
          : typeof raw === "object" && raw !== null && "value" in raw
            ? String((raw as Record<string, unknown>).value)
            : String(raw);
      return str.toLowerCase().trim() === "left" ? "left" : "right";
    };

    return {
      id: String(node.databaseId ?? node.slug ?? ""),
      slug: node.slug ?? "",
      title,
      excerpt: sf?.excerptSummary ?? "",
      iconUrl: normalizeWpMediaUrl(sf?.icon?.node?.mediaItemUrl ?? undefined),
      tagline: sf?.tagline ?? undefined,
      heroHeadline: sf?.heroHeadline ?? undefined,
      section1Heading: sf?.section1Heading ?? undefined,
      section1Text: sf?.section1Text ?? undefined,
      section1ImageUrl: normalizeWpMediaUrl(sf?.section1Image?.node?.mediaItemUrl ?? undefined),
      section1ImageSide: mapImageSide(sf?.section1ImageSide),
      section2Heading: sf?.section2Heading ?? undefined,
      section2Text: sf?.section2Text ?? undefined,
      section2ImageUrl: normalizeWpMediaUrl(sf?.section2Image?.node?.mediaItemUrl ?? undefined),
      section2ImageSide: mapImageSide(sf?.section2ImageSide),
      section3Heading: sf?.section3Heading ?? undefined,
      section3Text: sf?.section3Text ?? undefined,
      section3ImageUrl: normalizeWpMediaUrl(sf?.section3Image?.node?.mediaItemUrl ?? undefined),
      section3ImageSide: mapImageSide(sf?.section3ImageSide),
      ctaHeading: sf?.ctaHeading ?? undefined,
      ctaButtonLabel: sf?.ctaButtonLabel ?? undefined,
      seo: node.seo
        ? {
            title: node.seo.title,
            metaDesc: node.seo.metaDesc,
            canonical: node.seo.canonical,
            opengraphTitle: node.seo.opengraphTitle,
            opengraphDescription: node.seo.opengraphDescription,
            opengraphImage: mapWpImageWithAlt(node.seo.opengraphImage, title),
            twitterTitle: node.seo.twitterTitle,
            twitterDescription: node.seo.twitterDescription,
            twitterImage: mapWpImageWithAlt(node.seo.twitterImage, title),
          }
        : undefined,
    };
  } catch (err) {
    console.error("[wp] getService failed:", err);
    return null;
  }
}

