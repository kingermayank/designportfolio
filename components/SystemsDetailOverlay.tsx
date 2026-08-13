"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { CASE_STUDIES, type CaseMedia } from "@/lib/caseStudies";
import type { WorkListItem } from "@/lib/workLenses";

type Props = {
  item: WorkListItem;
  onClose: () => void;
};

// Koto's panel travel: 500ms on cubic-bezier(0.15, 0, 0.30, 1) — a long, flat
// tail that decelerates far more gently than a standard ease-out.
const OPEN_MS = 500;
const EASE = "cubic-bezier(0.15, 0, 0.3, 1)";

function firstFullMedia(slug?: string): CaseMedia | undefined {
  if (!slug) return undefined;
  const study = CASE_STUDIES.find((s) => s.slug === slug);
  const block = study?.mediaBlocks?.find((b) => b.type === "full");
  return block && block.type === "full" ? block.media : study?.hero;
}

export default function SystemsDetailOverlay({ item, onClose }: Props) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const closingRef = useRef(false);

  const study = item.slug
    ? CASE_STUDIES.find((s) => s.slug === item.slug)
    : undefined;
  const headline = study?.detailTitle ?? item.title;
  const lede = study?.description ?? item.body;
  const year = study?.year;
  const shortTitle = study?.title ?? item.title;
  const ctaHref = study?.websiteUrl;
  const highlights = study?.highlights ?? [];
  const credits = study?.credits ?? [];
  const figure = firstFullMedia(item.slug);
  const figureSrc = figure?.src ?? item.thumb;
  const figureShade = figure?.shade ?? item.shade;
  const figureAr = figure?.ar ?? 16 / 9;
  const figureCaption = figure?.caption;

  const requestClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setOpen(false);
    window.setTimeout(() => onClose(), OPEN_MS);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.activeElement as HTMLElement | null;
    const id = window.requestAnimationFrame(() => {
      setOpen(true);
      closeRef.current?.focus();
    });

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
      window.cancelAnimationFrame(id);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prev?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close latch is intentional
  }, [mounted]);

  const onDialogKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const root = e.currentTarget;
    const focusables = root.querySelectorAll<HTMLElement>(
      'button, [href], [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className={"sysOverlay" + (open ? " is-open" : "")}
      role="presentation"
      style={
        {
          ["--sys-ease"]: EASE,
          ["--sys-dur"]: `${OPEN_MS}ms`,
        } as CSSProperties
      }
    >
      <button
        type="button"
        className="sysOverlayScrim"
        aria-label="Close"
        onClick={requestClose}
      />

      <div
        className="sysOverlayStage"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={onDialogKeyDown}
      >
        <button
          ref={closeRef}
          type="button"
          className="sysOverlayClose"
          onClick={requestClose}
          aria-label="Close"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path
              d="M1.5 1.5l9 9M10.5 1.5l-9 9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="sysOverlaySheet">
          <div className="sysOverlayHandle" aria-hidden />
          <header className="sysOverlayHead">
            <div className="sysOverlayIdentity">
              <div
                className="sysOverlayMark"
                style={{ background: item.shade }}
              >
                {item.thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.thumb} alt="" />
                ) : null}
              </div>
              <div className="sysOverlayIdentityText">
                <div className="sysOverlayShortTitle">{shortTitle}</div>
                {year ? <div className="sysOverlayDate">{year}</div> : null}
              </div>
            </div>

            {ctaHref ? (
              <a
                className="sysOverlayCta"
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sysOverlayCtaLabel">Open board</span>
                <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
                  <path
                    d="M3 9 9 3M4.5 3H9v4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            ) : null}
          </header>

          <div className="sysOverlayBody">
            <h2 id={titleId} className="sysOverlayHeadline">
              {headline}
            </h2>
            {lede ? <p className="sysOverlayLede">{lede}</p> : null}

            {figureSrc ? (
              <figure
                className={
                  "sysOverlayFigure" +
                  (figure?.fit === "contain" ? " is-contain" : "")
                }
              >
                {/* The shade and the rounded crop belong to the media box only —
                    the caption sits below it, on the sheet. */}
                <div
                  className="sysOverlayFigureMedia"
                  style={{ background: figureShade }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={figureSrc}
                    alt=""
                    style={{ aspectRatio: String(figureAr) }}
                  />
                </div>
                {figureCaption ? (
                  <figcaption className="sysOverlayCaption">
                    {figureCaption}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}

            {credits.length > 0 ? (
              <dl className="sysOverlayCredits">
                {credits.map((c) => (
                  <div key={c.label} className="sysOverlayCredit">
                    <dt>{c.label}</dt>
                    <dd>{c.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {highlights.length > 0 ? (
              <div className="sysOverlayHighlights">
                {highlights.map((h) => (
                  <section key={h.label} className="sysOverlaySection">
                    <h3 className="sysOverlaySectionLabel">{h.label}</h3>
                    <p className="sysOverlaySectionBody">{h.body}</p>
                  </section>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
