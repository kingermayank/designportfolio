"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

const EASE = [0.23, 1, 0.32, 1] as const;
const EXIT_EASE = [0.7, 0, 0.84, 0] as const;
const WIDTH_EASE = [0.65, 0, 0.35, 1] as const;
const WIDTH_EXPAND = { duration: 0.38, ease: WIDTH_EASE } as const;
const WIDTH_CONTRACT = { duration: 0.34, ease: WIDTH_EASE } as const;
const ICON_CROSSFADE = { duration: 0.1, ease: WIDTH_EASE } as const;
const CONTENT_ENTER = { duration: 0.12, ease: EASE } as const;
const CONTENT_EXIT = { duration: 0.07, ease: EXIT_EASE } as const;
const INSTANT = { duration: 0 } as const;

type CopyStatus = "idle" | "copied" | "error";
type IconState = "email" | "copy" | "copied" | "error";

export type CopyButtonProps = {
  value: string;
  label?: string;
  copiedLabel?: string;
  errorLabel?: string;
  timeout?: number;
  onCopy?: (value: string) => void;
  onError?: (reason: unknown) => void;
  disabled?: boolean;
  /** The leading copy glyph. Off where the button reads as a plain CTA. */
  showIcon?: boolean;
  idleIcon?: "copy" | "email";
  className?: string;
};

export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  errorLabel = "Failed",
  timeout = 2000,
  onCopy,
  onError,
  disabled = false,
  showIcon = true,
  idleIcon = "copy",
  className = "",
}: CopyButtonProps) {
  const { copy, status } = useCopyToClipboard({ timeout, onCopy, onError });
  const reduced = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [widths, setWidths] = useState<Record<CopyStatus, number> | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const measureRefs = useRef<Record<CopyStatus, HTMLSpanElement | null>>({
    idle: null,
    copied: null,
    error: null,
  });

  const showHoverCopy = idleIcon === "email" && isHovered && status === "idle";

  const activeLabel =
    status === "copied" ? copiedLabel : status === "error" ? errorLabel : label;

  const iconState: IconState =
    status === "copied"
      ? "copied"
      : status === "error"
        ? "error"
        : showHoverCopy || idleIcon === "copy"
          ? "copy"
          : "email";

  const contentExit = reduced
    ? INSTANT
    : {
        ...CONTENT_EXIT,
        delay: status === "idle" ? 0 : 0.12,
      };
  const iconEnter =
    reduced ? INSTANT : status === "idle" ? ICON_CROSSFADE : CONTENT_ENTER;
  const iconExit =
    reduced ? INSTANT : status === "idle" ? ICON_CROSSFADE : contentExit;

  const measureWidths = useCallback(() => {
    const button = buttonRef.current;
    const idle = measureRefs.current.idle;
    const copied = measureRefs.current.copied;
    const error = measureRefs.current.error;
    if (!button || !idle || !copied || !error) return;

    const styles = window.getComputedStyle(button);
    const gap = showIcon ? Number.parseFloat(styles.columnGap || styles.gap) || 0 : 0;
    const iconWidth = showIcon ? 14 : 0;
    const fixedWidth =
      (Number.parseFloat(styles.paddingLeft) || 0) +
      (Number.parseFloat(styles.paddingRight) || 0) +
      (Number.parseFloat(styles.borderLeftWidth) || 0) +
      (Number.parseFloat(styles.borderRightWidth) || 0) +
      gap +
      iconWidth;

    const next = {
      idle: Math.ceil(idle.getBoundingClientRect().width + fixedWidth),
      copied: Math.ceil(copied.getBoundingClientRect().width + fixedWidth),
      error: Math.ceil(error.getBoundingClientRect().width + fixedWidth),
    };

    setWidths((current) =>
      current &&
      current.idle === next.idle &&
      current.copied === next.copied &&
      current.error === next.error
        ? current
        : next,
    );
  }, [showIcon]);

  useLayoutEffect(() => {
    measureWidths();

    const observer = new ResizeObserver(measureWidths);
    Object.values(measureRefs.current).forEach((node) => {
      if (node) observer.observe(node);
    });

    void document.fonts?.ready.then(measureWidths);
    return () => observer.disconnect();
  }, [label, copiedLabel, errorLabel, measureWidths]);

  const renderIcon = () => {
    if (iconState === "email") {
      return (
        <>
          <rect x="1.5" y="2.75" width="11" height="8.5" rx="1.5" />
          <path d="m2.25 4 4.12 3.22a1 1 0 0 0 1.26 0L11.75 4" />
        </>
      );
    }

    if (iconState === "copy") {
      return (
        <>
          <path d="M9.6 5.1V3.7A1.7 1.7 0 0 0 7.9 2H3.7A1.7 1.7 0 0 0 2 3.7v4.2a1.7 1.7 0 0 0 1.7 1.7h1.4" />
          <rect x="5.1" y="5.1" width="6.9" height="6.9" rx="1.7" />
        </>
      );
    }

    if (iconState === "copied") {
      return <path d="M2.9 7.4 5.6 10.1 11.1 4" />;
    }

    return (
      <>
        <path d="M3.6 3.6 10.4 10.4" />
        <path d="M10.4 3.6 3.6 10.4" />
      </>
    );
  };

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      disabled={disabled}
      aria-label={label}
      onClick={() => {
        void copy(value);
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={disabled || reduced ? undefined : { y: 1 }}
      initial={false}
      animate={widths ? { width: widths[status] } : undefined}
      transition={{
        width:
          reduced
            ? INSTANT
            : status === "idle"
              ? WIDTH_CONTRACT
              : WIDTH_EXPAND,
      }}
      className={
        "intCopyBtn" +
        (idleIcon === "email" ? " intCopyBtnIconAfter" : "") +
        (className ? ` ${className}` : "")
      }
    >
      {showIcon ? (
        <span className="intCopyIcon" aria-hidden="true">
          <AnimatePresence
            initial={false}
            mode={status === "idle" ? "sync" : "wait"}
          >
            <motion.svg
              key={iconState}
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduced ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 0.96,
                transition: iconExit,
              }}
              transition={iconEnter}
            >
              {renderIcon()}
            </motion.svg>
          </AnimatePresence>
        </span>
      ) : null}

      <span aria-hidden="true" className="intCopyLabel">
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={activeLabel}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: contentExit,
            }}
            transition={reduced ? INSTANT : CONTENT_ENTER}
          >
            {activeLabel}
          </motion.span>
        </AnimatePresence>
      </span>

      <span className="intCopyMeasures" aria-hidden="true">
        <span ref={(node) => { measureRefs.current.idle = node; }}>{label}</span>
        <span ref={(node) => { measureRefs.current.copied = node; }}>{copiedLabel}</span>
        <span ref={(node) => { measureRefs.current.error = node; }}>{errorLabel}</span>
      </span>

      <span role="status" aria-live="polite" className="srOnly">
        {status === "copied" ? copiedLabel : status === "error" ? errorLabel : ""}
      </span>
    </motion.button>
  );
}
