"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  src: string;
  alt?: string;
  /** Original image width in px (from WP attributes if available) */
  width?: number;
  /** Original image height in px (from WP attributes if available) */
  height?: number;
  /** Slice height in px in source space (default 1400) */
  sliceHeight?: number;
  /** Max rendered width for desktop slices */
  maxWidth?: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function PortfolioLongImage({
  src,
  alt = "",
  width,
  height,
  sliceHeight = 1400,
  maxWidth = 1400,
}: Props) {
  const effectiveSliceH = clamp(sliceHeight, 600, 2200);
  // WP often provides *display* width/height (e.g. 768x1024) even when the original is huge.
  // If the provided height is small, treat the total height as unknown and keep loading until API returns 416.
  const trustHeight = Boolean(height && height >= 2200);
  const knownSlices = trustHeight && height ? Math.ceil(height / effectiveSliceH) : null;
  // Progressive loading: start with 3 slices, then load more as needed
  const initialTarget = Math.min(knownSlices ?? 3, 3);
  // Always load the first slice first; once it completes, we render more slices.
  const [count, setCount] = useState<number>(1);
  const [done, setDone] = useState<boolean>(false); // used only for unknown-height stop
  const [firstLoaded, setFirstLoaded] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const firstImageRef = useRef<HTMLImageElement | null>(null);

  const sliceUrl = (y: number, h: number, w: number, q = 88) =>
    `/api/img/slice?src=${encodeURIComponent(src)}&y=${y}&h=${h}&w=${w}&q=${q}`;

  // Don't clamp to WP-provided width (often small). Let srcset/sizes pick the right res.
  const effectiveMaxWidth = maxWidth;
  const sizes = useMemo(
    () => `(max-width: 575px) 100vw, (max-width: 991px) 92vw, ${effectiveMaxWidth}px`,
    [effectiveMaxWidth]
  );

  const srcSetFor = (y: number, h: number) =>
    [
      `${sliceUrl(y, h, 768)} 768w`,
      `${sliceUrl(y, h, 1200)} 1200w`,
      `${sliceUrl(y, h, 1600)} 1600w`,
      `${sliceUrl(y, h, 2400)} 2400w`,
      `${sliceUrl(y, h, 3200)} 3200w`,
    ].join(", ");

  // Progressive loading: load more slices gradually as previous ones complete
  useEffect(() => {
    if (!firstLoaded) return;
    const reachedKnownEnd = Boolean(knownSlices && count >= knownSlices);
    if (done || reachedKnownEnd) return;
    
    // Progressive loading: load 2 more slices at a time, not all at once
    const timer = setTimeout(() => {
      if (!done && count < (knownSlices ?? 60)) {
        const nextCount = Math.min(count + 2, knownSlices ?? 60);
        setCount(nextCount);
      }
    }, 300); // Small delay between progressive loads to avoid overwhelming the network
    
    return () => clearTimeout(timer);
  }, [firstLoaded, done, knownSlices, count]);

  // Also use IntersectionObserver as fallback for very long images
  useEffect(() => {
    if (!firstLoaded) return;
    const reachedKnownEnd = Boolean(knownSlices && count >= knownSlices);
    if (done || reachedKnownEnd) return;
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e?.isIntersecting) return;
        setCount((c) => {
          const next = c + 3; // Load 3 more slices when sentinel is visible
          const cap = knownSlices ?? 60;
          return Math.min(next, cap);
        });
      },
      { rootMargin: "1200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [done, knownSlices, count, firstLoaded]);

  // Check if first image is already loaded (cached) - fixes loader persistence issue
  useEffect(() => {
    if (firstLoaded) return;
    const img = firstImageRef.current;
    if (!img) return;
    
    // If image is already complete (cached), set firstLoaded immediately
    if (img.complete && img.naturalWidth > 0) {
      setFirstLoaded(true);
      setCount((c) => Math.max(c, initialTarget));
      return;
    }
    
    // Fallback timeout: hide loader after 5 seconds even if image hasn't loaded
    const timeout = setTimeout(() => {
      if (!firstLoaded) {
        setFirstLoaded(true);
        setCount((c) => Math.max(c, initialTarget));
      }
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [firstLoaded, initialTarget]);

  const visibleCount = firstLoaded ? count : 1;

  return (
    <div className="td-portfolio-long-image" data-slices={knownSlices ?? count}>
      {!firstLoaded ? (
        <div className="td-portfolio-long-image__loader" aria-label="Loading case study">
          <div className="td-portfolio-long-image__loader-spinner"></div>
        </div>
      ) : null}
      {Array.from({ length: visibleCount }).map((_, i) => {
        const y = i * effectiveSliceH;
        const h = height ? Math.min(effectiveSliceH, height - y) : effectiveSliceH;
        const eager = i === 0 || i < 5; // Load first 5 slices eagerly
        const reachedKnownEnd = Boolean(knownSlices && count >= knownSlices);
        return (
          <img
            key={i}
            ref={i === 0 ? firstImageRef : null}
            className="td-portfolio-long-image__slice"
            // Faster first paint: smaller + slightly lower quality for slice 1; retina quality still comes from srcset.
            src={sliceUrl(y, h, eager ? 1000 : 1400, eager ? 78 : 88)}
            srcSet={srcSetFor(y, h)}
            sizes={sizes}
            alt={alt}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "auto"}
            decoding="async"
            onError={() => {
              // Stop and drop the failed slice (usually a 416 when we've gone past the bottom).
              setDone(true);
              setCount((c) => Math.max(1, Math.min(c - 1, i)));
              if (i === 0) setFirstLoaded(true); // don't leave the loader up forever
            }}
            onLoad={() => {
              if (i === 0) {
                setFirstLoaded(true);
                // Progressive loading: start with initialTarget (3 slices)
                setCount((c) => Math.max(c, initialTarget));
              }
              // Continue loading more slices progressively if we haven't reached the end
              if (!done && !reachedKnownEnd && i === count - 1) {
                const cap = knownSlices ?? 60;
                if (count < cap) {
                  // Load 1 more slice after each slice completes (progressive)
                  setCount((c) => Math.min(c + 1, cap));
                }
              }
            }}
          />
        );
      })}
      {firstLoaded && !done && !(knownSlices && count >= knownSlices) ? (
        <div ref={sentinelRef} style={{ height: 1 }} aria-hidden="true" />
      ) : null}
    </div>
  );
}


