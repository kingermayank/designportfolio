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
import DeferredVideo from "@/components/DeferredVideo";
import type { EngComponent } from "@/lib/workLenses";

type Props = {
  item: EngComponent;
  onClose: () => void;
};

function MediaCaption({ text }: { text: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const caption = ref.current;
    if (!caption) return;
    const measure = () => caption.parentElement?.style.setProperty(
      "--eng-caption-height", `${Math.max(24, caption.offsetHeight)}px`,
    );
    const observer = new ResizeObserver(measure);
    observer.observe(caption);
    measure();
    return () => observer.disconnect();
  }, [text]);

  return <figcaption ref={ref} className="engMediaCaption">{text}</figcaption>;
}

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
const OPEN_MS = 500;
const CLOSE_MS = 500;

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
  const [open, setOpen] = useState(false);
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
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setOpen(true));
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [mounted]);

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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
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
      className={"sysOverlay engDetailOverlay" + (open && !closing ? " is-open" : "")}
      role="presentation"
      style={
        {
          "--sys-dur": `${OPEN_MS}ms`,
          "--sys-ease": "cubic-bezier(0.15, 0, 0.3, 1)",
        } as CSSProperties
      }
    >
      <button
        type="button"
        className="sysOverlayScrim"
        aria-label="Close dialog"
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
            className="sysOverlayClose engDetailClose"
            onClick={requestClose}
            aria-label="Close"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        <div className="sysOverlaySheet engModal engDetailSheet">
        <header className="engModalHead">
          <div className="engModalHeadText">
            <p className="engModalKind">{item.kind}</p>
            <div className="engModalTitleRow">
              <h2 id={titleId} className="engModalTitle">
                {item.title}
              </h2>
              <div className="engModalActions">
              {item.explorationsHref ? (
                <a className="engModalCta engModalCtaSecondary" href={item.explorationsHref} target="_blank" rel="noopener noreferrer">
                  {item.explorationsLabel || "View explorations"}
                </a>
              ) : null}
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
                    <path d="M4.5 11.5 11.5 4.5M6.5 4.5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ) : null}
              </div>
            </div>
            {item.tools && item.tools.length > 0 ? (
              <ul className="sysOverlayTags engModalStack" aria-label="Tools used">
                {item.tools.map((tool) => (
                  <li key={tool.name}>
                    <a href={tool.href} target="_blank" rel="noopener noreferrer" aria-label={`${tool.name} website (opens in a new tab)`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="engModalToolIcon" src={tool.logo} alt="" width="16" height="16" />
                    {tool.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
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

            </div>
          </div>

          <div className="engModalMeta">
            <div className="engModalMetaCopy">
              {item.body ? <p className="engModalLead">{item.body}</p> : null}
            </div>

          </div>
          {item.content?.map((block) => (
            <section className={"engModalContentSection" + (block.monoTitle || block.id === "paper-board" ? " engModalProcessSection" : "") + (block.plainMedia ? " engModalMediaSection" : "")} key={block.id}>
              {block.title ? (
                <div className="engModalContentHead">
                  <h3 className={block.monoTitle || block.id === "paper-board" ? "sysOverlaySectionLabel" : "engModalContentTitle"}>{block.title}</h3>
                  {block.type === "embed" && block.href ? (
                    <a className="engModalContentLink" href={block.href} target="_blank" rel="noopener noreferrer">
                      {block.linkLabel || "Open preview ↗"}
                    </a>
                  ) : null}
                </div>
              ) : null}
              {block.type === "embed" && block.body ? (
                <p className="sysOverlaySectionBody">{block.body}</p>
              ) : null}
              {block.type === "text" ? (
                <p className={block.monoTitle ? "sysOverlaySectionBody" : "engModalContentText"}>{block.body}</p>
              ) : block.type === "video" ? (
                <figure className={"engModalContentFigure" + (block.plainMedia && block.caption ? " engMediaHover" : "")}>
                  <div className="engMediaCrop">
                  {block.plainMedia ? (
                    <DeferredVideo className="engModalContentVideo" src={block.src} poster={block.poster} activation="eager" floatingControls />
                  ) : (
                    <video className="engModalContentVideo" src={block.src} poster={block.poster} controls playsInline preload="metadata" />
                  )}
                  </div>
                  {block.caption ? (block.plainMedia ? <MediaCaption text={block.caption} /> : <figcaption className="engModalNote">{block.caption}</figcaption>) : null}
                </figure>
              ) : (
                block.type === "image" ? (
                  <figure className={"engModalContentFigure" + (block.plainMedia && block.caption ? " engMediaHover" : "")} tabIndex={block.caption ? 0 : undefined}>
                    <div className="engMediaCrop">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="engModalContentImage" src={block.src} alt={block.alt} loading="lazy" />
                    </div>
                    {block.caption ? <MediaCaption text={block.caption} /> : null}
                  </figure>
                ) : (
                  <iframe className="engModalContentFrame" src={block.src} title={`${item.title} — ${block.title}`} width="100%" height="600" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
                )
              )}
              {block.type === "embed" && block.id === "paper-board" ? (
                <a className="engModalMobileBoardLink" href={block.src} target="_blank" rel="noopener noreferrer">
                  Open board in Paper ↗
                </a>
              ) : null}
            </section>
          ))}
        </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
