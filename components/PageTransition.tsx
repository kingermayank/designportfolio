"use client";

import { animate, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* Koto's overlay page transition (koto.com/work -> case study), rebuilt.
   Two beats, both driven from the bottom edge of the screen:

     cover   a black curtain wipes up from the bottom while the project label
             rises 100px into place.
     reveal  once the route is mounted behind it, curtain and page travel up
             together — curtain to -100%, page from +1 viewport to 0 — so the
             case study is pushed into view with no seam between the two.

   Durations and easings are Koto's own; their GSAP timelines use CustomEase
   "x1, y1, x2, y2" strings, which are plain cubic-beziers. SPEED scales the
   whole sequence — 1 is Koto's pace, 2 is twice as fast. */
const SPEED = 2;
const COVER_DUR = 1 / SPEED;
const COVER_EASE = [0.55, 0, 0.15, 1] as const;
const LABEL_EASE = [0.4, 0, 0.2, 1] as const;
const LABEL_RISE = 100; // px
const HOLD = 0.283 / SPEED; // beat between cover and reveal
const REVEAL_DUR = 1 / SPEED;
const REVEAL_EASE = [0.65, 0, 0.45, 1] as const;
const LOAD_TIMEOUT = 6000; // ms — never strand the curtain if a route stalls

const HIDDEN = "inset(100% 0% 0% 0%)";
const SHOWN = "inset(0% 0% 0% 0%)";

export type TransitionDetail = { title: string; subtitle?: string };

type Target = { href: string; detail?: TransitionDetail };
type Phase = "idle" | "cover" | "load";

type Ctx = {
  /** Curtain up, load `href`, push it into view. No-op while one is running. */
  open: (href: string, detail?: TransitionDetail) => void;
  busy: boolean;
};

const TransitionCtx = createContext<Ctx | null>(null);

export function usePageTransition(): Ctx {
  const ctx = useContext(TransitionCtx);
  if (!ctx) throw new Error("usePageTransition must be used inside PageTransition");
  return ctx;
}

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("idle");
  const [target, setTarget] = useState<Target | null>(null);
  const [stalled, setStalled] = useState(false);

  const mainRef = useRef<HTMLDivElement | null>(null);
  const curtainRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);

  // Beats are one-shot: StrictMode re-runs effects, so latch what has started.
  const ran = useRef<"cover" | "reveal" | null>(null);

  // The route is mounted behind the curtain (or gave up waiting) — time to lift.
  const arrived = phase === "load" && (stalled || pathname === target?.href);

  const open = useCallback(
    (href: string, detail?: TransitionDetail) => {
      if (phase !== "idle") return;
      if (reduce) {
        router.push(href);
        return;
      }
      setTarget({ href, detail });
      setPhase("cover");
    },
    [phase, reduce, router],
  );

  // Beat 1 — wipe the curtain up over the page we're leaving.
  useEffect(() => {
    if (phase !== "cover" || ran.current === "cover") return;
    ran.current = "cover";

    const curtain = curtainRef.current;
    const label = labelRef.current;
    if (!curtain) return;

    const plays = [
      animate(curtain, { clipPath: [HIDDEN, SHOWN] }, { duration: COVER_DUR, ease: COVER_EASE }),
    ];
    if (label) {
      plays.push(
        animate(label, { y: [LABEL_RISE, 0] }, { duration: COVER_DUR, ease: LABEL_EASE }),
      );
    }

    let cancelled = false;
    void Promise.all(plays.map((p) => p.finished)).then(() => {
      if (cancelled) return;
      setPhase("load");
    });
    return () => {
      cancelled = true;
    };
  }, [phase]);

  // Beat 2 — the screen is fully covered, so swap routes behind it. The
  // incoming page is parked a full viewport below before the push lands, which
  // is where the reveal will lift it from. The timer is a floor under a route
  // that never resolves, so the curtain is never left stranded.
  useEffect(() => {
    if (phase !== "load" || !target) return;

    const main = mainRef.current;
    const travel = curtainRef.current?.offsetHeight ?? window.innerHeight;
    if (main) main.style.transform = `translateY(${travel}px)`;
    router.push(target.href);

    const t = window.setTimeout(() => setStalled(true), LOAD_TIMEOUT);
    return () => window.clearTimeout(t);
  }, [phase, target, router]);

  // Beat 3 — curtain and page rise together, then hand control back.
  useEffect(() => {
    if (!arrived || ran.current === "reveal") return;
    ran.current = "reveal";

    const curtain = curtainRef.current;
    const main = mainRef.current;
    if (!curtain) return;

    const travel = curtain.offsetHeight;
    const opts = { duration: REVEAL_DUR, delay: HOLD, ease: REVEAL_EASE } as const;
    const plays = [animate(curtain, { y: [0, -travel] }, opts)];
    if (main) plays.push(animate(main, { y: [travel, 0] }, opts));

    let cancelled = false;
    void Promise.all(plays.map((p) => p.finished)).then(() => {
      if (cancelled) return;
      curtain.style.transform = "";
      curtain.style.clipPath = HIDDEN;
      if (main) main.style.transform = "";
      ran.current = null;
      setTarget(null);
      setStalled(false);
      setPhase("idle");
    });
    return () => {
      cancelled = true;
    };
  }, [arrived]);

  const busy = phase !== "idle";
  const ctx = useMemo(() => ({ open, busy }), [open, busy]);

  return (
    <TransitionCtx.Provider value={ctx}>
      <div id="main" ref={mainRef}>
        {children}
      </div>

      <div
        className={"txCurtain" + (busy ? " on" : "")}
        ref={curtainRef}
        aria-hidden={!busy}
      >
        {target?.detail && (
          <div className="txLabel">
            <div className="txLabelInner" ref={labelRef}>
              <span className="txTitle">{target.detail.title}</span>
              {target.detail.subtitle && (
                <span className="txSubtitle">{target.detail.subtitle}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </TransitionCtx.Provider>
  );
}
