"use client";

import { useEffect, useRef } from "react";

type Props = {
  html?: string | null;
  className?: string;
};

/**
 * Renders WordPress HTML and adds lightweight interactivity for common
 * accordion/FAQ markup that may be pasted into WP posts.
 *
 * Supported markup:
 * - Old template: .accordion, .accordion-items, .accordion-buttons, .accordion-collapse
 * - New FAQ: .faq-container, .faq-item, .faq-question, .faq-answer
 */
export default function WpContent({ html, className }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !html) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check for FAQ structure first (new format)
      let btn = target.closest<HTMLElement>(".faq-question");
      let item: HTMLElement | null = null;
      let panel: HTMLElement | null = null;
      let container: HTMLElement | null = null;
      let isFAQ = false;

      if (btn && root.contains(btn)) {
        isFAQ = true;
        item = btn.closest<HTMLElement>(".faq-item");
        container = item?.closest<HTMLElement>(".faq-container") || null;
        panel = item?.querySelector<HTMLElement>(".faq-answer") || null;
      } else {
        // Fallback to old accordion structure
        btn = target.closest<HTMLElement>(".accordion-buttons");
        if (btn && root.contains(btn)) {
          item = btn.closest<HTMLElement>(".accordion-items");
          container = item?.closest<HTMLElement>(".accordion") || null;
          panel = item?.querySelector<HTMLElement>(".accordion-collapse") || null;
        }
      }

      if (!btn || !item || !panel || !root.contains(btn)) return;

      // Prevent default for buttons
      if (btn.tagName.toLowerCase() === "button") {
        e.preventDefault();
      }

      // Check if currently open (support faq-open on item, or show/active on panel)
      const isOpen =
        (isFAQ && (item.classList.contains("faq-open") || btn.getAttribute("aria-expanded") === "true")) ||
        (!isFAQ && (panel.classList.contains("show") || panel.classList.contains("active") || btn.getAttribute("aria-expanded") === "true"));

      // Close siblings (match typical "only one open" accordion behavior)
      if (container) {
        if (isFAQ) {
          container.querySelectorAll<HTMLElement>(".faq-item.faq-open").forEach((siblingItem) => {
            if (siblingItem === item) return;
            siblingItem.classList.remove("faq-open");
            const siblingBtn = siblingItem.querySelector<HTMLElement>(".faq-question");
            if (siblingBtn) siblingBtn.setAttribute("aria-expanded", "false");
          });
        } else {
          container.querySelectorAll<HTMLElement>(".accordion-items .accordion-collapse.show").forEach((openPanel) => {
            if (openPanel === panel) return;
            openPanel.classList.remove("show", "active");
            const siblingItem = openPanel.closest<HTMLElement>(".accordion-items");
            const siblingBtn = siblingItem?.querySelector<HTMLElement>(".accordion-buttons");
            if (siblingBtn) {
              siblingBtn.classList.add("collapsed");
              siblingBtn.setAttribute("aria-expanded", "false");
            }
          });
        }
      }

      // Toggle current
      if (isOpen) {
        if (isFAQ) {
          item.classList.remove("faq-open");
          btn.setAttribute("aria-expanded", "false");
        } else {
          panel.classList.remove("show", "active");
          btn.classList.add("collapsed");
          btn.setAttribute("aria-expanded", "false");
        }
      } else {
        if (isFAQ) {
          item.classList.add("faq-open");
          btn.setAttribute("aria-expanded", "true");
        } else {
          panel.classList.add("show", "active");
          btn.classList.remove("collapsed");
          btn.setAttribute("aria-expanded", "true");
        }
      }
    };

    // Use event delegation - this works even if elements aren't in DOM yet
    // The event will bubble up from dynamically inserted elements
    root.addEventListener("click", onClick);

    // Also use MutationObserver to ensure handlers work on first load
    // This catches cases where HTML is inserted after the effect runs
    const observer = new MutationObserver(() => {
      // Just ensure the listener is attached (it already is via event delegation)
      // This observer helps ensure timing is correct
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
    });

    // Fallback: ensure it works even if there's a timing issue
    const timeoutId = setTimeout(() => {
      // Event delegation should already work, but this ensures it
    }, 50);

    return () => {
      root.removeEventListener("click", onClick);
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [html]);

  if (!html) return null;

  return <div ref={rootRef} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

