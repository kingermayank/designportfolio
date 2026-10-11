"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, type HTMLMotionProps } from "framer-motion";
import styles from "./hover-link-preview.module.css";

interface HoverLinkPreviewProps extends Omit<HTMLMotionProps<"a">, "children" | "href"> {
  href: string;
  previewImage?: string;
  imageWidth?: number;
  imageHeight?: number;
  previewTitle?: string;
  previewWidth?: number;
  previewAspectRatio?: number;
  previewPlacement?: "auto" | "top";
  previewShape?: "rectangle" | "circle";
  imageAlt?: string;
  onPreviewActivate?: (event: React.MouseEvent<HTMLAnchorElement>, preview: HTMLDivElement | null) => void;
  children: React.ReactNode;
}

type Placement = "auto" | "top";

/** Cursor-following card shared by link (image) and text previews: springs
 * after the pointer, tilts with horizontal movement, prefers sitting above. */
function useCursorPreview(size: () => { width: number; height: number }, placement: Placement) {
  const [showPreview, setShowPreview] = React.useState(false);
  const previewRef = React.useRef<HTMLDivElement>(null);
  const prevX = React.useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const motionTop = useMotionValue(0);
  const motionLeft = useMotionValue(0);
  const motionRotate = useMotionValue(0);
  const springTop = useSpring(motionTop, { stiffness: 300, damping: 30 });
  const springLeft = useSpring(motionLeft, { stiffness: 300, damping: 30 });
  const springRotate = useSpring(motionRotate, { stiffness: 300, damping: 20 });

  function dismiss() {
    setShowPreview(false);
    prevX.current = null;
    motionRotate.set(0);
  }

  // The portal escapes the case study's transformed and clipped containers.
  React.useEffect(() => {
    if (!showPreview) return;
    const hide = () => setShowPreview(false);
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") hide(); };
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
      window.removeEventListener("keydown", onKey);
    };
  }, [showPreview]);

  function position(x: number, y: number, initial = false) {
    const { width, height } = size();
    const left = Math.max(12, Math.min(window.innerWidth - width - 12, x - width / 2));
    const top = Math.max(12, Math.min(window.innerHeight - height - 12, placement === "top" || y > height + 40 ? y - height - 24 : y + 24));
    if (initial || reduceMotion) {
      springLeft.jump(left);
      springTop.jump(top);
      springRotate.jump(0);
    }
    motionLeft.set(left);
    motionTop.set(top);
  }

  function enter(event: React.PointerEvent) {
    if (event.pointerType !== "mouse") return;
    prevX.current = null;
    motionRotate.set(0);
    position(event.clientX, event.clientY, true);
    setShowPreview(true);
  }

  function move(event: React.PointerEvent) {
    if (event.pointerType !== "mouse" || !showPreview) return;
    position(event.clientX, event.clientY);
    if (!reduceMotion && prevX.current !== null) motionRotate.set(Math.max(-8, Math.min(8, (event.clientX - prevX.current) * 1.2)));
    prevX.current = event.clientX;
  }

  function focus(element: HTMLElement) {
    if (!element.matches(":focus-visible")) return;
    const rect = element.getBoundingClientRect();
    position(rect.left + rect.width / 2, rect.top, true);
    setShowPreview(true);
  }

  const card = {
    "aria-hidden": true as const,
    ref: previewRef,
    initial: { opacity: 0, scale: reduceMotion ? 1 : 0.92, y: reduceMotion ? 0 : 6 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: reduceMotion ? 1 : 0.96, y: reduceMotion ? 0 : 4 },
    transition: { duration: reduceMotion ? 0 : 0.15 },
    style: { top: springTop, left: springLeft, rotate: reduceMotion ? 0 : springRotate },
  };

  return { showPreview, previewRef, dismiss, enter, move, focus, card };
}

export function HoverLinkPreview({ href, previewImage, imageAlt = "Link preview", imageWidth = 1200, imageHeight = 630, previewTitle, previewWidth = 208, previewAspectRatio, previewPlacement = "auto", previewShape = "rectangle", children, onClick, onPreviewActivate, ...anchorProps }: HoverLinkPreviewProps) {
  const { showPreview, previewRef, dismiss, enter, move, focus, card } = useCursorPreview(() => {
    const width = Math.min(previewWidth, window.innerWidth - 24);
    // Match the artwork aspect ratio, frame, and optional profile caption.
    const ratio = previewShape === "circle" ? 1 : previewAspectRatio ?? imageWidth / imageHeight;
    return { width, height: (width - 14) / ratio + 14 + (previewTitle ? 32 : 0) };
  }, previewPlacement);

  return <>
    <motion.a href={href} target="_blank" rel="noopener noreferrer" {...anchorProps}
      // Corner-smoothing extensions rewrite this element's inline style before
      // React hydrates (see lib/ignoreExtensionHydrationNoise.ts). Shallow:
      // only this element's own attributes.
      suppressHydrationWarning
      onPointerEnter={(event) => { if (previewImage) enter(event); }}
      onPointerMove={move}
      onPointerLeave={dismiss}
      onFocus={(event) => { if (previewImage) focus(event.currentTarget); }}
      onBlur={dismiss}
      onClick={(event) => {
        onPreviewActivate?.(event, showPreview ? previewRef.current : null);
        if (onPreviewActivate && event.defaultPrevented && previewRef.current) previewRef.current.style.visibility = "hidden";
        dismiss();
        onClick?.(event);
      }}
    >{children}</motion.a>
    {typeof document !== "undefined" && createPortal(
      <AnimatePresence>{showPreview && previewImage && <motion.div
        {...card}
        className={`${styles.preview}${previewShape === "circle" ? ` ${styles.circle}` : ""}`}
        style={{ ...card.style, width: previewWidth }}
      >
        {/* Remote editorial artwork; a plain image avoids adding a global image host policy. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewImage} alt={imageAlt} width={imageWidth} height={imageHeight} draggable={false}
          style={previewAspectRatio ? { aspectRatio: previewAspectRatio, objectFit: "contain", objectPosition: "center" } : undefined} />
        {previewTitle && <div className={styles.caption}>{previewTitle}</div>}
      </motion.div>}</AnimatePresence>, document.body
    )}
  </>;
}

let measureCanvas: HTMLCanvasElement | null = null;


/** Hover card that shows a line of text (e.g. an email address) in the same
 * floating frame as the link previews. Wraps any interactive child. */
export function HoverTextPreview({ text, placement = "top", flash = 0, children }: {
  text: string; placement?: Placement;
  /** Change (e.g. a copy timestamp) to play the copied-confirmation effect
   * across the text, confirming that exactly this text was copied. 0 = never. */
  flash?: number;
  children: React.ReactNode;
}) {
  const { showPreview, dismiss, enter, move, focus, card } = useCursorPreview(() => {
    // Size the card from the text itself so it centers on the cursor from
    // the very first frame (.textPreview: 12px/6px padding, 1px border).
    measureCanvas ??= document.createElement("canvas");
    const context = measureCanvas.getContext("2d");
    const font = getComputedStyle(document.body).fontFamily;
    if (context) context.font = `500 14px ${font}`;
    const textWidth = context ? context.measureText(text).width : text.length * 8;
    return { width: Math.ceil(textWidth) + 2 * (12 + 1), height: 20 + 2 * (6 + 1) };
  }, placement);

  // The card is created fresh on every hover. Copies made before it opened
  // are already acknowledged, so only a copy *while it is open* plays the
  // effect — hovering never replays it.
  const [seenFlash, setSeenFlash] = React.useState(flash);
  const copiedNow = flash !== 0 && flash !== seenFlash;

  return <>
    <span className={styles.textTrigger}
      onPointerEnter={(event) => {
        setSeenFlash(flash);
        enter(event);
      }}
      onPointerMove={move}
      onPointerLeave={dismiss}
      onFocus={(event) => {
        setSeenFlash(flash);
        focus(event.target as HTMLElement);
      }}
      onBlur={dismiss}
    >{children}</span>
    {typeof document !== "undefined" && createPortal(
      <AnimatePresence>{showPreview && <motion.div {...card} className={`${styles.preview} ${styles.textPreview}`}>
        {/* Keyed per copy so the effect replays every time. Per-character
            spans let the colour travel left to right; the whole string stays
            one accessible label. */}
        <span
          key={flash}
          className={styles.textValue}
          data-copied={copiedNow ? "" : undefined}
          aria-label={text}
        >
          {Array.from(text).map((char, i) => (
            <span key={i} className={styles.char} style={{ "--i": i } as React.CSSProperties} aria-hidden="true">
              {char}
            </span>
          ))}
        </span>
      </motion.div>}</AnimatePresence>, document.body
    )}
  </>;
}
