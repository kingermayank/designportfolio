"use client";

import { useEffect, useRef } from "react";
import { ABOUT_PODCASTS } from "@/lib/about";

const SPEED = 36;
const COPIES = 4;
// Half-strength interpretation of the reference: 100% at center, 80% at edges.
const EDGE_SCALE = 0.8;

export default function AboutPodcastTicker() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLUListElement | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const items = [...track.querySelectorAll<HTMLElement>("[data-ticker-item]")];
    const covers = items.map((item) => item.querySelector<HTMLElement>(".aboutPodFocus")!);
    let centers: number[] = [];
    let viewportWidth = 0;
    let setWidth = 0;
    let offset = 0;
    let frame = 0;
    let last = 0;
    let inView = false;

    const paint = () => {
      track.style.transform = `translate3d(${offset}px, 0, 0)`;
      const halfWidth = viewportWidth / 2;
      covers.forEach((cover, index) => {
        const distance = halfWidth > 0
          ? Math.min(1, Math.abs(centers[index] + offset - halfWidth) / halfWidth)
          : 1;
        // Cosine gives a gentle peak and flat ends, with no size jump on wrap.
        const focus = (1 + Math.cos(distance * Math.PI)) / 2;
        const scale = motion.matches ? 1 : EDGE_SCALE + (1 - EDGE_SCALE) * focus;
        const transform = `scale(${Number(scale.toFixed(4))})`;
        if (cover.style.transform !== transform) cover.style.transform = transform;
      });
    };

    const measure = () => {
      // Read geometry only on resize; animation frames perform transform writes.
      viewportWidth = viewport.clientWidth;
      centers = items.map((item) => item.offsetLeft + item.offsetWidth / 2);
      setWidth = items[ABOUT_PODCASTS.length].offsetLeft - items[0].offsetLeft;
      if (setWidth > 0) offset %= setWidth;
      paint();
    };

    const tick = (now: number) => {
      const dt = Math.min(0.064, (now - last) / 1000);
      last = now;
      if (setWidth > 0 && !pausedRef.current) {
        offset = (offset - SPEED * dt) % setWidth;
        paint();
      }
      frame = requestAnimationFrame(tick);
    };

    const syncPlayback = () => {
      cancelAnimationFrame(frame);
      if (motion.matches) {
        offset = 0;
        paint();
      }
      if (motion.matches || !inView || document.hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(viewport);
    resize.observe(track);
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    });
    visibility.observe(viewport);
    motion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
      motion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, []);

  const items = Array.from({ length: COPIES }, (_, copy) =>
    ABOUT_PODCASTS.map((pod) => ({ ...pod, key: `${copy}-${pod.id}` })),
  ).flat();

  return (
    <div className="aboutPodTicker">
      <div ref={viewportRef} className="aboutPodViewport">
        <ul ref={trackRef} className="aboutPodTrack" aria-hidden="true">
          {items.map((pod) => (
            <li
              key={pod.key}
              className="aboutPodItem"
              data-ticker-item=""
              onMouseEnter={() => {
                pausedRef.current = true;
              }}
              onMouseLeave={() => {
                pausedRef.current = false;
              }}
            >
              <span className="aboutPodFocus">
                <span className="aboutPodArt">
                  {pod.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pod.src}
                      alt=""
                      width={pod.size}
                      height={pod.size}
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      draggable={false}
                    />
                  ) : (
                    <span className="aboutPodFill" />
                  )}
                </span>
              </span>
              <span className="aboutPodName">{pod.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <span className="srOnly">Podcasts I&apos;m listening to.</span>
    </div>
  );
}
