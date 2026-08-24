"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { crimsonPro } from "@/app/fonts";
import { HIRING_LETTER } from "@/lib/letter";

type Props = {
  onClose: () => void;
  /** Rect of the card that opened it, so the letter flies out of that card. */
  origin?: DOMRect | null;
};

const OPEN_MS = 620;
const CLOSE_MS = 260;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const CLOSE_EASE = "cubic-bezier(0.7, 0, 0.84, 0)";
/** Resting tilt; the hover tilt lives in CSS so :hover can take over. */
const REST_TILT = "rotate(-2deg)";

export default function HiringLetterOverlay({ onClose, origin }: Props) {
  const titleId = useId();
  const noteRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setMounted(true);
  }, []);

  // Runs before paint, so the letter is already sitting on the card when the
  // first frame lands — no flash of it at full size.
  useLayoutEffect(() => {
    const note = noteRef.current;
    if (!mounted || !note) return;
    if (reduced || !origin) {
      note.style.opacity = "1";
      return;
    }

    // Measure unrotated, otherwise the resting tilt skews the box.
    note.style.transition = "none";
    note.style.transform = "none";
    const box = note.getBoundingClientRect();
    const scale = Math.max(origin.width / box.width, 0.1);
    const dx = origin.left + origin.width / 2 - (box.left + box.width / 2);
    const dy = origin.top + origin.height / 2 - (box.top + box.height / 2);

    note.style.transformOrigin = "center center";
    note.style.transform = `translate(${dx}px, ${dy}px) scale(${scale}) rotate(-8deg)`;
    note.style.opacity = "0";
    void note.offsetWidth; // flush the start state

    note.style.transition = `transform ${OPEN_MS}ms ${EASE}, opacity 260ms linear`;
    note.style.transform = REST_TILT;
    note.style.opacity = "1";

    // Hand control back to CSS so :hover can drive the tilt.
    const settle = () => {
      note.style.transition = "";
      note.style.transform = "";
      note.style.transformOrigin = "";
      note.style.opacity = "";
    };
    note.addEventListener("transitionend", settle, { once: true });
    return () => note.removeEventListener("transitionend", settle);
  }, [mounted, origin, reduced]);

  const requestClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    const note = noteRef.current;
    const scrim = scrimRef.current;

    if (reduced || !origin || !note) {
      onClose();
      return;
    }

    // Reverse the flight: back down into the card it came from.
    note.style.transition = "none";
    note.style.transform = REST_TILT;
    const box = note.getBoundingClientRect();
    note.style.transform = "none";
    const flat = note.getBoundingClientRect();
    const scale = Math.max(origin.width / flat.width, 0.1);
    const dx = origin.left + origin.width / 2 - (flat.left + flat.width / 2);
    const dy = origin.top + origin.height / 2 - (flat.top + flat.height / 2);
    note.style.transform = REST_TILT;
    void box.width;

    note.style.transition = `transform ${CLOSE_MS}ms ${CLOSE_EASE}, opacity ${CLOSE_MS}ms linear`;
    note.style.transform = `translate(${dx}px, ${dy}px) scale(${scale}) rotate(-8deg)`;
    note.style.opacity = "0";
    if (scrim) scrim.style.opacity = "0";
    window.setTimeout(onClose, CLOSE_MS);
  };

  useEffect(() => {
    if (!mounted) return;
    const prev = document.activeElement as HTMLElement | null;
    noteRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
      }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prev?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close latch is intentional
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={scrimRef}
      className={"letterScrim" + (reduced ? " is-static" : "")}
      role="presentation"
      onClick={requestClose}
    >
      <div
        ref={noteRef}
        className={`letterNote ${crimsonPro.className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="letterPaperclip" aria-hidden />
        <div className="letterContent">
          <p id={titleId} className="letterGreeting">
            {HIRING_LETTER.greeting}
          </p>
          <div className="letterBody">
            {HIRING_LETTER.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <p className="letterSignoff">
            {HIRING_LETTER.signoff}
            <br />
            {HIRING_LETTER.signature}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
