"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { Testimonial } from "@/lib/about";

/** How long each testimonial holds before the carousel advances. */
const AUTOPLAY_MS = 7000;

/**
 * One testimonial at a time, on a timer.
 *
 * The rule above the quote doubles as the progress track: a white fill sweeps
 * left to right over AUTOPLAY_MS, then the next testimonial takes over and the
 * fill resets. Arrow clicks jump to the previous or next quote and restart the
 * same left-to-right timer — autoplay always advances forward.
 *
 * Every item stays mounted in one grid cell — only the active one is visible —
 * so the card is always as tall as the longest quote and switching never
 * resizes the page.
 */
export default function AboutTestimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const total = testimonials.length;

  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const elapsedRef = useRef(0);

  const paintFill = (value: number) => {
    if (fillRef.current) {
      fillRef.current.style.transform = `scaleX(${value})`;
    }
  };

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  // Manual navigation restarts the timer from zero.
  const goTo = useCallback((next: number) => {
    elapsedRef.current = 0;
    paintFill(0);
    setIndex(next);
  }, []);

  const step = (dir: number) => goTo((index + dir + total) % total);

  useEffect(() => {
    if (reduced || total < 2) return;
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = now - last;
      last = now;
      elapsedRef.current += delta;
      if (elapsedRef.current >= AUTOPLAY_MS) {
        elapsedRef.current = 0;
        setIndex((i) => (i + 1) % total);
      }
      paintFill(Math.min(elapsedRef.current / AUTOPLAY_MS, 1));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, total]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="aboutTm" ref={rootRef}>
      <div className="aboutTmProgress" aria-hidden>
        <span ref={fillRef} className="aboutTmProgressFill" />
      </div>

      <div className="aboutTmBar">
        <p className="aboutTmCounter">
          <span className="aboutTmCounterNow">{pad(index + 1)}</span>
          <span className="aboutTmCounterTotal">/{pad(total)}</span>
        </p>
        <div className="aboutTmNav">
          <button
            type="button"
            className="aboutTmArrow"
            onClick={() => step(-1)}
            aria-label="Previous testimonial"
          >
            <svg viewBox="0 0 16 16" aria-hidden>
              <path
                d="M13 8H3M7 3.5 2.5 8 7 12.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="aboutTmArrow"
            onClick={() => step(1)}
            aria-label="Next testimonial"
          >
            <svg viewBox="0 0 16 16" aria-hidden>
              <path
                d="M3 8h10M9 3.5 13.5 8 9 12.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="aboutTmViewport" aria-live="polite">
        {testimonials.map((t, i) => {
          const active = i === index;
          const offset = Math.sign(i - index);
          return (
            <figure
              key={t.name}
              className={"aboutTmItem" + (active ? " is-active" : "")}
              aria-hidden={!active}
              style={{ ["--tm-x"]: `${offset * 24}px` } as CSSProperties}
            >
              <span className="aboutTmMark" aria-hidden>
                &ldquo;
              </span>
              <blockquote className="aboutTmQuote">{t.quote}</blockquote>
              <figcaption className="aboutTmAttr">
                <span className="aboutTmAvatar">
                  {t.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.avatar} alt="" />
                  ) : (
                    <span className="aboutTmAvatarFill" aria-hidden />
                  )}
                </span>
                <span className="aboutTmMeta">
                  <span className="aboutTmName">{t.name}</span>
                  <span className="aboutTmRole">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
