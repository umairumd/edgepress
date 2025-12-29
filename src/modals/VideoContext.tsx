"use client";

import { createContext, useState } from "react";

export interface VideoContextType {
  isVideoOpen: boolean;
  openVideo: () => void;
  closeVideo: () => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const openVideo = () => setIsVideoOpen(true);
  const closeVideo = () => setIsVideoOpen(false);

  return (
    <VideoContext.Provider value={{ isVideoOpen, openVideo, closeVideo }}>
      {children}
    </VideoContext.Provider>
  );
};

export default VideoContext;


