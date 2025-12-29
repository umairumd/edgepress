"use client";

import { Modal } from "react-responsive-modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  videoId: string; // YouTube ID
};

export default function VideoPopup({ isOpen, onClose, videoId }: Props) {
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      center
      classNames={{ modal: "video-modal" }}
    >
      <div style={{ width: "100%", aspectRatio: "16/9" }}>
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
    </Modal>
  );
}


