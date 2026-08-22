"use client";

import { createContext, useEffect, useRef, useState } from "react";

export interface VideoContextType {
  isVideoOpen: boolean;
  activeVideoId: string | null;
  openVideo: (youtubeId: string) => void;
  closeVideo: () => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const clearIdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openVideo = (youtubeId: string) => {
    if (clearIdTimerRef.current) {
      clearTimeout(clearIdTimerRef.current);
      clearIdTimerRef.current = null;
    }
    setActiveVideoId(youtubeId);
    setIsVideoOpen(true);
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
    if (clearIdTimerRef.current) clearTimeout(clearIdTimerRef.current);
    clearIdTimerRef.current = setTimeout(() => {
      setActiveVideoId(null);
      clearIdTimerRef.current = null;
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (clearIdTimerRef.current) clearTimeout(clearIdTimerRef.current);
    };
  }, []);

  return (
    <VideoContext.Provider value={{ isVideoOpen, activeVideoId, openVideo, closeVideo }}>
      {children}
    </VideoContext.Provider>
  );
};

export default VideoContext;
