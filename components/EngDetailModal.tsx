"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
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

export default function EngDetailModal({ item, onClose }: Props) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const isWebsite = Boolean(item.href);
  const hasEmbed = Boolean(item.embedUrl);
  const embedIsExternal = Boolean(item.embedUrl?.startsWith("http"));
  const visitHref = item.href;
  const visitLabel = item.title.replace(/\.com$/i, "");

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
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [onClose, mounted]);

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
    <div className="engModalRoot" role="presentation">
      <button
        type="button"
        className="engModalScrim"
        aria-label="Close dialog"
        onClick={onClose}
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
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <div className="engModalBody">
          <div className="engModalStageWrap">
            {hasEmbed && isWebsite && visitHref ? (
              <div className="engModalSiteChrome">
                <span className="engModalSiteChromeLabel">Live preview</span>
                <a
                  className="engModalSiteChromeLink"
                  href={visitHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open site ↗
                </a>
              </div>
            ) : null}

            <div
              className={
                "engModalStage" +
                (item.embedTall ? " engModalStageTall" : "") +
                (!hasEmbed && isWebsite && visitHref
                  ? " engModalStageLink"
                  : "") +
                (hasEmbed && isWebsite && visitHref
                  ? " engModalStageChromatched"
                  : "")
              }
              style={{ background: hasEmbed ? "#111111" : item.shade }}
            >
              {hasEmbed ? (
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
            </div>
          </div>

          <div className="engModalMeta">
            <div className="engModalMetaCopy">
              {item.body ? <p className="engModalLead">{item.body}</p> : null}

              {item.stack && item.stack.length > 0 ? (
                <section className="engModalSection">
                  <h3 className="engModalLabel">Stack</h3>
                  <ul className="engModalStack">
                    {item.stack.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>

            {visitHref ? (
              <a
                className="engModalCta"
                href={visitHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit {visitLabel}
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
