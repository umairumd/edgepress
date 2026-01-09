import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

/**
 * Copies user-managed assets from /extras into the actual /public paths used by the site.
 * This lets you replace files in `extras/` without hunting down paths in components.
 */
function firstExisting(relPaths) {
  for (const rel of relPaths) {
    if (fs.existsSync(path.join(ROOT, rel))) return rel;
  }
  return null;
}

const COPY_MAP = [
  {
    // Prefer a user-provided bg in extras; falls back to the repo's existing public asset.
    from: firstExisting(["extras/bg.jpg"]) ?? "public/assets/img/hero/hero-6/bg.jpg",
    to: "public/assets/img/hero/hero-6/bg.jpg",
  },
  {
    // Dark logo (used on non-sticky home): support either exact filenames or legacy ones.
    from:
      firstExisting([
        "extras/inoma-logo-dark.png",
        "extras/inoma-logo.png",
      ]) ?? "public/assets/img/logo/inoma-logo-dark.png",
    to: "public/assets/img/logo/inoma-logo-dark.png",
  },
  {
    // Light logo (used on sticky header + mobile offcanvas): support either exact filenames or legacy ones.
    from:
      firstExisting([
        "extras/inoma-logo-light.png",
        "extras/inoma-logo-for-dark.png",
      ]) ?? "public/assets/img/logo/inoma-logo-light.png",
    to: "public/assets/img/logo/inoma-logo-light.png",
  },
  {
    // OG image for social sharing (1200x630)
    from: firstExisting(["extras/inoma-og.jpg"]) ?? "public/assets/img/logo/inoma-og.jpg",
    to: "public/assets/img/logo/inoma-og.jpg",
  },
];

function copyFile(fromRel, toRel) {
  const fromAbs = path.join(ROOT, fromRel);
  const toAbs = path.join(ROOT, toRel);

  if (!fs.existsSync(fromAbs)) {
    console.warn(`[sync-extras-assets] Missing source: ${fromRel}`);
    return;
  }

  fs.mkdirSync(path.dirname(toAbs), { recursive: true });
  fs.copyFileSync(fromAbs, toAbs);
  console.log(`[sync-extras-assets] Copied ${fromRel} -> ${toRel}`);
}

for (const { from, to } of COPY_MAP) copyFile(from, to);


