"use client";
import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useImageRevealAnimation = (selector = ".td_image_animetion") => {

   useLayoutEffect(() => {
      const ctx = gsap.context(() => {
         const tdImageAnimations = document.querySelectorAll<HTMLElement>(selector);

         tdImageAnimations.forEach((imgReveal) => {
            const image = imgReveal.querySelector("img");
            if (!image) return;

            const tl = gsap.timeline({
               scrollTrigger: {
                  trigger: imgReveal,
                  start: "top 70%",
                  toggleActions: "play none none reverse",
               },
            });

            tl.set(imgReveal, { autoAlpha: 1 });
            tl.from(imgReveal, {
               duration: 1.5,
               xPercent: -100,
               ease: "power2.out",
            });
            tl.from(image, {
               duration: 1.5,
               xPercent: 100,
               scale: 1.5,
               delay: -1.5,
               ease: "power2.out",
            });
         });
      });

      return () => ctx.revert();
   }, [selector]);
};

export default useImageRevealAnimation;

