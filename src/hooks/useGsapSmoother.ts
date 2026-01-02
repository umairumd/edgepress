"use client";
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Free alternative to ScrollSmoother using CSS smooth scroll and GSAP ScrollTrigger
const useGsapSmoother = () => {
   useEffect(() => {
      if (typeof window === "undefined") return;

      gsap.config({ nullTargetWarn: false });

      const wrapper = document.querySelector("#smooth-wrapper");
      const content = document.querySelector("#smooth-content");

      if (wrapper && content) {
         // Enable CSS smooth scrolling as a free alternative
         document.documentElement.style.scrollBehavior = "smooth";

         // Avoid immediate forced reflow during initial load; refresh on next frame / when idle.
         const refresh = () => {
            try {
               if (ScrollTrigger.getAll().length) ScrollTrigger.refresh();
            } catch {
               // ignore
            }
         };
         requestAnimationFrame(() => {
            // Prefer idle time so it doesn't compete with LCP work.
            const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void })
               .requestIdleCallback;
            if (typeof ric === "function") ric(refresh, { timeout: 1500 });
            else setTimeout(refresh, 0);
         });
      }

      // Handle scroll-to-bottom button if it exists
      const btn = document.querySelector(".scroll-to-bottom");
      const handleClick = () => {
         const target = document.querySelector("#target-section");
         if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
         }
      };
      if (btn) btn.addEventListener("click", handleClick);

      return () => {
         ScrollTrigger.getAll().forEach((t) => t.kill());
         if (btn) btn.removeEventListener("click", handleClick);
         document.documentElement.style.scrollBehavior = "auto";
      };
   }, []);
};

export default useGsapSmoother;

