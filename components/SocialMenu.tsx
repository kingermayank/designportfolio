"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ABOUT_INTRO } from "@/lib/about";

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
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div className="socialMenu" ref={rootRef}>
      <button
        type="button"
        className={"socialMenuBtn" + (open ? " on" : "")}
        aria-label={open ? "Close social links" : "Open social links"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="socialMenuGlyph" aria-hidden="true">
          {open ? (
            <svg viewBox="0 0 16 16">
              <path
                d="M3 3l10 10M13 3 3 13"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16">
              <path
                d="M2.5 4.25h11M2.5 8h11M2.5 11.75h11"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </span>
      </button>
      {open ? (
        <nav id={panelId} className="socialMenuPanel" aria-label="Social links">
          {ABOUT_INTRO.links.map((link) => {
            const Icon = ICONS[link.label];
            return (
              <a
                key={link.label}
                className="socialMenuLink"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="socialMenuIcon">
                  {Icon ? <Icon /> : null}
                </span>
                {link.label}
              </a>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}
