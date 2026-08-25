"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import type { EngComponent } from "@/lib/workLenses";

type Props = {
  item: EngComponent;
  onClose: () => void;
};

function StageMedia({ item }: { item: EngComponent }) {
  if (item.video && item.src) {
    return (
      <video
        className="engModalMedia"
        src={item.src}
        poster={item.thumb}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
      />
    );
  }
  if (item.thumb || item.src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="engModalMedia" src={item.thumb || item.src} alt="" />;
  }
  return <div className="engModalMediaEmpty" style={{ background: item.shade }} />;
}

/** Desktop-width logical viewport; its height follows the visible preview cap. */
const FRAME_W = 1440;
const FRAME_H = 1440;
const OPEN_MS = 260;
const CLOSE_MS = 100;

export default function EngDetailModal({ item, onClose }: Props) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [frameScale, setFrameScale] = useState(1);
  const [frameHeight, setFrameHeight] = useState(FRAME_H);
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const isWebsite = Boolean(item.href);
  const hasEmbed = Boolean(item.embedUrl);
  const embedIsExternal = Boolean(item.embedUrl?.startsWith("http"));
  const visitHref = item.href;
  const visitLabel = item.title.replace(/\.com$/i, "");

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onCloseRef.current();
      return;
    }
    closingRef.current = true;
    setClosing(true);
    window.setTimeout(() => onCloseRef.current(), CLOSE_MS);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [mounted, requestClose]);

  // Width remains authoritative, so the project always reaches both side
  // edges. Its logical height mirrors the capped stage, making the iframe—not
  // the modal—the scroll owner for the project's remaining content.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !hasEmbed) return;
    const measure = () => {
      const { clientWidth: width, clientHeight: height } = el;
      if (!width || !height) return;
      const scale = width / FRAME_W;
      setFrameScale(scale);
      setFrameHeight(height / scale);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [hasEmbed, mounted]);

  const onDialogKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const root = e.currentTarget;
    const focusables = root.querySelectorAll<HTMLElement>(
      'button, [href], iframe, input, textarea, select, [tabindex]:not([tabindex="-1"])',
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
      className={"engModalRoot" + (closing ? " is-closing" : "")}
      role="presentation"
      style={
        {
          "--eng-open-ms": `${OPEN_MS}ms`,
          "--eng-close-ms": `${CLOSE_MS}ms`,
        } as CSSProperties
      }
    >
      <button
        type="button"
        className="engModalScrim"
        aria-label="Close dialog"
        onClick={requestClose}
      />
      <div
        className="engModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={onDialogKeyDown}
      >
        <header className="engModalHead">
          <div className="engModalHeadText">
            <p className="engModalKind">{item.kind}</p>
            <h2 id={titleId} className="engModalTitle">
              {item.title}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="engModalClose"
            onClick={requestClose}
            aria-label="Close"
          >
            <svg viewBox="0 0 20 20" aria-hidden>
              <path
                d="M4.5 4.5 15.5 15.5M15.5 4.5 4.5 15.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="engModalBody">
          <div className="engModalStageWrap">
            {hasEmbed && isWebsite && visitHref ? (
              <div className="engModalSiteChrome">
                <span className="engModalSiteChromeLabel">Live preview</span>
              </div>
            ) : null}

            <div
              ref={stageRef}
              className={
                "engModalStage" +
                (!hasEmbed && isWebsite && visitHref
                  ? " engModalStageLink"
                  : "") +
                (hasEmbed && isWebsite && visitHref
                  ? " engModalStageChromatched"
                  : "")
              }
              style={
                {
                  background: hasEmbed ? "#111111" : item.shade,
                  "--eng-frame-w": `${FRAME_W}px`,
                  "--eng-frame-h": `${frameHeight}px`,
                  "--eng-frame-scale": frameScale,
                } as CSSProperties
              }
            >
              {hasEmbed ? (
                <div className="engModalFrameViewport">
                  <iframe
                    className="engModalFrame"
                    src={item.embedUrl}
                    title={
                      isWebsite
                        ? `${item.title} live site`
                        : `${item.title} playground`
                    }
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    {...(embedIsExternal
                      ? {}
                      : {
                          sandbox:
                            "allow-scripts allow-same-origin allow-forms",
                        })}
                  />
                </div>
              ) : isWebsite && visitHref ? (
                <a
                  className="engModalSiteHit"
                  href={visitHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <StageMedia item={item} />
                  <span className="engModalSiteCue">Open site ↗</span>
                </a>
              ) : (
                <StageMedia item={item} />
              )}

              {item.stack && item.stack.length > 0 ? (
                <ul className="engModalStack" aria-label="Stack">
                  {item.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          <div className="engModalMeta">
            <div className="engModalMetaCopy">
              {item.body ? <p className="engModalLead">{item.body}</p> : null}
            </div>

            {visitHref ? (
              <a
                className="engModalCta"
                href={visitHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${visitLabel} website`}
              >
                View website
                <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M4.5 11.5 11.5 4.5M6.5 4.5h5v5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
