"use client";

import { useEffect, useRef } from "react";
import { ABOUT_PODCASTS } from "@/lib/about";

const SPEED = 36;
const GAP = 16;
const COPIES = 4;

export default function AboutPodcastTicker() {
  const trackRef = useRef<HTMLUListElement | null>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const setWidthRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const items = [
        ...track.querySelectorAll<HTMLElement>("[data-ticker-item]"),
      ];
      const firstSet = items.slice(0, ABOUT_PODCASTS.length);
      if (firstSet.length < ABOUT_PODCASTS.length) return;
      const width =
        firstSet.reduce((sum, el) => sum + el.offsetWidth, 0) +
        GAP * ABOUT_PODCASTS.length;
      if (Math.abs(width - setWidthRef.current) < 0.5) return;
      setWidthRef.current = width;
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      offsetRef.current = 0;
      if (trackRef.current) {
        trackRef.current.style.transform = "translate3d(0, 0, 0)";
      }
      return;
    }

    lastRef.current = performance.now();
    const tick = (now: number) => {
      const setWidth = setWidthRef.current;
      const dt = Math.min(0.064, (now - lastRef.current) / 1000);
      lastRef.current = now;
      if (setWidth > 0 && !pausedRef.current) {
        offsetRef.current -= SPEED * dt;
        while (offsetRef.current <= -setWidth) {
          offsetRef.current += setWidth;
        }
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const items = Array.from({ length: COPIES }, (_, copy) =>
    ABOUT_PODCASTS.map((pod) => ({ ...pod, key: `${copy}-${pod.id}` })),
  ).flat();

  return (
    <div className="aboutPodTicker">
      <div className="aboutPodViewport">
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
              <span className="aboutPodArt">
                {pod.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pod.src} alt="" draggable={false} />
                ) : (
                  <span className="aboutPodFill" />
                )}
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
