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
         
         // Use GSAP ScrollTrigger for scroll-based animations
         ScrollTrigger.refresh();
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

