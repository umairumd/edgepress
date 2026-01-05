import { NextRequest } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

const WP_ENDPOINT = (process.env.WP_GRAPHQL_ENDPOINT || "").trim() || undefined;
const WP_MEDIA_DOMAIN = (process.env.WP_MEDIA_DOMAIN || "").trim() || undefined;

type CacheEntry = {
  buf: Buffer;
  meta: { width: number; height: number };
  bytes: number;
  ts: number;
};

// In-memory cache (best-effort): speeds up subsequent slice requests for the same big image.
// This mainly helps the "first view" where the browser requests multiple slices quickly.
const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_MAX_BYTES = 80 * 1024 * 1024;
const cache = (globalThis as unknown as { __inomaImgCache?: Map<string, CacheEntry> }).__inomaImgCache ?? new Map<string, CacheEntry>();
(globalThis as unknown as { __inomaImgCache?: Map<string, CacheEntry> }).__inomaImgCache = cache;

function cacheBytesTotal() {
  let total = 0;
  for (const v of cache.values()) total += v.bytes;
  return total;
}

function evictIfNeeded() {
  const now = Date.now();
  for (const [k, v] of cache.entries()) {
    if (now - v.ts > CACHE_TTL_MS) cache.delete(k);
  }
  while (cacheBytesTotal() > CACHE_MAX_BYTES && cache.size) {
    // Evict oldest
    let oldestKey: string | null = null;
    let oldestTs = Infinity;
    for (const [k, v] of cache.entries()) {
      if (v.ts < oldestTs) {
        oldestTs = v.ts;
        oldestKey = k;
      }
    }
    if (!oldestKey) break;
    cache.delete(oldestKey);
  }
}

function allowedHosts(): Set<string> {
  const out = new Set<string>();
  if (WP_MEDIA_DOMAIN) out.add(WP_MEDIA_DOMAIN);
  if (WP_ENDPOINT) {
    try {
      out.add(new URL(WP_ENDPOINT).hostname);
    } catch {
      // ignore
    }
  }
  // Common default if env vars aren't set (safe to include only if you use this host).
  out.add("cms.inomadigital.com");
  return out;
}

function pickFormat(accept: string | null): "avif" | "webp" | "jpeg" {
  const a = (accept || "").toLowerCase();
  // Prefer WebP over AVIF for latency: AVIF encoding can be significantly slower and causes a blank-first-slice feel.
  // WebP still compresses well and is widely supported.
  if (a.includes("image/webp")) return "webp";
  if (a.includes("image/avif")) return "avif";
  return "jpeg";
}

function clampInt(v: string | null, min: number, max: number, fallback: number) {
  const n = v ? parseInt(v, 10) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function assertAllowedSrc(src: string) {
  let u: URL;
  try {
    u = new URL(src);
  } catch {
    throw new Error("Invalid src");
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error("Invalid protocol");
  const allowed = allowedHosts();
  if (!allowed.has(u.hostname)) throw new Error("Host not allowed");
  return u;
}

async function getSourceBufferAndMeta(srcUrl: string) {
  evictIfNeeded();
  const now = Date.now();
  const cached = cache.get(srcUrl);
  if (cached && now - cached.ts <= CACHE_TTL_MS) {
    cached.ts = now;
    return cached;
  }

  const upstream = await fetch(srcUrl, { cache: "force-cache" });
  if (!upstream.ok) throw new Error(`Upstream error ${upstream.status}`);
  const buf = Buffer.from(await upstream.arrayBuffer());
  const meta = await sharp(buf, { failOn: "none" }).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (!width || !height) throw new Error("Invalid image");

  const entry: CacheEntry = { buf, meta: { width, height }, bytes: buf.byteLength, ts: now };
  cache.set(srcUrl, entry);
  evictIfNeeded();
  return entry;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const src = url.searchParams.get("src");
    if (!src) return new Response("Missing src", { status: 400 });
    const srcUrl = assertAllowedSrc(src);

    // Allow higher widths for retina (the image is often displayed ~1400px wide, but DPR=2 needs ~2800px)
    const w = clampInt(url.searchParams.get("w"), 320, 3200, 1400);
    const y = clampInt(url.searchParams.get("y"), 0, 200000, 0);
    const h = clampInt(url.searchParams.get("h"), 200, 2200, 1400);
    const q = clampInt(url.searchParams.get("q"), 30, 95, 85);

    const { buf: input, meta } = await getSourceBufferAndMeta(srcUrl.toString());

    const fmt = pickFormat(req.headers.get("accept"));

    const fullW = meta.width;
    const fullH = meta.height;

    // Let the caller know when they've gone past the end so a client component can stop.
    if (y >= fullH) return new Response("Range not satisfiable", { status: 416 });

    const top = Math.min(y, Math.max(0, fullH - 1));
    const height = Math.min(h, Math.max(1, fullH - top));
    const pipeline = sharp(input, { failOn: "none" })
      .extract({ left: 0, top, width: fullW, height })
      .resize({ width: w, withoutEnlargement: true });

    let body: Buffer;
    let contentType = "image/jpeg";

    if (fmt === "avif") {
      body = await pipeline.avif({ quality: Math.min(q, 80), effort: 5 }).toBuffer();
      contentType = "image/avif";
    } else if (fmt === "webp") {
      body = await pipeline.webp({ quality: q }).toBuffer();
      contentType = "image/webp";
    } else {
      body = await pipeline.jpeg({ quality: Math.min(q, 92), mozjpeg: true }).toBuffer();
      contentType = "image/jpeg";
    }

    // Cache aggressively; varies by Accept due to format negotiation.
    // Convert Buffer to Uint8Array for Response compatibility
    return new Response(new Uint8Array(body), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, s-maxage=31536000, max-age=31536000, immutable",
        Vary: "Accept",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(msg, { status: 400 });
  }
}


