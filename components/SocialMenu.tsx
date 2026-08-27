"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ABOUT_INTRO } from "@/lib/about";

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD
 *
 * Read top-to-bottom. Each value is ms after the menu trigger.
 *
 *   0ms   separate menu panel flows out beneath the circular trigger
 *  80ms   social links fade and rise in (staggered 40ms)
 * ───────────────────────────────────────────────────────── */

const TIMING = {
  panelFlow: 0, // full-size panel starts revealing downward
  linksReveal: 80, // link sequence begins
};

const MENU_SHELL = {
  closedClip: "inset(0 0 88% 82% round 8px)", // reveal begins at top-right
  openClip: "inset(0 0 0% 0 round 8px)", // reveal the full-size panel
  pressScale: 0.97, // tactile feedback without vertical movement
  openTransition: {
    duration: 0.3,
    ease: [0.16, 1, 0.3, 1] as const,
  },
  closeTransition: {
    duration: 0.15,
    ease: [0.22, 1, 0.36, 1] as const,
  },
};

const MENU_LINKS = {
  offsetY: -4, // compact text-reveal distance
  initialScale: 0.98,
  stagger: 0.04, // seconds between rows
  enter: {
    duration: 0.15,
    ease: [0.22, 1, 0.36, 1] as const,
  },
  exit: {
    duration: 0.1,
    ease: [0.32, 0, 0.67, 0] as const,
  },
};

const MENU_GLYPH = {
  hiddenScale: 0.72,
  hiddenRotation: 45,
  transition: {
    duration: 0.25,
    ease: "easeInOut" as const,
  },
};

function IconX() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M2.2 2.2 13.8 13.8M13.8 2.2 2.2 13.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3.6 6.2H5.8V13H3.6V6.2ZM4.7 3C5.4 3 6 3.6 6 4.3S5.4 5.6 4.7 5.6 3.4 5 3.4 4.3 4 3 4.7 3ZM7.2 6.2H9.3V7.1C9.6 6.5 10.4 5.9 11.5 5.9C13.4 5.9 14 7 14 8.8V13H11.8V9.3C11.8 8.4 11.8 7.3 10.6 7.3S9.3 8.3 9.3 9.3V13H7.2V6.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconSubstack() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M2.5 3h11v1.6H2.5V3ZM2.5 6.2h11V13L8 10.4 2.5 13V6.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconGithub() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 1.6A6.4 6.4 0 0 0 5.8 14c.3.1.4-.2.4-.3v-1c-1.7.4-2-.7-2-.7-.3-.7-.7-.9-.7-.9-.6-.4 0-.4 0-.4.6 0 1 .7 1 .7.6 1 1.6.7 2 .5 0-.4.2-.7.4-.9-1.4-.2-2.8-.7-2.8-3.1 0-.7.2-1.2.6-1.7-.1-.2-.3-.8 0-1.6 0 0 .5-.2 1.7.7a5.8 5.8 0 0 1 3.1 0c1.2-.9 1.7-.7 1.7-.7.3.8.1 1.4 0 1.6.4.5.6 1 .6 1.7 0 2.4-1.4 2.9-2.8 3.1.2.2.4.6.4 1.1v1.6c0 .2.1.4.4.3A6.4 6.4 0 0 0 8 1.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconResume() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M4.5 2.5h5.2L12.5 5.3V13a.8.8 0 0 1-.8.8H4.5a.8.8 0 0 1-.8-.8V3.3a.8.8 0 0 1 .8-.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 2.6V5.2h2.8M5.8 8h4.4M5.8 10.4h3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

const ICONS: Record<string, () => ReactNode> = {
  "X/Twitter": IconX,
  LinkedIn: IconLinkedIn,
  Substack: IconSubstack,
  Github: IconGithub,
  Resume: IconResume,
};

export default function SocialMenu() {
  const [stage, setStage] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const reduceMotion = useReducedMotion();
  const open = stage > 0;

  useEffect(() => {
    if (stage !== 1 || reduceMotion) return;
    const revealTimer = window.setTimeout(
      () => setStage(2),
      TIMING.linksReveal - TIMING.panelFlow,
    );
    return () => window.clearTimeout(revealTimer);
  }, [reduceMotion, stage]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setStage(0);
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setStage(0);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const toggleMenu = () => {
    if (open) {
      setStage(0);
      return;
    }
    setStage(reduceMotion ? 2 : 1);
  };

  const shellTransition = reduceMotion
    ? { duration: 0 }
    : open
      ? MENU_SHELL.openTransition
      : MENU_SHELL.closeTransition;

  const glyphTransition = reduceMotion
    ? { duration: 0 }
    : MENU_GLYPH.transition;

  return (
    <div className="socialMenu" ref={rootRef} data-open={open ? "true" : "false"}>
      <motion.nav
        id={panelId}
        className="socialMenuPanel"
        aria-label="Social links"
        aria-hidden={!open}
        initial={false}
        animate={{
          opacity: open ? 1 : 0,
          clipPath: open ? MENU_SHELL.openClip : MENU_SHELL.closedClip,
        }}
        transition={shellTransition}
      >
        {ABOUT_INTRO.links.map((link, index) => {
          const Icon = ICONS[link.label];
          const linksVisible = stage >= 2;
          const linkTransition = reduceMotion
            ? { duration: 0 }
            : linksVisible
              ? {
                  ...MENU_LINKS.enter,
                  delay: index * MENU_LINKS.stagger,
                }
              : {
                  ...MENU_LINKS.exit,
                  delay:
                    (ABOUT_INTRO.links.length - index - 1) *
                    (MENU_LINKS.stagger / 2),
                };

          return (
            <motion.a
              key={link.label}
              className="socialMenuLink"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={open ? 0 : -1}
              initial={false}
              animate={{
                opacity: linksVisible ? 1 : 0,
                y: linksVisible ? 0 : MENU_LINKS.offsetY,
                scale: linksVisible ? 1 : MENU_LINKS.initialScale,
              }}
              transition={linkTransition}
              onClick={() => setStage(0)}
            >
              <span className="socialMenuIcon">
                {Icon ? <Icon /> : null}
              </span>
              {link.label}
            </motion.a>
          );
        })}
      </motion.nav>

      <motion.button
        type="button"
        className={"socialMenuBtn" + (open ? " on" : "")}
        aria-label={open ? "Close social links" : "Open social links"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggleMenu}
        whileTap={reduceMotion ? undefined : { scale: MENU_SHELL.pressScale }}
      >
        <span className="socialMenuGlyph" aria-hidden="true">
          <motion.svg
            viewBox="0 0 16 16"
            initial={false}
            animate={{
              opacity: open ? 0 : 1,
              rotate: open ? -MENU_GLYPH.hiddenRotation : 0,
              scale: open ? MENU_GLYPH.hiddenScale : 1,
            }}
            transition={glyphTransition}
          >
            <path
              d="M2.5 4.25h11M2.5 8h11M2.5 11.75h11"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </motion.svg>
          <motion.svg
            viewBox="0 0 16 16"
            initial={false}
            animate={{
              opacity: open ? 1 : 0,
              rotate: open ? 0 : MENU_GLYPH.hiddenRotation,
              scale: open ? 1 : MENU_GLYPH.hiddenScale,
            }}
            transition={glyphTransition}
          >
            <path
              d="M3 3l10 10M13 3 3 13"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </motion.svg>
        </span>
      </motion.button>
    </div>
  );
}
