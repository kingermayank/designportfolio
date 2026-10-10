"use client";

import { animate, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { ProjectTransition } from "@/lib/projectTransition";
import { AboutTransition, type AboutMotion } from "@/lib/aboutTransition";
import AboutMotionLab from "@/components/AboutMotionLab";
import "@/app/about-transition.css";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const GLIDE_DUR = 0.25;
const GLIDE_DISTANCE = 20;
const GLIDE_EASE = [0.22, 1, 0.36, 1] as const;
const LOAD_TIMEOUT = 6000;

export type TransitionDetail = { title: string; subtitle?: string; source?: HTMLElement };
export type TransitionDirection = "forward" | "back";

type Target = {
  href: string;
  direction: TransitionDirection;
};
type Phase = "idle" | "exit" | "load";

type Ctx = {
  open: (
    href: string,
    detail?: TransitionDetail,
    direction?: TransitionDirection,
  ) => void;
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
  const projectTransition = useRef<ProjectTransition | null>(null);
  const aboutTransition = useRef<AboutTransition | null>(null);
  const [projectBusy, setProjectBusy] = useState(false);
  const [aboutMotion, setAboutMotion] = useState<AboutMotion>("aperture");

  useEffect(() => {
    const transition = new ProjectTransition({
      push: (href) => router.push(href, { scroll: false }),
      back: () => router.back(),
      prefetch: (href) => router.prefetch(href),
    }, setProjectBusy);
    projectTransition.current = transition;
    const about = new AboutTransition();
    aboutTransition.current = about;
    return () => {
      transition.dispose();
      about.dispose();
      aboutTransition.current = null;
      projectTransition.current = null;
    };
  }, [router]);

  useEffect(() => {
    projectTransition.current?.setPath(pathname);
  }, [pathname]);

  const [phase, setPhase] = useState<Phase>("idle");
  const [target, setTarget] = useState<Target | null>(null);
  const [stalled, setStalled] = useState(false);

  const mainRef = useRef<HTMLDivElement | null>(null);
  const ran = useRef<"exit" | "enter" | null>(null);

  const arrived = phase === "load" && (stalled || pathname === target?.href);

  const open = useCallback(
    (
      href: string,
      detail?: TransitionDetail,
      direction: TransitionDirection = "forward",
    ) => {
      if (phase !== "idle" || projectBusy) return;
      if (href === "/about" && detail?.source && !reduce && aboutTransition.current) {
        aboutTransition.current.open(detail.source, () => router.push(href, { scroll: false }), setProjectBusy, aboutMotion);
        return;
      }
      if (projectTransition.current?.open(href, detail?.source)) return;
      if (reduce) {
        router.push(href);
        return;
      }

      setTarget({ href, direction });
      setPhase("exit");
    },
    [phase, projectBusy, reduce, router, aboutMotion],
  );

  // Glide the current route away from the direction of travel.
  useEffect(() => {
    if (phase !== "exit" || !target || ran.current === "exit") return;
    ran.current = "exit";

    const main = mainRef.current;
    if (!main) return;
    const exitX = target.direction === "forward" ? -GLIDE_DISTANCE : GLIDE_DISTANCE;
    const play = animate(
      main,
      {
        x: [0, exitX],
        opacity: [1, 0],
        filter: ["blur(0px)", "blur(3px)"],
      },
      { duration: GLIDE_DUR, ease: GLIDE_EASE },
    );

    let cancelled = false;
    void play.finished.then(() => {
      if (!cancelled) setPhase("load");
    });
    return () => {
      cancelled = true;
    };
  }, [phase, target]);

  // Swap routes while the outgoing page is fully hidden.
  useEffect(() => {
    if (phase !== "load" || !target) return;

    const main = mainRef.current;
    const enterX = target.direction === "forward" ? GLIDE_DISTANCE : -GLIDE_DISTANCE;
    if (main) {
      main.style.transform = `translateX(${enterX}px)`;
      main.style.opacity = "0";
      main.style.filter = "blur(3px)";
    }

    router.push(target.href);
    const timeout = window.setTimeout(() => setStalled(true), LOAD_TIMEOUT);
    return () => window.clearTimeout(timeout);
  }, [phase, target, router]);

  // Bring the mounted route in from the opposite side. Back navigation uses
  // the inverse direction so the spatial relationship remains consistent.
  useEffect(() => {
    if (!arrived || !target || ran.current === "enter") return;
    ran.current = "enter";

    const main = mainRef.current;
    if (!main) return;
    const enterX = target.direction === "forward" ? GLIDE_DISTANCE : -GLIDE_DISTANCE;
    const play = animate(
      main,
      {
        x: [enterX, 0],
        opacity: [0, 1],
        filter: ["blur(3px)", "blur(0px)"],
      },
      { duration: GLIDE_DUR, ease: GLIDE_EASE },
    );

    let cancelled = false;
    void play.finished.then(() => {
      if (cancelled) return;

      main.style.transform = "";
      main.style.opacity = "";
      main.style.filter = "";
      ran.current = null;
      setTarget(null);
      setStalled(false);
      setPhase("idle");
    });
    return () => {
      cancelled = true;
    };
  }, [arrived, target]);

  const busy = phase !== "idle" || projectBusy;
  const ctx = useMemo(() => ({ open, busy }), [open, busy]);

  return (
    <TransitionCtx.Provider value={ctx}>
      <div id="main" ref={mainRef} data-transition-busy={busy || undefined}>
        {children}
      </div>
      {(pathname === "/" || pathname === "/about") && <AboutMotionLab
        selected={aboutMotion} onSelect={setAboutMotion} busy={busy} onAbout={pathname === "/about"}
        onPreview={(source) => open("/about", { title: "About Me", source })}
        onBack={() => open("/", { title: "Home" }, "back")}
      />}
    </TransitionCtx.Provider>
  );
}
