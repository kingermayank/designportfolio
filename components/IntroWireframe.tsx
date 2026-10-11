"use client";

import { useEffect, useRef, useState } from "react";

// Load intro: a black column grid builds, the live page is traced as
// wireframes, then each wireframe opens onto the real element beneath it.
// The decision to play is made before paint by INTRO_GATE (lib/introGate.ts),
// so repeat visits and reduced motion never flash the overlay.

type Kind = "text" | "media";
type Wire = {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  kind: Kind;
  label: string;
};

// Labels follow the spec-sheet shorthand of the reference: a type and one
// value. Text reads its live font size; media reads its live dimensions.
const size = (el: Element) => `Sans ${Math.round(parseFloat(getComputedStyle(el).fontSize))}`;
const dims = (el: Element) => {
  const r = el.getBoundingClientRect();
  return `Img ${Math.round(r.width)}×${Math.round(r.height)}`;
};

// What gets traced, in the order a reader meets it.
// `snug` traces a centered band around the text instead of the full hit
// area — the tabs' tall touch targets otherwise crowd the top edge.
const TARGETS: { sel: string; kind: Kind; label: (el: Element) => string; snug?: boolean }[] = [
  { sel: ".workBrand", kind: "text", label: size },
  { sel: ".workSubtitle", kind: "text", label: size },
  { sel: ".workFitBtn", kind: "text", label: () => "Button" },
  { sel: ".workLens", kind: "text", label: () => "Tab", snug: true },
  { sel: ".workCard", kind: "media", label: dims },
  { sel: ".workSocial", kind: "text", label: size },
];

// Timeline, ms from mount.
const COL_STAGGER = 45;
const COL_DUR = 700;
const SAFE_AT = 350;
// Two tracks: text is light and resolves first; media follows on its own beat.
const TEXT_AT = 450;
const TEXT_STAGGER = 35;
const TEXT_HOLD = 380; // drawn → revealed, per slot
const MEDIA_AT = 750;
const MEDIA_STAGGER = 90;
const MEDIA_HOLD = 650;
const HOLE_DUR = 420;
const WIRE_LINGER = 300; // outline stays briefly over the revealed element
const FADE_DUR = 400;

let played = false;

function measure(): Wire[] {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const wires: Wire[] = [];
  for (const t of TARGETS) {
    for (const el of document.querySelectorAll(t.sel)) {
      let r = el.getBoundingClientRect();
      if (t.snug) {
        const h = Math.min(r.height, parseFloat(getComputedStyle(el).fontSize) * 1.3 + 10);
        r = new DOMRect(r.left, r.top + (r.height - h) / 2, r.width, h);
      }
      if (r.width < 8 || r.height < 8 || r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) continue;
      const visible =
        typeof el.checkVisibility === "function"
          ? el.checkVisibility({ visibilityProperty: true })
          : true;
      if (!visible) continue;
      wires.push({
        x: r.left,
        y: r.top,
        w: r.width,
        h: r.height,
        // Wireframes are deliberately boxy, whatever the element's radius.
        r: 0,
        kind: t.kind,
        label: t.label(el),
      });
    }
  }
  // Reading order: top to bottom, then left to right, so the build sweeps.
  return wires.sort((a, b) => a.y + a.x * 0.35 - (b.y + b.x * 0.35));
}

export default function IntroWireframe() {
  const [active] = useState(() => !played);
  const [view, setView] = useState<{ w: number; h: number } | null>(null);
  const [trace, setTrace] = useState<{ wires: Wire[]; offset: number } | null>(null);
  const [gone, setGone] = useState(false);
  const [skipping, setSkipping] = useState(false);
  const mountAt = useRef(0);

  useEffect(() => {
    // Back on home after the intro already ran: let intro-only timing
    // overrides (e.g. the wordmark dot delay) fall away.
    if (!active) {
      document.documentElement.dataset.introDone = "1";
      return;
    }
    played = true;
    // Not playing: the overlay stays display:none via CSS.
    if (document.documentElement.dataset.intro !== "play") return;

    let cancelled = false;
    mountAt.current = performance.now();
    const raf = requestAnimationFrame(() => {
      setView({ w: window.innerWidth, h: window.innerHeight });
    });

    // Trace after webfonts settle so text boxes match the final layout.
    const fonts = document.fonts?.ready ?? Promise.resolve();
    void Promise.race([fonts, new Promise((r) => setTimeout(r, 400))]).then(() => {
      if (!cancelled) setTrace({ wires: measure(), offset: performance.now() - mountAt.current });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [active]);

  const wires = trace?.wires ?? null;

  // Schedule teardown once the wire count (and so the full length) is known.
  const timeline = wires ? buildTimeline(wires) : null;
  useEffect(() => {
    if (!timeline || document.documentElement.dataset.introHold) return;
    const elapsed = performance.now() - mountAt.current;
    const t = window.setTimeout(() => setGone(true), Math.max(0, timeline.end - elapsed));
    return () => window.clearTimeout(t);
  }, [timeline?.end]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!skipping) return;
    const t = window.setTimeout(() => setGone(true), 220);
    return () => window.clearTimeout(t);
  }, [skipping]);

  if (!active || gone) return null;

  // CSS animations count their delay from insertion, so traced elements
  // (mounted after the first frame) are shifted back by the time already spent.
  const at = (ms: number) => `${Math.round(ms - (trace?.offset ?? 0))}ms`;

  const cols = view ? (view.w < 768 ? 4 : 12) : 12;
  const margin = view && view.w < 768 ? 16 : 24;
  const gutter = view && view.w < 768 ? 12 : 16;
  const colW = view ? (view.w - margin * 2 - gutter * (cols - 1)) / cols : 0;

  return (
    <div
      className={"intro" + (view ? " is-live" : "") + (skipping ? " is-skipping" : "")}
      aria-hidden
      onClick={() => setSkipping(true)}
    >
      {view && (
        <svg className="introSvg" width={view.w} height={view.h} viewBox={`0 0 ${view.w} ${view.h}`}>
          <defs>
            <pattern id="introPx" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M8 0H0V8" fill="none" className="introPxLine" />
            </pattern>
            <mask id="introHoles" maskUnits="userSpaceOnUse" x="0" y="0" width={view.w} height={view.h}>
              <rect width={view.w} height={view.h} fill="#fff" />
              {wires?.map((w, i) => (
                <rect
                  key={i}
                  className="introHole"
                  x={w.x}
                  y={w.y}
                  width={w.w}
                  height={w.h}
                  rx={w.r}
                  style={{ animationDelay: at(timeline!.slots[i].hole) }}
                />
              ))}
            </mask>
          </defs>

          <g
            mask="url(#introHoles)"
            className={"introGround" + (timeline ? " is-timed" : "")}
            style={timeline ? { animationDelay: at(timeline.groundAt) } : undefined}
          >
            <rect width={view.w} height={view.h} className="introBg" />
            <rect width={view.w} height={view.h} fill="url(#introPx)" />
            {Array.from({ length: cols }, (_, i) => (
              <rect
                key={i}
                className="introCol"
                x={margin + i * (colW + gutter)}
                y={0}
                width={colW}
                height={view.h}
                style={{
                  animationDelay: `${i * COL_STAGGER}ms`,
                  animationDuration: `${COL_DUR + (i % 3) * 90}ms`,
                }}
              />
            ))}
            <rect
              className="introSafe"
              x={margin / 2}
              y={margin / 2}
              width={view.w - margin}
              height={view.h - margin}
              style={{ animationDelay: `${SAFE_AT}ms` }}
            />
          </g>

          <g
            className="introWires"
          >
            {wires?.map((w, i) => {
              const { draw: d, out } = timeline!.slots[i];
              return (
                <g key={i} className={"introWire is-" + w.kind} style={{ animationDelay: at(out) }}>
                  <rect
                    x={w.x + 0.5}
                    y={w.y + 0.5}
                    width={w.w - 1}
                    height={w.h - 1}
                    rx={w.r}
                    pathLength={1}
                    className="introDraw"
                    style={{ animationDelay: at(d) }}
                  />
                  {w.kind === "media" && (
                    <>
                      <line
                        x1={w.x} y1={w.y} x2={w.x + w.w} y2={w.y + w.h}
                        pathLength={1}
                        className="introDraw introDiag"
                        style={{ animationDelay: at(d + 180) }}
                      />
                      <line
                        x1={w.x + w.w} y1={w.y} x2={w.x} y2={w.y + w.h}
                        pathLength={1}
                        className="introDraw introDiag"
                        style={{ animationDelay: at(d + 240) }}
                      />
                    </>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      )}

      {wires && timeline && (
        <div className="introLabels">
          {wires.map((w, i) => (
            <span
              key={i}
              className={"introLabel is-" + w.kind}
              style={{
                left: w.x,
                top: w.y,
                animationDelay: `${at(timeline.slots[i].draw + 80)}, ${at(timeline.slots[i].out)}`,
              }}
            >
              {w.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function buildTimeline(wires: Wire[]) {
  let t = 0;
  let m = 0;
  const slots = wires.map((w) => {
    const draw = w.kind === "text" ? TEXT_AT + t++ * TEXT_STAGGER : MEDIA_AT + m++ * MEDIA_STAGGER;
    const hole = draw + (w.kind === "text" ? TEXT_HOLD : MEDIA_HOLD);
    return { draw, hole, out: hole + HOLE_DUR + WIRE_LINGER };
  });
  const lastHole = Math.max(0, ...slots.map((s) => s.hole + HOLE_DUR));
  const lastOut = Math.max(0, ...slots.map((s) => s.out));
  const groundAt = lastHole - 200;
  return { slots, groundAt, end: Math.max(groundAt, lastOut) + FADE_DUR + 50 };
}
