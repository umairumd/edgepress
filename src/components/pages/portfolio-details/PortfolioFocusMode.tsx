"use client";

import { useEffect, useRef } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Desktop-only: fades the page background to a dark "focus mode" as you scroll down the portfolio detail.
 * Implemented as a CSS variable on :root + a body class.
 */
export default function PortfolioFocusMode() {
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(min-width: 992px)");
    if (!mq.matches) return;

    const root = document.documentElement;
    const body = document.body;
    const anchor = document.getElementById("td-portfolio-focus-anchor");
    if (!anchor) return;

    body.classList.add("td-portfolio-focus");

    // Earlier + faster fade (stronger)
    const start = anchor.getBoundingClientRect().top + window.scrollY + 40;
    const range = 520;

    const update = () => {
      raf.current = null;
      const y = window.scrollY;
      const t = clamp((y - start) / range, 0, 1);
      // Darker overall.
      root.style.setProperty("--td-portfolio-focus-alpha", String(t * 0.98));
    };

    const onScroll = () => {
      if (raf.current != null) return;
      raf.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
      raf.current = null;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      body.classList.remove("td-portfolio-focus");
      root.style.removeProperty("--td-portfolio-focus-alpha");
    };
  }, []);

  return null;
}


