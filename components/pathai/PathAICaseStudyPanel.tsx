"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import PathAICaseStudy from "./PathAICaseStudy";

const PANEL_MS = 500;
const subscribeToClient = () => () => {};

export default function PathAICaseStudyPanel({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribeToClient, () => true, () => false);

  const requestClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setOpen(false);
    window.setTimeout(onClose, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : PANEL_MS);
  };

  useEffect(() => {
    if (!mounted) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const frame = requestAnimationFrame(() => {
      setOpen(true);
      closeRef.current?.focus();
    });
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
    // The close latch is intentionally stable for this panel's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusables = event.currentTarget.querySelectorAll<HTMLElement>(
      'button, [href], [tabindex]:not([tabindex="-1"])',
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className={"sysOverlay pathaiCaseOverlay" + (open ? " is-open" : "")}>
      <button className="sysOverlayScrim" type="button" aria-label="Close case study" onClick={requestClose} />
      <div className="sysOverlayStage" role="dialog" aria-modal="true" aria-label="PathAI case study" onKeyDown={trapFocus}>
        <button ref={closeRef} className="sysOverlayClose" type="button" aria-label="Close case study" onClick={requestClose}>
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="sysOverlaySheet">
          <div className="sysOverlayHandle" aria-hidden="true" />
          <div className="pathaiCasePanelContent">
            <PathAICaseStudy />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
