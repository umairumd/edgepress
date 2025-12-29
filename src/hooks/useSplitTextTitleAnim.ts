"use client";
import { useLayoutEffect } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useSplitTextTitleAnim = () => {
   useLayoutEffect(() => {
      const ctx = gsap.context(() => {
         const elements = document.querySelectorAll(".td-title-anim");
         if (!elements.length) return;

         const splits: SplitType[] = [];

         elements.forEach((el) => {
            const tl = gsap.timeline({
               scrollTrigger: {
                  trigger: el,
                  start: "top 90%",
                  end: "bottom 60%",
                  scrub: false,
                  markers: false,
                  toggleActions: "play none none none",
               },
            });

            const split = new SplitType(el as HTMLElement, {
               types: "words,lines",
            });
            splits.push(split);
            gsap.set(el, { perspective: 300 });

            tl.from(split.lines, {
               duration: 1,
               delay: 0.3,
               opacity: 0,
               rotationX: -50,
               force3D: true,
               transformOrigin: "top center -50",
               stagger: 0.2,
            });
         });

         return () => {
            splits.forEach((split) => split.revert());
         };
      });

      return () => ctx.revert();
   }, []);
};

export default useSplitTextTitleAnim;

