"use client";

import { useRef, useState } from "react";
import { useAnimate, useReducedMotion } from "framer-motion";
import posthog from "posthog-js";
import { HIRING_LETTER } from "@/lib/letter";

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — springs, phases overlap so it reads as one motion.
 *
 * Open
 *    0ms   "Open letter" fades; page glides so the title sits at the top
 *    0ms   letter lifts out of the pocket (behind the envelope front)
 *  260ms   letter passes in front of the envelope…
 *  260ms   …and keeps going: settles and unfolds to full length
 *
 * Close (the reverse)
 *    0ms   page glides back to the title; letter folds up and lifts
 *  420ms   letter passes behind the envelope front and sinks into the pocket
 *  560ms   "Open letter" fades back in
 * ───────────────────────────────────────────────────────── */

const LIFT_Y = -48; // px above the resting peek while passing the pocket rim
const OPEN_Y = -12; // resting offset once unfolded
const SWAP_AT = 0.26; // s — when the letter crosses in front of / behind the front
const LIFT = { type: "spring", bounce: 0, duration: 0.5 } as const;
const UNFOLD = { type: "spring", bounce: 0.08, duration: 0.85 } as const;
const FOLD = { type: "spring", bounce: 0, duration: 0.6 } as const;
const TUCK = { type: "spring", bounce: 0.12, duration: 0.6 } as const;
const FADE = { duration: 0.2, ease: [0.22, 1, 0.36, 1] } as const;

// Closed letter height, as fractions of the envelope width (see .envLetter).
const FLAP = 0.25;
const POCKET = 0.5625;
const PEEK = 0.88;

const wait = (seconds: number) => new Promise((r) => setTimeout(r, seconds * 1000));

/** Medify-style envelope: the letter peeks out of the pocket until opened. */
export default function AboutLetterEnvelope() {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [open, setOpen] = useState(false);
  const busy = useRef(false);
  const reduce = useReducedMotion();

  const parts = () => {
    const root = scope.current;
    return {
      root,
      letter: root.querySelector<HTMLElement>(".envLetter")!,
      content: root.querySelector<HTMLElement>(".envLetterContent")!,
      openBtn: root.querySelector<HTMLElement>(".envOpen")!,
    };
  };

  // Keep the section title at the top of the view while the letter grows or
  // shrinks, so the whole letter (and its Close control) fits on screen and
  // closing never strands the reader in empty space.
  const frameTitle = () =>
    document.getElementById("about-letter-title")?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });

  async function openLetter() {
    if (open || busy.current) return;
    busy.current = true;
    posthog.capture("about_letter_opened");
    const { letter, content, openBtn } = parts();
    const full = content.offsetHeight;
    frameTitle();

    if (reduce) {
      letter.style.zIndex = "5";
      letter.style.height = "auto";
      setOpen(true);
      busy.current = false;
      return;
    }

    void animate(openBtn, { opacity: 0, scale: 0.96 }, FADE);
    void animate(letter, { y: LIFT_Y }, LIFT);
    await wait(SWAP_AT);
    // Clear of the pocket rim: cross in front and carry straight on into the
    // unfold. A new spring on a moving value inherits its velocity, so the
    // handoff has no pause or jolt.
    letter.style.zIndex = "5";
    setOpen(true);
    await animate(letter, { y: OPEN_Y, height: full }, UNFOLD);
    letter.style.height = "auto";
    busy.current = false;
  }

  async function closeLetter() {
    if (!open || busy.current) return;
    busy.current = true;
    const { root, letter, openBtn } = parts();
    const closed = root.offsetWidth * (FLAP + POCKET * PEEK);
    frameTitle();

    if (reduce) {
      letter.style.zIndex = "";
      letter.style.height = "";
      setOpen(false);
      busy.current = false;
      return;
    }

    setOpen(false);
    void animate(letter, { y: LIFT_Y, height: [letter.offsetHeight, closed] }, FOLD);
    await wait(0.42);
    // Mostly folded and above the rim: drop behind the front and sink in.
    letter.style.zIndex = "";
    const tuck = animate(letter, { y: 0, height: closed }, TUCK);
    await wait(0.14);
    void animate(openBtn, { opacity: 1, scale: 1 }, FADE);
    await tuck;
    letter.style.height = "";
    busy.current = false;
  }

  return (
    <div ref={scope} className="envStage" data-open={open || undefined}>
      {/* Back of the envelope with its flap folded open above the pocket. */}
      <svg className="envBack" viewBox="0 0 100 81.25" preserveAspectRatio="none" aria-hidden="true">
        <path className="envBackFlap" d="M0 25 L50 0 L100 25 Z" />
        <path className="envBackBody" d="M0 25 H100 V81.25 H0 Z" />
      </svg>

      <article className="envLetter" aria-labelledby="about-letter-title">
        <div className="envLetterContent">
          <div className="envBody">
            <p>{HIRING_LETTER.greeting}</p>
            {HIRING_LETTER.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          <footer className="envSign">
            <span>{HIRING_LETTER.signoff}</span>
            <span className="envSignature">{HIRING_LETTER.signature}</span>
          </footer>
        </div>
      </article>

      {/* Front pocket: two side flaps meeting in a V, over a bottom flap. */}
      <svg className="envFront" viewBox="0 0 100 56.25" preserveAspectRatio="none" aria-hidden="true">
        <path className="envFlapBottom" d="M0 56.25 L50 30 L100 56.25 Z" />
        <path className="envFlapSide" d="M0 0 L50 30 L0 56.25 Z" />
        <path className="envFlapSide envFlapRight" d="M100 0 L50 30 L100 56.25 Z" />
        <path className="envFlapEdge" d="M0 0 L50 30 L100 0 M0 56.25 L50 30 L100 56.25" />
      </svg>

      <button
        type="button"
        className="envAction envOpen"
        aria-expanded={open}
        onClick={openLetter}
        tabIndex={open ? -1 : 0}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M7 2.5v9M2.5 7h9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        Open letter
      </button>

      {open ? (
        <button type="button" className="envAction envClose" onClick={closeLetter}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Close letter
        </button>
      ) : null}
    </div>
  );
}
