"use client";

import useGsapSmoother from "@/hooks/useGsapSmoother";
import useImageRevealAnimation from "@/hooks/useImageRevealAnimation";
import useSplitTextTitleAnim from "@/hooks/useSplitTextTitleAnim";
import useSplitTextBgAnim from "@/hooks/useSplitTextBgAnim";

/**
 * Desktop-only animation initializer (dynamically imported).
 * Keeps large GSAP/SplitType code out of the initial mobile bundle.
 */
export default function DesktopAnimations() {
  useGsapSmoother();
  useImageRevealAnimation();
  useSplitTextTitleAnim();
  useSplitTextBgAnim();
  return null;
}


