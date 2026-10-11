"use client";

import { useRef, useState } from "react";
import { useAnimate, useReducedMotion } from "framer-motion";
import posthog from "posthog-js";
import CopyEmailButton from "@/components/CopyEmailButton";
import { HoverTextPreview } from "@/components/ui/hover-link-preview";
import { HIRING_LETTER, WORK_FIT_CTA } from "@/lib/letter";

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — each direction is ONE spring per property, so the
 * letter never stops, snaps, or changes layer mid-flight.
 *
 * Open
 *    0ms   "Open letter" fades
 *    0ms   letter is launched upward out of the pocket; the same spring
 *          turns it and settles it in place while it grows to full length
 *    0ms   the envelope dims to 50%. Its front is drawn twice — above and
 *          below the letter — and crossfades from the upper copy to the lower
 *          one, so the letter ends up in front without ever changing layer
 *          and the envelope only ever gets fainter (no dip, no flicker)
 *
 * Close (the reverse)
 *    0ms   letter shrinks; launched upward again, it turns and sinks home
 *  180ms   the envelope crossfades back (lower front → upper front) to full
 *          strength, closing the pocket over the letter as it sinks in
 *  240ms   "Open letter" fades back in
 * ───────────────────────────────────────────────────────── */

const OPEN_Y = -12; // resting offset once open
// Critically damped (damping = 2·√stiffness): no wobble, and unlike a
// duration-based spring it honours a launch velocity.
const MOVE = { type: "spring", stiffness: 120, damping: 22 } as const;
// Upward launch speed (px/s). Launched against its target, the letter rises,
// turns and settles in one smooth arc — no pause at the top.
const OPEN_LAUNCH = -800;
const CLOSE_LAUNCH = -600;
const ENVELOPE_DIM = 0.5; // envelope opacity while the letter is open
const EASE = [0.22, 1, 0.36, 1] as const;
const DIM = { duration: 0.35, ease: EASE };
const FRONT_IN = { duration: 0.4, delay: 0.18, ease: EASE };
const FADE = { duration: 0.2, ease: [0.22, 1, 0.36, 1] } as const;

// Closed letter height, as fractions of the envelope width (see .envLetter).
const FLAP = 0.25;
const POCKET = 0.5625;
const PEEK = 0.88;

const ACTIONS_SPACE = 76; // px the action row needs below the open letter

/** Front pocket: two side flaps meeting in a V, over a bottom flap. */
function EnvelopeFront({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 56.25"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path className="envFlapBottom" d="M0 56.25 L50 30 L100 56.25 Z" />
      <path className="envFlapSide" d="M0 0 L50 30 L0 56.25 Z" />
      <path
        className="envFlapSide envFlapRight"
        d="M100 0 L50 30 L100 56.25 Z"
      />
      <path
        className="envFlapEdge"
        d="M0 0 L50 30 L100 0 M0 56.25 L50 30 L100 56.25"
      />
    </svg>
  );
}

/** Medify-style envelope: the letter peeks out of the pocket until opened. */
export default function AboutLetterEnvelope() {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [open, setOpen] = useState(false);
  const [emailCopiedAt, setEmailCopiedAt] = useState(0);
  const busy = useRef(false);
  const reduce = useReducedMotion();

  const parts = () => {
    const root = scope.current;
    return {
      root,
      letter: root.querySelector<HTMLElement>(".envLetter")!,
      content: root.querySelector<HTMLElement>(".envLetterContent")!,
      front: root.querySelector<HTMLElement>(".envFront:not(.envFrontUnder)")!,
      frontUnder: root.querySelector<HTMLElement>(".envFrontUnder")!,
      back: root.querySelector<HTMLElement>(".envBack")!,
      openBtn: root.querySelector<HTMLElement>(".envOpen")!,
    };
  };

  // Bring the title to the top only when the open letter (and its actions)
  // wouldn't otherwise fit, so the page doesn't move against the letter.
  const frameTitle = (bottom: number) => {
    const title = document.getElementById("about-letter-title");
    if (!title) return;
    const top = title.getBoundingClientRect().top;
    if (top >= 0 && bottom <= window.innerHeight) return;
    title.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  };

  async function openLetter() {
    if (open || busy.current) return;
    busy.current = true;
    // Off the click's critical path so the first frame isn't delayed.
    setTimeout(() => posthog.capture("about_letter_opened"), 400);
    const { letter, content, front, frontUnder, back, openBtn } = parts();
    // Content plus the letter's own border, so "auto" afterwards matches exactly.
    const full =
      content.offsetHeight + (letter.offsetHeight - letter.clientHeight);
    frameTitle(
      letter.getBoundingClientRect().top + OPEN_Y + full + ACTIONS_SPACE,
    );
    setOpen(true);

    if (reduce) {
      front.style.opacity = "0";
      frontUnder.style.opacity = String(ENVELOPE_DIM);
      back.style.opacity = String(ENVELOPE_DIM);
      letter.style.transform = `translateY(${OPEN_Y}px)`;
      letter.style.height = "auto";
      busy.current = false;
      return;
    }

    void animate(openBtn, { opacity: 0, scale: 0.96 }, FADE);
    // Same timing for all three, so where the two fronts overlap their
    // combined opacity falls steadily from 100% to 50%.
    void animate(back, { opacity: ENVELOPE_DIM }, DIM);
    void animate(front, { opacity: 0 }, DIM);
    void animate(frontUnder, { opacity: ENVELOPE_DIM }, DIM);
    await Promise.all([
      animate(letter, { y: OPEN_Y }, { ...MOVE, velocity: OPEN_LAUNCH }),
      animate(letter, { height: full }, MOVE),
    ]);
    letter.style.height = "auto";
    busy.current = false;
  }

  async function closeLetter() {
    if (!open || busy.current) return;
    busy.current = true;
    const { root, letter, front, frontUnder, back, openBtn } = parts();
    const closed = root.offsetWidth * (FLAP + POCKET * PEEK);
    frameTitle(0);
    setOpen(false);

    if (reduce) {
      front.style.opacity = "";
      frontUnder.style.opacity = "";
      back.style.opacity = "";
      letter.style.transform = "";
      letter.style.height = "";
      busy.current = false;
      return;
    }

    void animate(back, { opacity: 1 }, FRONT_IN);
    void animate(front, { opacity: 1 }, FRONT_IN);
    void animate(frontUnder, { opacity: 0 }, FRONT_IN);
    void animate(openBtn, { opacity: 1, scale: 1 }, { ...FADE, delay: 0.24 });
    await Promise.all([
      animate(letter, { y: 0 }, { ...MOVE, velocity: CLOSE_LAUNCH }),
      animate(letter, { height: [letter.offsetHeight, closed] }, MOVE),
    ]);
    letter.style.height = "";
    busy.current = false;
  }

  return (
    <div ref={scope} className="envStage" data-open={open || undefined}>
      {/* Back of the envelope with its flap folded open above the pocket. */}
      <svg
        className="envBack"
        viewBox="0 0 100 81.25"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path className="envBackFlap" d="M0 25 L50 0 L100 25 Z" />
        <path className="envBackBody" d="M0 25 H100 V81.25 H0 Z" />
      </svg>

      {/* Front pocket, lower copy: what stays visible (dimmed) around the
          open letter. */}
      <EnvelopeFront className="envFront envFrontUnder" />

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

      {/* Front pocket, upper copy: covers the letter while it's tucked in. */}
      <EnvelopeFront className="envFront" />

      <button
        type="button"
        className="envAction envOpen"
        aria-expanded={open}
        onClick={openLetter}
        tabIndex={open ? -1 : 0}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path
            d="M7 2.5v9M2.5 7h9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
        Open letter
      </button>

      {/* Always mounted (hidden while closed) so opening doesn't pay for
          mounting these mid-animation. */}
      <div className="envActions" inert={!open}>
        <button
          type="button"
          className="envAction envClose"
          onClick={closeLetter}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path
              d="M3.5 3.5l7 7M10.5 3.5l-7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          Close letter
        </button>
        <HoverTextPreview text={WORK_FIT_CTA.email} flash={emailCopiedAt}>
          <CopyEmailButton
            email={WORK_FIT_CTA.email}
            label={WORK_FIT_CTA.contactLabel}
            copiedLabel="Email copied"
            className="workFitBtn workFitBtnSolid"
            onCopy={() => setEmailCopiedAt(Date.now())}
          />
        </HoverTextPreview>
      </div>
    </div>
  );
}
