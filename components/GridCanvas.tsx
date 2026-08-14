"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TILES, packRows } from "@/lib/tiles";
import ModeToggle from "@/components/ModeToggle";
import Work from "@/components/Work";

type Target = {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  blur: number;
  radius: number;
  delay: number;
};

// Ripple tuning — scatter magnitude, reach, falloff.
// Calibrated against the reference footage: neighbor distances roughly double
// (leeo tile d 247px -> 483px), motion completes in ~0.3s, fade trails motion.
const REACH = 380; // px — how far the extra scatter shove extends
const SCATTER = 220; // px — extra shove for the nearest neighbors
const ZOOM_TERM = 0.85; // radial expansion around the focal point (~2x positions)
const SCALE_REACH = 600; // px — falloff for the slight neighbor grow
const DELAY_IN = 0.00008; // s per px — a subtle wave, not a sequence
const DELAY_OUT = 0.00005;
const NEIGHBOR_OPACITY = 0.1;
const NEIGHBOR_BLUR = 1.5;

const IDLE: Target = { x: 0, y: 0, scale: 1, opacity: 1, blur: 0, radius: 6, delay: 0 };

type Mode = "work" | "grid";

// Views live side by side in one space, left to right. The bottom-right
// toggle lives on About (off) and here in grid (on).

// Spatial shift between modes: the incoming view enters from whichever side it
// sits on relative to the one you left. Durations follow page-transition
// guidance (300-400ms), ease-out for enter/exit.
function viewAnim(dir: number, reduce: boolean) {
  if (reduce) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.15 } },
      exit: { opacity: 0, transition: { duration: 0.1 } },
    };
  }
  const d = dir >= 0 ? 1 : -1;
  return {
    initial: { x: `${d * 24}%`, opacity: 0 },
    animate: {
      x: "0%",
      opacity: 1,
      transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] as const },
    },
    exit: {
      x: `${d * 14}%`,
      opacity: 0,
      transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] as const },
    },
  };
}

// Grid layout + drift
const SIDE_PAD = 16;
const GAP = 8;
const DRIFT_PX_PER_SEC = 33; // 1.5× prior pace — still readable, more alive
const COPY_STRIDE = 100000; // uid namespace per duplicated copy

export default function GridCanvas({
  initialMode = "work",
}: {
  initialMode?: Mode;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const rowsRef = useRef<HTMLDivElement | null>(null);
  const tileEls = useRef(new Map<number, HTMLDivElement>());
  const distances = useRef(new Map<number, number>());
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const router = useRouter();
  const mode = initialMode;
  const [zoom, setZoom] = useState(1);
  const [containerW, setContainerW] = useState(1200);
  const [focused, setFocused] = useState<number | null>(null);
  const [lastFocused, setLastFocused] = useState<number | null>(null);
  const [targets, setTargets] = useState<Map<number, Target> | null>(null);

  const reduce = useReducedMotion();
  const focusedRef = useRef(focused);
  focusedRef.current = focused;

  // Rows are justified to the live container width, so each row runs edge to
  // edge and the side padding stays minimal.
  const rows = useMemo(
    () => packRows(TILES, containerW, GAP, zoom),
    [containerW, zoom],
  );

  useEffect(() => {
    if (mode !== "grid") return;
    const sc = scrollRef.current;
    if (!sc) return;
    const measure = () => setContainerW(Math.max(320, sc.clientWidth - SIDE_PAD * 2));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(sc);
    return () => ro.disconnect();
  }, [mode]);

  // Seamless vertical loop in both directions. Content is rendered thrice;
  // scroll stays in the middle copy [one, 2one) so there's always room both
  // ways. Driving scrollTop (not a transform) keeps ripple math correct.
  const wrapScroll = useCallback(() => {
    const sc = scrollRef.current;
    const one = (rowsRef.current?.offsetHeight ?? 0) / 3;
    if (!sc || one <= 0) return;
    if (sc.scrollTop < one) sc.scrollTop += one;
    else if (sc.scrollTop >= one * 2) sc.scrollTop -= one;
  }, []);

  useEffect(() => {
    if (mode !== "grid") return;
    const sc = scrollRef.current;
    if (!sc) return;
    const place = () => {
      const one = (rowsRef.current?.offsetHeight ?? 0) / 3;
      if (one <= 0) return;
      // Preserve offset within a copy; seat in the middle copy.
      const within = sc.scrollTop % one;
      sc.scrollTop = within + one;
    };
    place();
    const t = window.setTimeout(place, 0);
    return () => clearTimeout(t);
  }, [mode, rows]);

  useEffect(() => {
    if (mode !== "grid") return;
    const sc = scrollRef.current;
    if (!sc) return;
    const onScroll = () => wrapScroll();
    sc.addEventListener("scroll", onScroll, { passive: true });
    return () => sc.removeEventListener("scroll", onScroll);
  }, [mode, wrapScroll]);

  useEffect(() => {
    if (mode !== "grid" || reduce) return;
    const sc = scrollRef.current;
    if (!sc) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      if (focusedRef.current === null) {
        sc.scrollTop += (DRIFT_PX_PER_SEC * dt) / 1000;
        wrapScroll();
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [mode, reduce, rows, wrapScroll]);

  // Only play the loops that are actually on screen.
  useEffect(() => {
    if (mode !== "grid") return;
    const sc = scrollRef.current;
    if (!sc) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) void v.play().catch(() => {});
          else v.pause();
        }
      },
      { root: sc, rootMargin: "300px 0px" },
    );
    sc.querySelectorAll<HTMLVideoElement>("video.tileFill").forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, [mode, rows]);

  const focusTile = useCallback((id: number) => {
    const sc = scrollRef.current;
    const el = tileEls.current.get(id);
    if (!sc || !el) return;

    const view = sc.getBoundingClientRect();
    // Layout-space position (ignores in-flight transforms), relative to the
    // visible canvas: offsetLeft/Top are measured from the scroller.
    const pos = (e: HTMLElement) => ({
      x: e.offsetLeft - sc.scrollLeft,
      y: e.offsetTop - sc.scrollTop,
      w: e.offsetWidth,
      h: e.offsetHeight,
    });

    const f = pos(el);
    const fcx = f.x + f.w / 2;
    const fcy = f.y + f.h / 2;

    const maxW = view.width * 0.72;
    const maxH = view.height * 0.78;
    const s = Math.min(maxW / f.w, maxH / f.h);

    const next = new Map<number, Target>();
    distances.current.clear();
    next.set(id, {
      x: view.width / 2 - fcx,
      y: view.height / 2 - fcy - 4,
      scale: s,
      opacity: 1,
      blur: 0,
      radius: 12 / s,
      delay: 0,
    });

    for (const [tid, tel] of tileEls.current) {
      if (tid === id) continue;
      const p = pos(tel);
      const dx = p.x + p.w / 2 - fcx;
      const dy = p.y + p.h / 2 - fcy;
      const d = Math.hypot(dx, dy) || 1;
      const fall = Math.exp(-d / REACH);
      const push = d * ZOOM_TERM + SCATTER * fall;
      distances.current.set(tid, d);
      next.set(tid, {
        x: (dx / d) * push,
        y: (dy / d) * push,
        scale: 1 + 0.22 * Math.exp(-d / SCALE_REACH),
        opacity: NEIGHBOR_OPACITY,
        blur: NEIGHBOR_BLUR,
        radius: 6,
        delay: Math.min(d * DELAY_IN, 0.09),
      });
    }

    if (idleTimer.current) clearTimeout(idleTimer.current);
    setTargets(next);
    setFocused(id);
    setLastFocused(id);
  }, []);

  const close = useCallback(() => {
    if (focusedRef.current === null) return;
    const focalId = focusedRef.current;
    setFocused(null);
    setTargets((prev) => {
      if (!prev) return prev;
      const next = new Map<number, Target>();
      for (const tid of prev.keys()) {
        const d = distances.current.get(tid) ?? 0;
        next.set(tid, {
          ...IDLE,
          delay: tid === focalId ? 0 : Math.min(d * DELAY_OUT, 0.06),
        });
      }
      return next;
    });
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      setTargets(null);
      setLastFocused(null);
    }, 650);
  }, []);

  const closeRef = useRef(close);
  closeRef.current = close;

  // Wheel: pinch (ctrl/cmd + wheel) zooms the grid; plain wheel while an item
  // is open zooms back out instead of scrolling underneath it.
  useEffect(() => {
    if (mode !== "grid") return;
    const sc = scrollRef.current;
    if (!sc) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoom((z) => Math.min(1.6, Math.max(0.6, z * (1 - e.deltaY * 0.0022))));
        return;
      }
      if (focusedRef.current !== null) {
        e.preventDefault();
        closeRef.current();
      }
    };
    sc.addEventListener("wheel", onWheel, { passive: false });
    return () => sc.removeEventListener("wheel", onWheel);
  }, [mode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const anim = viewAnim(1, !!reduce);

  return (
    <div className="canvasWrap">
      <AnimatePresence initial={false}>
        <motion.div
          key={mode}
          className="viewLayer"
          initial={anim.initial}
          animate={anim.animate}
          exit={anim.exit}
        >
          {mode === "work" ? (
            <Work />
          ) : (
            <>
              <div ref={scrollRef} className="scroller" onClick={() => closeRef.current()}>
                <div className="rows" ref={rowsRef}>
                  {[0, 1, 2].flatMap((copy) =>
                    rows.map((row, ri) => (
                    <div className="row" key={`${copy}-${ri}`} style={{ height: row.h }}>
                      {row.tiles.map((t) => {
                        const uid = copy * COPY_STRIDE + t.id;
                        const tgt = targets?.get(uid) ?? IDLE;
                        const isFocal = focused === uid || lastFocused === uid;
                        return (
                          <motion.div
                            key={uid}
                            data-tid={uid}
                            ref={(el) => {
                              if (el) tileEls.current.set(uid, el);
                              else tileEls.current.delete(uid);
                            }}
                            className={"tile" + (focused === uid ? " focal" : "")}
                            style={{
                              width: row.h * t.ar,
                              height: row.h,
                              background: t.shade,
                              zIndex: isFocal ? 60 : undefined,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (focused === uid) close();
                              else focusTile(uid);
                            }}
                            animate={{
                              x: tgt.x,
                              y: tgt.y,
                              scale: tgt.scale,
                              opacity: tgt.opacity,
                              filter: `blur(${tgt.blur}px)`,
                              borderRadius: tgt.radius,
                            }}
                            transition={{
                              default: {
                                type: "spring",
                                stiffness: focused === uid ? 520 : 400,
                                damping: focused === uid ? 42 : 33,
                                mass: 1,
                                delay: tgt.delay,
                              },
                              opacity: { duration: 0.45, ease: "easeOut", delay: tgt.delay },
                              filter: { duration: 0.45, ease: "easeOut", delay: tgt.delay },
                            }}
                          >
                            {t.video ? (
                              <video
                                className="tileFill"
                                src={t.grid}
                                poster={t.thumb}
                                muted
                                loop
                                playsInline
                                autoPlay
                                preload="metadata"
                              />
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img className="tileFill" src={t.thumb} alt="" loading="lazy" />
                            )}
                            {focused === uid && t.video && (
                              <video
                                className="tileFill"
                                src={t.full}
                                autoPlay
                                muted
                                loop
                                playsInline
                              />
                            )}
                            {focused === uid && (
                              <motion.div
                                className="selectRing"
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 0 }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                              />
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                    )),
                  )}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="bottomBar">
        <AnimatePresence>
          {mode === "grid" && (
            <motion.div
              className="zoomCtl"
              initial={{ opacity: 0, scale: 0.94, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <input
                type="range"
                min={0.6}
                max={1.6}
                step={0.01}
                value={zoom}
                aria-label="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
              />
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <span className="zoomDivider" />
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <rect x="1.5" y="2.5" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {mode === "grid" ? (
        <ModeToggle on onToggle={() => router.push("/about")} />
      ) : null}
    </div>
  );
}
