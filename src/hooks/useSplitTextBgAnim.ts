"use client";
import { useLayoutEffect } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useSplitTextBgAnim = () => {
   useLayoutEffect(() => {
      const ctx = gsap.context(() => {
         const elements = document.querySelectorAll(".td-text-invert, .td-text-opacity");
         if (!elements.length) return;

         const splits: SplitType[] = [];

         elements.forEach((el) => {
            const split = new SplitType(el as HTMLElement, {
               types: "lines",
            });
            splits.push(split);

            // `split.lines` can be null depending on SplitType results / DOM state.
            (split.lines ?? []).forEach((line) => {
               gsap.to(line, {
                  backgroundPositionX: 0,
                  ease: "none",
                  scrollTrigger: {
                     trigger: line,
                     scrub: 1,
                     start: "top 85%",
                     end: "bottom center",
                  },
               });
            });
         });

         return () => {
            splits.forEach((split) => split.revert());
         };
      });

      return () => ctx.revert();
   }, []);
};

export default useSplitTextBgAnim;

