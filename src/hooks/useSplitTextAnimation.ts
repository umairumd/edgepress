"use client";
import { useEffect } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useSplitTextAnimation = (
   selector = ".td-split-text",
   options: { direction?: "right" | "left" } = {}
) => {
   useEffect(() => {
      if (typeof window === "undefined") return;

      const elements = document.querySelectorAll<HTMLElement>(selector);
      if (!elements.length) return;

      const splits: SplitType[] = [];

      elements.forEach((el) => {
         const split = new SplitType(el, {
            types: "lines,words,chars",
            lineClass: "td-split-line",
         });

         splits.push(split);

         gsap.set(el, { perspective: 400 });

         const initialX = options.direction === "left" ? -50 : 50;

         gsap.set(split.chars, {
            opacity: 0,
            x: initialX,
            ease: "back.out",
         });

         gsap.to(split.chars, {
            scrollTrigger: {
               trigger: el,
               start: "top 90%",
               toggleActions: "play none none reverse",
            },
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.03,
            ease: "power2.out",
         });
      });

      // Defer refresh to avoid forced reflow in the same task as DOM mutations (SplitType inserts spans).
      requestAnimationFrame(() => {
         try {
            ScrollTrigger.refresh();
         } catch {
            // ignore
         }
      });

      return () => {
         splits.forEach((split) => split.revert());
         ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
   }, [selector, options.direction]);
};

export default useSplitTextAnimation;

