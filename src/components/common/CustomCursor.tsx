"use client";
import { useEffect } from "react";

const CustomCursor = () => {
   useEffect(() => {
      const follower = document.querySelector(
         ".mouse-follower .cursor-outline"
      ) as HTMLElement;
      const dot = document.querySelector(
         ".mouse-follower .cursor-dot"
      ) as HTMLElement;

      // Initialize cursor at center of viewport (hidden until first mouse move)
      if (follower && dot) {
         const centerX = window.innerWidth / 2;
         const centerY = window.innerHeight / 2;
         follower.style.left = `${centerX}px`;
         follower.style.top = `${centerY}px`;
         follower.style.opacity = "0";
         dot.style.left = `${centerX}px`;
         dot.style.top = `${centerY}px`;
         dot.style.opacity = "0";
      }

      let hasMovedMouse = false;
      const moveHandler = (e: MouseEvent) => {
         const { clientX, clientY } = e;

         if (follower && dot) {
            // Show cursor on first mouse move
            if (!hasMovedMouse) {
               hasMovedMouse = true;
               follower.style.opacity = "1";
               dot.style.opacity = "1";
            }
            follower.style.left = `${clientX}px`;
            follower.style.top = `${clientY}px`;

            dot.style.left = `${clientX}px`;
            dot.style.top = `${clientY}px`;
         }
      };

      window.addEventListener("mousemove", moveHandler);

      // Add hover effects without jQuery
      const addHoverClass = (
         selector: string,
         className: string,
         cursorSelector = ".mouse-follower"
      ) => {
         const elements = document.querySelectorAll(selector);
         elements.forEach((el) => {
            el.addEventListener("mouseenter", () => {
               document.querySelector(cursorSelector)?.classList.add(className);
               el.classList.add(className);
            });
            el.addEventListener("mouseleave", () => {
               document.querySelector(cursorSelector)?.classList.remove(className);
               el.classList.remove(className);
            });
         });
      };

      addHoverClass("a, button", "hide-cursor");
      addHoverClass(
         "h1, h2, h3, h4, .display-one, .display-two, .display-three, .display-four, .display-five, .display-six",
         "highlight-cursor-head"
      );
      addHoverClass("p", "highlight-cursor-para");

      return () => {
         window.removeEventListener("mousemove", moveHandler);
      };
   }, []);

   return (
      <div className="mouse-follower">
         <span className="cursor-outline" />
         <span className="cursor-dot" />
      </div>
   );
};

export default CustomCursor;

