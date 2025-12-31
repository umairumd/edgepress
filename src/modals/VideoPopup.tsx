"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  videoId: string; // YouTube ID
};

export default function VideoPopup({ isOpen, onClose, videoId }: Props) {
  const src = useMemo(() => `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`, [videoId]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="inoma-modal__overlay" role="dialog" aria-modal="true" aria-label="Video">
      <button className="inoma-modal__backdrop" type="button" onClick={onClose} aria-label="Close video" />
      <div className="inoma-modal__content">
        <button className="inoma-modal__close" type="button" onClick={onClose} aria-label="Close">
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
