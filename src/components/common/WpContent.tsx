"use client";

import { useEffect, useRef } from "react";

type Props = {
  html?: string | null;
  className?: string;
};

/**
 * Renders WordPress HTML and adds lightweight interactivity for common
 * "template accordion" markup that may be pasted into WP posts.
 *
 * Supported markup (based on template FAQ):
 * - .accordion (container)
 * - .accordion-items (item)
 * - .accordion-buttons (toggle button; uses .collapsed when closed)
 * - .accordion-collapse.collapse (panel; uses .show when open)
 */
export default function WpContent({ html, className }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const btn = target.closest<HTMLElement>(".accordion-buttons");
      if (!btn || !root.contains(btn)) return;

      // If this is a <button>, prevent accidental form submissions inside WP content.
      if (btn.tagName.toLowerCase() === "button") {
        e.preventDefault();
      }

      const item = btn.closest<HTMLElement>(".accordion-items");
      if (!item) return;

      const accordion = item.closest<HTMLElement>(".accordion");
      const panel = item.querySelector<HTMLElement>(".accordion-collapse");
      if (!panel) return;

      const isOpen = panel.classList.contains("show");

      // Close siblings (match typical "only one open" accordion behavior)
      if (accordion) {
        accordion.querySelectorAll<HTMLElement>(".accordion-items .accordion-collapse.show").forEach((openPanel) => {
          if (openPanel === panel) return;
          openPanel.classList.remove("show");
          const siblingItem = openPanel.closest<HTMLElement>(".accordion-items");
          const siblingBtn = siblingItem?.querySelector<HTMLElement>(".accordion-buttons");
          siblingBtn?.classList.add("collapsed");
          siblingBtn?.setAttribute("aria-expanded", "false");
        });
      }

      // Toggle current
      panel.classList.toggle("show", !isOpen);
      btn.classList.toggle("collapsed", isOpen);
      btn.setAttribute("aria-expanded", (!isOpen).toString());
    };

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, []);

  if (!html) return null;

  return <div ref={rootRef} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

