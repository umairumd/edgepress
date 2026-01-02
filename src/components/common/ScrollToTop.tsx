"use client";
import { useState, useEffect, useRef } from "react";
import UseSticky from "@/hooks/UseSticky";

const ScrollToTop = () => {

   const { sticky }: { sticky: boolean } = UseSticky();
   const [showScroll, setShowScroll] = useState(false);
   const rafRef = useRef<number | null>(null);

   const scrollTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   };

   useEffect(() => {
      const onScroll = () => {
         if (rafRef.current != null) return;
         rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null;
            const y = window.pageYOffset;
            setShowScroll((prev) => {
               const next = y > 400;
               return prev === next ? prev : next;
            });
         });
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => {
         window.removeEventListener("scroll", onScroll as EventListener);
         if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
         rafRef.current = null;
      };
   }, []);

   return (
      <button
         onClick={scrollTop}
         className={`scroll__top scroll-to-target ${sticky && showScroll ? "open" : ""}`}
         data-target="html"
         aria-label="Scroll to top"
      >
         <i className="fa-sharp fa-regular fa-arrow-up" aria-hidden="true"></i>
      </button>
   );
};

export default ScrollToTop;

