"use client";
import { useState, useEffect, useCallback } from "react";
import UseSticky from "@/hooks/UseSticky";

const ScrollToTop = () => {

   const { sticky }: { sticky: boolean } = UseSticky();
   const [showScroll, setShowScroll] = useState(false);

   const checkScrollTop = useCallback(() => {
      if (window.pageYOffset > 400 && !showScroll) {
         setShowScroll(true);
      } else if (window.pageYOffset <= 400 && showScroll) {
         setShowScroll(false);
      }
   }, [showScroll]);

   const scrollTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   };

   useEffect(() => {
      window.addEventListener("scroll", checkScrollTop);
      return () => window.removeEventListener("scroll", checkScrollTop);
   }, [checkScrollTop]);

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

