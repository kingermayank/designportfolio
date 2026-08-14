"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HIRING_LETTER } from "@/lib/letter";
import CopyEmailButton from "@/components/CopyEmailButton";

type Props = {
  onClose: () => void;
};

export default function HiringLetterOverlay({ onClose }: Props) {
  const titleId = useId();
  const noteRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.activeElement as HTMLElement | null;
    noteRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
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
  }, [mounted, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="letterScrim" role="presentation" onClick={onClose}>
      <div
        ref={noteRef}
        className="letterNote"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
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
        <CopyEmailButton
          email={HIRING_LETTER.email}
          label={HIRING_LETTER.cta}
          copiedLabel="Email copied"
          className="workFitBtn letterCopyBtn"
        />
        <p className="letterHint">{HIRING_LETTER.dismissHint}</p>
      </div>
    </div>,
    document.body,
  );
}
