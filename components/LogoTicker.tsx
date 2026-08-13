"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Infinite logo ticker matching https://kingermayank.framer.website/
 * speed 50px/s · hoverFactor 0.5 · edge fade 12.5% · track opacity 0.5 · gap 60
 */

type TickerLogo = {
  src: string;
  alt: string;
  /** Display height in px — Framer sizes each mark independently. */
  height: number;
};

const LOGOS: TickerLogo[] = [
  { src: "/logos/ticker/ikon.png", alt: "Ikon Technologies", height: 48 },
  { src: "/logos/ticker/pathai.png", alt: "PathAI", height: 40 },
  { src: "/logos/ticker/bigbasket.png", alt: "bigbasket", height: 40 },
  { src: "/logos/ticker/umich.png", alt: "University of Michigan", height: 38 },
  { src: "/logos/ticker/ums.png", alt: "UMS", height: 54 },
  { src: "/logos/ticker/tug.png", alt: "TUG", height: 28 },
];

const SPEED = 50; // px / s
const HOVER_FACTOR = 0.5;
const GAP = 60;
/** Duplicate sets so the strip is always wider than the viewport. */
const COPIES = 3;

export default function LogoTicker() {
  const trackRef = useRef<HTMLUListElement | null>(null);
  const offsetRef = useRef(0);
  const hoveredRef = useRef(false);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const [setWidth, setSetWidth] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const items = [...track.querySelectorAll<HTMLElement>("[data-ticker-item]")];
      const firstSet = items.slice(0, LOGOS.length);
      if (firstSet.length < LOGOS.length) return;
      const width =
        firstSet.reduce((sum, el) => sum + el.getBoundingClientRect().width, 0) +
        GAP * LOGOS.length;
      setSetWidth(width);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (setWidth <= 0) return;

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
      const dt = Math.min(0.064, (now - lastRef.current) / 1000);
      lastRef.current = now;
      const speed = hoveredRef.current ? SPEED * HOVER_FACTOR : SPEED;
      offsetRef.current -= speed * dt;
      while (offsetRef.current <= -setWidth) {
        offsetRef.current += setWidth;
      }
      const track = trackRef.current;
      if (track) {
        track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [setWidth]);

  const items = Array.from({ length: COPIES }, (_, copy) =>
    LOGOS.map((logo) => ({ ...logo, key: `${copy}-${logo.src}` })),
  ).flat();

  return (
    <div
      className="workTicker"
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
    >
      <div className="workTickerViewport">
        <ul ref={trackRef} className="workTickerTrack" aria-hidden="true">
          {items.map((logo) => (
            <li
              key={logo.key}
              className="workTickerItem"
              data-ticker-item=""
              style={{ height: logo.height }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt=""
                height={logo.height}
                draggable={false}
              />
            </li>
          ))}
        </ul>
      </div>
      <span className="workTickerSr">
        Previously at Ikon Technologies, PathAI, bigbasket, University of
        Michigan, UMS, and TUG.
      </span>
    </div>
  );
}
