"use client";

import { useEffect, useRef, useState } from "react";
import { ScenarioStage } from "./ScenarioStage";
import { SCENARIOS } from "./scenarios";

/**
 * Region edge cases — same system as the comment-card state flow.
 *
 * ONE persistent centered wrapper (fixed left/top/width/height) holds the
 * slide. Scenarios are states inside that wrapper: only opacity animates,
 * so the stage never shifts laterally between edge cases.
 *
 * Plain loop — selector items are clickable, no player controls.
 */

const STAGE_W = 2606;
const STAGE_H = Math.round((STAGE_W * 9) / 16); // 1466

const SLIDE_BG = "/pathai/region-edge-cases/slide-bg.png";

const FONT = "var(--font-gotham-narrow), 'Gotham Narrow', sans-serif";
const FONT_LABEL = "var(--font-label), var(--font-nitti-px), sans-serif";
const BACKGROUND = "#dce0e9";
const RADIUS = 14.074;

/* ── Persistent centered wrapper ───────────────────────────────────────── */
const HERO_W = 1700;
const HERO_H = Math.round((HERO_W * 9) / 16); // 956
const HERO_TOP = 64;
const HERO_CENTER_X = STAGE_W / 2;
const HERO_CENTER_Y = HERO_TOP + HERO_H / 2;

const HERO_CROSSFADE = "opacity 300ms cubic-bezier(0.22, 1, 0.36, 1)";

/* ── Selector strip — below the panel, never overlapping ───────────────── */
const THUMB_W = 400;
const THUMB_H = Math.round((THUMB_W * 9) / 16); // 225
const STRIP_SCALE = 0.8;
const STRIP_SCALE_ACTIVE = 1.14;
const STRIP_GAP = 56;
const STRIP_SLOT_W = Math.ceil(THUMB_W * STRIP_SCALE * STRIP_SCALE_ACTIVE) + 12;
const STRIP_SLOT_H = Math.ceil(THUMB_H * STRIP_SCALE * STRIP_SCALE_ACTIVE) + 12;
const STRIP_LABEL_H = 84;
const STRIP_BOTTOM = 60;
const STRIP_TOP = STAGE_H - STRIP_BOTTOM - (STRIP_SLOT_H + 16 + STRIP_LABEL_H);

const STRIP_TRANSITION =
  "transform 300ms cubic-bezier(0.22, 1, 0.36, 1), filter 300ms ease, opacity 300ms cubic-bezier(0.22, 1, 0.36, 1)";
const STRIP_INACTIVE_OPACITY = 0.75;
const STRIP_INACTIVE_GRAYSCALE = 0.42;
const STRIP_LABEL_SIZE = 24;
const STRIP_LABEL_ACTIVE = "#2C3548";
const STRIP_LABEL_INACTIVE = "#5E6A87";

/** Subtle playhead — same treatment as the comment-card strip. */
const PROGRESS_MUTE = "rgba(188, 194, 206, 0.16)";
const PROGRESS_FILL =
  "linear-gradient(90deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.4) 58%, rgba(20,107,194,0.1) 100%)";
const PROGRESS_LINE = "rgba(20, 107, 194, 0.52)";
const PROGRESS_LINE_W = 1.5;

export default function RegionEdgeCases() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [localTime, setLocalTime] = useState(0);
  const activeIndexRef = useRef(0);
  const segmentStartedRef = useRef(0);

  const selectScenario = (index: number) => {
    activeIndexRef.current = index;
    setActiveIndex(index);
    segmentStartedRef.current = performance.now();
    setLocalTime(0);
  };

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "80px", threshold: 0.05 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;
    const measure = () => setScale(element.clientWidth / STAGE_W);
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    segmentStartedRef.current = performance.now();
    setLocalTime(0);
    let frame = 0;
    const tick = (now: number) => {
      const scenario = SCENARIOS[activeIndexRef.current];
      if (reduceMotion) {
        setLocalTime(scenario.duration);
        frame = requestAnimationFrame(tick);
        return;
      }
      const local = (now - segmentStartedRef.current) / 1000;
      if (local >= scenario.duration) {
        const next = (activeIndexRef.current + 1) % SCENARIOS.length;
        activeIndexRef.current = next;
        setActiveIndex(next);
        segmentStartedRef.current = now;
        setLocalTime(0);
      } else {
        setLocalTime(local);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, reduceMotion]);

  const activeScenario = SCENARIOS[activeIndex];
  const progress =
    activeScenario.duration > 0
      ? Math.max(0, Math.min(1, localTime / activeScenario.duration))
      : 0;
  const progressPct = progress * 100;

  return (
    <figure className="csFigure">
      <div
        ref={wrapperRef}
        className="csMedia csCommentStates"
        style={{ background: BACKGROUND, aspectRatio: STAGE_W / STAGE_H }}
        role="region"
        aria-label="Region selection edge cases: nested region selection, hover and selection priority, drawing over an existing region, and z-index placement."
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: STAGE_W,
            height: STAGE_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            pointerEvents: "auto",
            fontFamily: FONT,
          }}
        >
          {/* Soft spotlight behind the panel */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: HERO_CENTER_X,
              top: HERO_CENTER_Y,
              width: 2000,
              height: 1200,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              background:
                "radial-gradient(closest-side, rgba(255,255,255,.88), rgba(255,255,255,0))",
            }}
          />

          {/* Persistent centered panel — slide lives only here */}
          <div
            style={{
              position: "absolute",
              left: HERO_CENTER_X,
              top: HERO_CENTER_Y,
              width: HERO_W,
              height: HERO_H,
              transform: "translate(-50%, -50%)",
              borderRadius: RADIUS,
              overflow: "hidden",
              background: "#f7f7f7",
              boxShadow: "0 0 0 1px rgba(94, 106, 135, 0.12)",
              pointerEvents: "none",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SLIDE_BG}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
            {SCENARIOS.map((scenario, i) => {
              const on = i === activeIndex;
              return (
                <div
                  key={scenario.id}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: on ? 1 : 0,
                    transition: reduceMotion ? "none" : HERO_CROSSFADE,
                    zIndex: on ? 2 : 1,
                  }}
                >
                  <ScenarioStage
                    scenario={scenario}
                    time={on ? localTime : scenario.duration}
                    reduceMotion={reduceMotion}
                  />
                </div>
              );
            })}
          </div>

          {/* Selector strip — clickable; active scales from center */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: STRIP_TOP,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: STRIP_GAP,
              pointerEvents: "auto",
            }}
            role="tablist"
            aria-label="Region edge cases"
          >
            {SCENARIOS.map((scenario, i) => {
              const active = i === activeIndex;
              const thumbScale =
                STRIP_SCALE * (active ? STRIP_SCALE_ACTIVE : 1);
              return (
                <button
                  key={scenario.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Show ${scenario.label}`}
                  onClick={() => selectScenario(i)}
                  style={{
                    width: STRIP_SLOT_W,
                    padding: 0,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                    overflow: "visible",
                  }}
                >
                  <div
                    style={{
                      width: STRIP_SLOT_W,
                      height: STRIP_SLOT_H,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "visible",
                    }}
                  >
                    <div
                      style={{
                        width: THUMB_W,
                        height: THUMB_H,
                        transform: `scale(${thumbScale})`,
                        transformOrigin: "50% 50%",
                        transition: STRIP_TRANSITION,
                        filter: active
                          ? "none"
                          : `grayscale(${STRIP_INACTIVE_GRAYSCALE})`,
                        opacity: active ? 1 : STRIP_INACTIVE_OPACITY,
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: THUMB_W,
                          height: THUMB_H,
                          overflow: "hidden",
                          borderRadius: RADIUS,
                          background: "#f7f7f7",
                          isolation: "isolate",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={SLIDE_BG}
                          alt=""
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                        <div style={{ position: "absolute", inset: 0 }}>
                          <ScenarioStage
                            scenario={scenario}
                            time={scenario.duration}
                            reduceMotion
                            preview
                          />
                        </div>

                        {/* Progress: white-forward tint + thin blue leading edge */}
                        {active && (
                          <div
                            aria-hidden
                            style={{
                              position: "absolute",
                              inset: 0,
                              borderRadius: RADIUS,
                              overflow: "hidden",
                              clipPath: `inset(0 round ${RADIUS}px)`,
                              pointerEvents: "none",
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: `${progressPct}%`,
                                background: PROGRESS_MUTE,
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                bottom: 0,
                                width: `${progressPct}%`,
                                background: PROGRESS_FILL,
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                left: `min(calc(100% - ${PROGRESS_LINE_W}px), max(0px, calc(${progressPct}% - ${PROGRESS_LINE_W / 2}px)))`,
                                width: PROGRESS_LINE_W,
                                background: PROGRESS_LINE,
                                borderRadius: PROGRESS_LINE_W,
                                opacity:
                                  progress > 0.002 && progress < 0.998 ? 1 : 0,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      height: STRIP_LABEL_H,
                      width: "100%",
                      fontFamily: FONT_LABEL,
                      fontSize: STRIP_LABEL_SIZE,
                      fontWeight: 600,
                      letterSpacing: 2.2,
                      textTransform: "uppercase",
                      color: active ? STRIP_LABEL_ACTIVE : STRIP_LABEL_INACTIVE,
                      opacity: active ? 1 : 0.68,
                      transition:
                        "opacity 300ms cubic-bezier(0.22, 1, 0.36, 1), color 300ms cubic-bezier(0.22, 1, 0.36, 1)",
                      textAlign: "center",
                      lineHeight: 1.25,
                    }}
                  >
                    {scenario.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </figure>
  );
}
