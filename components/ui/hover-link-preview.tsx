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

export function HoverLinkPreview({ href, previewImage, imageAlt = "Link preview", imageWidth = 1200, imageHeight = 630, previewTitle, previewWidth = 208, previewAspectRatio, previewPlacement = "auto", previewShape = "rectangle", children, onClick, onPreviewActivate, ...anchorProps }: HoverLinkPreviewProps) {
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
    const width = Math.min(previewWidth, window.innerWidth - 24);
    // Match the artwork aspect ratio, frame, and optional profile caption.
    const ratio = previewShape === "circle" ? 1 : previewAspectRatio ?? imageWidth / imageHeight;
    const height = (width - 14) / ratio + 14 + (previewTitle ? 32 : 0);
    const left = Math.max(12, Math.min(window.innerWidth - width - 12, x - width / 2));
    const top = Math.max(12, Math.min(window.innerHeight - height - 12, previewPlacement === "top" || y > height + 40 ? y - height - 24 : y + 24));
    if (initial || reduceMotion) {
      springLeft.jump(left);
      springTop.jump(top);
      springRotate.jump(0);
    }
    motionLeft.set(left);
    motionTop.set(top);
  }

  return <>
    <motion.a href={href} target="_blank" rel="noopener noreferrer" {...anchorProps}
      onPointerEnter={(event) => {
        if (!previewImage || event.pointerType !== "mouse") return;
        prevX.current = null;
        motionRotate.set(0);
        position(event.clientX, event.clientY, true);
        setShowPreview(true);
      }}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || !showPreview) return;
        position(event.clientX, event.clientY);
        if (!reduceMotion && prevX.current !== null) motionRotate.set(Math.max(-8, Math.min(8, (event.clientX - prevX.current) * 1.2)));
        prevX.current = event.clientX;
      }}
      onPointerLeave={dismiss}
      onFocus={(event) => {
        if (!previewImage || !event.currentTarget.matches(":focus-visible")) return;
        const rect = event.currentTarget.getBoundingClientRect();
        position(rect.left + rect.width / 2, rect.top, true);
        setShowPreview(true);
      }}
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
        aria-hidden="true"
        ref={previewRef}
        className={`${styles.preview}${previewShape === "circle" ? ` ${styles.circle}` : ""}`}
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.92, y: reduceMotion ? 0 : 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96, y: reduceMotion ? 0 : 4 }}
        transition={{ duration: reduceMotion ? 0 : 0.15 }}
        style={{ width: previewWidth, top: springTop, left: springLeft, rotate: reduceMotion ? 0 : springRotate }}
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
