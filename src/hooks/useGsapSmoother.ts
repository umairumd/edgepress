"use client";
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Free alternative to ScrollSmoother using CSS smooth scroll and GSAP ScrollTrigger
const useGsapSmoother = () => {
   useEffect(() => {
      if (typeof window === "undefined") return;

      // Defer GSAP init until after first paint to avoid blocking LCP
      const initTimeout = setTimeout(() => {
         gsap.config({ nullTargetWarn: false });

         const wrapper = document.querySelector("#smooth-wrapper");
         const content = document.querySelector("#smooth-content");

         if (wrapper && content) {
            // Enable CSS smooth scrolling as a free alternative
            document.documentElement.style.scrollBehavior = "smooth";

            // Refresh on idle to avoid forced reflows
            const refresh = () => {
               try {
                  if (ScrollTrigger.getAll().length) ScrollTrigger.refresh();
               } catch {
                  // ignore
               }
            };
            const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void })
               .requestIdleCallback;
            if (typeof ric === "function") ric(refresh, { timeout: 2000 });
            else setTimeout(refresh, 100);
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
      }, 100); // 100ms delay after first paint

      return () => {
         clearTimeout(initTimeout);
         ScrollTrigger.getAll().forEach((t) => t.kill());
         const btn = document.querySelector(".scroll-to-bottom");
         if (btn) btn.removeEventListener("click", () => {});
         document.documentElement.style.scrollBehavior = "auto";
      };
   }, []);
};

export default useGsapSmoother;

