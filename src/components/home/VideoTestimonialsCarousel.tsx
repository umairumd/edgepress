"use client";
import { useState, useEffect } from "react";
import { useVideoPopup } from "@/hooks/useVideoPopup";
import type { TestimonialItem } from "@/lib/wp";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function VideoTestimonialsCarousel({
  testimonials,
}: {
  testimonials: TestimonialItem[];
}) {
  const { openVideo } = useVideoPopup();
  const [slides, setSlides] = useState(testimonials);

  useEffect(() => {
    // Shuffle after hydration to avoid mismatch
    const shuffled = shuffleArray(testimonials);
    // Duplicate for seamless loop
    setSlides([...shuffled, ...shuffled]);
  }, [testimonials]);

  if (!testimonials.length) return null;

  return (
    <section className="td-video-testimonials pt-80 pb-60">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xxl-8 col-xl-9 col-lg-10">
            <div className="text-center mb-65">
              <span className="td-section-6-subtitle d-inline-block mb-15">
                WHAT OUR CLIENTS SAY
              </span>
              <h2 className="td-section-6-bigtitle td-text-opacity">
                SUCCESS STORIES
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="td-video-testimonials__track">
        <div className="td-video-testimonials__reel">
          {slides.map((item, idx) => {
            const thumbSrc =
              item.thumbnailUrl ||
              `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`;

            return (
              <div
                key={`${item.id}-${idx}`}
                className="td-video-testimonials__slide"
              >
                <button
                  type="button"
                  className="td-video-testimonials__card"
                  onClick={() => openVideo(item.youtubeId)}
                  aria-label={`Play testimonial from ${item.title}`}
                >
                  <div className="td-video-testimonials__thumb">
                    <img
                      src={thumbSrc}
                      alt={item.title}
                      loading="lazy"
                    />
                    <span
                      className="td-video-testimonials__play"
                      aria-hidden="true"
                    >
                      <svg width="24" height="28" viewBox="0 0 20 24" fill="none">
                        <path
                          d="M20 12L0.5 23.2583V0.74167L20 12Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="td-video-testimonials__meta">
                    <span className="td-video-testimonials__client">
                      {item.title}
                    </span>
                    {item.companyName && (
                      <span className="td-video-testimonials__company">
                        {item.companyName}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
