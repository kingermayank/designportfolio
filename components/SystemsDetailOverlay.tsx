"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { CASE_STUDIES, type CaseMedia } from "@/lib/caseStudies";
import { boldRuns } from "@/lib/richText";
import type { WorkListItem } from "@/lib/workLenses";

type Props = {
  item: WorkListItem;
  onClose: () => void;
};

// Koto's panel travel: 500ms on cubic-bezier(0.15, 0, 0.30, 1) — a long, flat
// tail that decelerates far more gently than a standard ease-out.
const OPEN_MS = 500;
const EASE = "cubic-bezier(0.15, 0, 0.3, 1)";
const subscribeToClient = () => () => {};

function galleryMedia(slug?: string): CaseMedia[] {
  if (!slug) return [];
  const study = CASE_STUDIES.find((s) => s.slug === slug);
  const blocks = study?.mediaBlocks ?? [];
  const shots = blocks.flatMap((b) => (b.type === "full" ? [b.media] : []));
  if (shots.length > 0) return shots;
  return study?.hero ? [study.hero] : [];
}

function ImpactLine({ impact }: { impact: string }) {
  return (
    <>
      <span className="sysOverlayImpactIcon" aria-hidden>
        <svg viewBox="0 0 16 16">
          <path
            d="M3 11.5 6.5 8l2.5 2.5L13 5.5M13 5.5H9.5M13 5.5V9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="sysOverlayImpactText">
        {boldRuns(impact).map((run, i) =>
          run.bold ? (
            <strong key={i}>{run.text}</strong>
          ) : (
            <span key={i}>{run.text}</span>
          ),
        )}
      </span>
    </>
  );
}

export default function SystemsDetailOverlay({ item, onClose }: Props) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const mounted = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );
  const [open, setOpen] = useState(false);
  const [shotIdx, setShotIdx] = useState(0);
  const [shotDir, setShotDir] = useState(1);
  const closingRef = useRef(false);
  const swipeRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    time: number;
  } | null>(null);

  const study = item.slug
    ? CASE_STUDIES.find((s) => s.slug === item.slug)
    : undefined;
  // Same headline the card shows — the study's own detailTitle is worded for
  // the full case-study page and would read as a different project here.
  const headline = item.title;
  const highlights = study?.highlights ?? [];
  const impact = study?.impact;
  const tags = item.badges ?? [];
  const shots = item.gallery ?? galleryMedia(item.slug);
  const figure = shots[shotIdx] ?? shots[0];
  // Curated galleries take precedence; other projects retain their card art.
  const figureSrc = item.gallery?.length ? figure?.src : item.thumb ?? figure?.src;
  const figureShade = item.shade;
  const figureAr = 16 / 9;
  const figureCaption = figure?.caption;
  const hasGallery = shots.length > 1;
  const stepShot = (dir: number) => {
    setShotDir(dir);
    setShotIdx((i) => (i + dir + shots.length) % shots.length);
  };

  const onGalleryPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!hasGallery || e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button")) return;
    swipeRef.current = {
      pointerId: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onGalleryPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start || start.pointerId !== e.pointerId) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const elapsed = Math.max(performance.now() - start.time, 1);
    const fastSwipe = Math.abs(dx) / elapsed > 0.45;
    const horizontal = Math.abs(dx) > Math.abs(dy) * 1.15;
    if (horizontal && (Math.abs(dx) >= 44 || (Math.abs(dx) >= 24 && fastSwipe))) {
      stepShot(dx < 0 ? 1 : -1);
    }
  };

  const requestClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setOpen(false);
    window.setTimeout(() => onClose(), OPEN_MS);
  };

  useEffect(() => {
    item.gallery?.slice(1).forEach(({ src }) => {
      const image = new window.Image();
      image.src = src;
    });
  }, [item.gallery]);

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
          <div className="sysOverlayBody">
            <h2 id={titleId} className="sysOverlayHeadline">
              {headline}
            </h2>

            {tags.length > 0 ? (
              <ul className="sysOverlayTags">
                {tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            ) : null}

            {figureSrc ? (
              <figure
                className={
                  "sysOverlayFigure" +
                  (impact ? " has-impact" : "")
                }
              >
                <div
                  className="sysOverlayFigureMedia"
                  style={{
                    aspectRatio: String(figureAr),
                    background: figureShade,
                  }}
                  role={hasGallery ? "group" : undefined}
                  aria-roledescription={hasGallery ? "carousel" : undefined}
                  aria-label={hasGallery ? `${headline} image gallery` : undefined}
                  tabIndex={hasGallery ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowLeft") {
                      e.preventDefault();
                      stepShot(-1);
                    } else if (e.key === "ArrowRight") {
                      e.preventDefault();
                      stepShot(1);
                    }
                  }}
                  onPointerDown={onGalleryPointerDown}
                  onPointerUp={onGalleryPointerUp}
                  onPointerCancel={() => {
                    swipeRef.current = null;
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={figureSrc}
                    className={shotDir > 0 ? "from-next" : "from-prev"}
                    src={figureSrc}
                    alt={figureCaption ?? ""}
                    draggable={false}
                    decoding="async"
                  />

                  {hasGallery ? (
                    <span className="srOnly" aria-live="polite">
                      Image {shotIdx + 1} of {shots.length}
                    </span>
                  ) : null}

                  {hasGallery ? (
                    <>
                      <button
                        type="button"
                        className="sysOverlayFigureNav is-prev"
                        onClick={() => stepShot(-1)}
                        aria-label="Previous image"
                      >
                        <svg viewBox="0 0 16 16" aria-hidden>
                          <path
                            d="M10 2.5 4.5 8l5.5 5.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="sysOverlayFigureNav is-next"
                        onClick={() => stepShot(1)}
                        aria-label="Next image"
                      >
                        <svg viewBox="0 0 16 16" aria-hidden>
                          <path
                            d="M6 2.5 11.5 8 6 13.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </>
                  ) : null}
                </div>
                {impact ? (
                  <figcaption className="sysOverlayImpact">
                    <ImpactLine impact={impact} />
                  </figcaption>
                ) : null}
              </figure>
            ) : impact ? (
              <p className="sysOverlayImpact">
                <ImpactLine impact={impact} />
              </p>
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
