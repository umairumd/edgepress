"use client";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import dynamic from "next/dynamic";
import ScrollToTop from "./ScrollToTop";
import { VideoProvider } from "@/modals/VideoContext";

type LayoutWrapperProps = {
  children: ReactNode;
};

const DesktopAnimations = dynamic(() => import("./DesktopAnimations"), { ssr: false });
const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const [enableDesktopFx, setEnableDesktopFx] = useState(false);

  // Reduce non-critical effects on mobile/touch devices for PageSpeed + UX.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: fine) and (min-width: 992px)");
    const update = () => setEnableDesktopFx(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return (
    <VideoProvider>
      {children}
      {enableDesktopFx && <DesktopAnimations />}
      <ScrollToTop />
      {enableDesktopFx && <CustomCursor />}
      <ToastContainer position="top-center" />
    </VideoProvider>
  );
};

export default LayoutWrapper;

