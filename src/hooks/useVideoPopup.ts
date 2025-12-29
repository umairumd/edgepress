"use client";

import { useContext } from "react";
import VideoContext from "@/modals/VideoContext";
import type { VideoContextType } from "@/modals/VideoContext";

export const useVideoPopup = (): VideoContextType => {
  const ctx = useContext(VideoContext);
  if (!ctx) throw new Error("useVideoPopup must be used within a VideoProvider");
  return ctx;
};


