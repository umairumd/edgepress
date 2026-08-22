"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo } from "react";
import { useVideoPopup } from "@/hooks/useVideoPopup";

export default function VideoPopup() {
  const { isVideoOpen, activeVideoId, closeVideo } = useVideoPopup();
  const src = useMemo(
    () =>
      activeVideoId
        ? `https://www.youtube.com/embed/${activeVideoId}?autoplay=1&mute=0&rel=0`
        : "",
    [activeVideoId]
  );

  useEffect(() => {
    if (!isVideoOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isVideoOpen]);

  useEffect(() => {
    if (!isVideoOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeVideo();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isVideoOpen, closeVideo]);

  if (!isVideoOpen || !activeVideoId) return null;

  return createPortal(
    <div className="inoma-modal__overlay" role="dialog" aria-modal="true" aria-label="Video">
      <button className="inoma-modal__backdrop" type="button" onClick={closeVideo} aria-label="Close video" />
      <div className="inoma-modal__content">
        <button className="inoma-modal__close" type="button" onClick={closeVideo} aria-label="Close">
          ×
        </button>
        <div className="inoma-modal__frame" style={{ width: "100%", aspectRatio: "16/9" }}>
          <iframe
            title="Video"
            width="100%"
            height="100%"
            src={src}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            style={{ border: 0, display: "block" }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
