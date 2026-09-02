"use client";

import { useEffect, useRef } from "react";

const FADE_DURATION = 650;
const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

type VideoSource = {
  src: string;
  type: string;
  media?: string;
};

type HeroVideoProps = {
  className?: string;
  poster?: string;
  sources?: VideoSource[];
  soundOnInteraction?: boolean;
};

const experienceSources: VideoSource[] = [
  { src: "/media/menorca-experiencia-hero-mobile.mp4", media: "(max-width: 767px)", type: "video/mp4" },
  { src: "/media/menorca-experiencia-hero-desktop.mp4", type: "video/mp4" },
];

export function HeroVideo({
  className = "hero__video",
  poster = "/media/viatge-estudiants-menorca-hero-poster.webp",
  sources = experienceSources,
  soundOnInteraction = true,
}: HeroVideoProps = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const soundWasEnabled = useRef(false);
  const inViewport = useRef(true);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !soundOnInteraction) return;

    const cancelFade = () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
    };

    const fadeTo = (target: number) => {
      cancelFade();
      const from = clampVolume(video.volume);
      const safeTarget = clampVolume(target);
      const startedAt = performance.now();

      const tick = (now: number) => {
        const progress = Math.min(1, Math.max(0, (now - startedAt) / FADE_DURATION));
        video.volume = clampVolume(from + (safeTarget - from) * progress);
        if (progress < 1) frame.current = requestAnimationFrame(tick);
      };

      frame.current = requestAnimationFrame(tick);
    };

    const enableSound = async () => {
      if (soundWasEnabled.current) return;

      try {
        video.volume = 0;
        video.muted = false;
        await video.play();
        soundWasEnabled.current = true;
        if (inViewport.current) fadeTo(1);
      } catch {
        video.muted = true;
      }
    };

    const onFirstInteraction = () => void enableSound();
    const events: Array<keyof DocumentEventMap> = ["pointerdown", "click", "touchstart"];
    events.forEach((event) =>
      document.addEventListener(event, onFirstInteraction, { once: true, passive: true }),
    );

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewport.current = entry.isIntersecting;
        if (!soundWasEnabled.current) return;
        fadeTo(entry.isIntersecting ? 1 : 0);
      },
      { threshold: 0.18 },
    );
    observer.observe(video);

    return () => {
      cancelFade();
      observer.disconnect();
      events.forEach((event) => document.removeEventListener(event, onFirstInteraction));
    };
  }, [soundOnInteraction]);

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-hidden="true"
    >
      {sources.map((source) => (
        <source key={source.src} src={source.src} media={source.media} type={source.type} />
      ))}
    </video>
  );
}
