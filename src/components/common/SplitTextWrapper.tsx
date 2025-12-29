"use client";
import type { ReactNode } from "react";
import useSplitTextAnimation from "@/hooks/useSplitTextAnimation";

interface Props {
   children: ReactNode;
   className?: string;
   direction?: "right" | "left";
}

const SplitTextWrapper = ({ children, className = "", direction = "right" }: Props) => {
   useSplitTextAnimation(`.td-split-text.${direction}`, { direction });

   return (
      <span className={`td-split-text ${direction} ${className}`}>
         {children}
      </span>
   );
};

export default SplitTextWrapper;

