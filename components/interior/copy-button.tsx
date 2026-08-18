"use client";

import { motion, useReducedMotion } from "motion/react";
import { useCopyToClipboard, type CopyStatus } from "@/hooks/useCopyToClipboard";

const EASE = [0.23, 1, 0.32, 1] as const;
const CELL = { type: "spring", stiffness: 520, damping: 34, mass: 0.45 } as const;
const CROSSFADE = { type: "spring", stiffness: 260, damping: 34, mass: 0.8 } as const;
const DRAW = { duration: 0.26, ease: EASE } as const;
const INSTANT = { duration: 0 } as const;

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
  className = "",
}: CopyButtonProps) {
  const { copy, status } = useCopyToClipboard({ timeout, onCopy, onError });
  const reduced = useReducedMotion();

  const fade = reduced ? INSTANT : CROSSFADE;
  const draw = reduced ? INSTANT : DRAW;

  const labels: Array<[CopyStatus, string]> = [
    ["idle", label],
    ["copied", copiedLabel],
    ["error", errorLabel],
  ];

  return (
    <motion.button
      type="button"
      disabled={disabled}
      aria-label={label}
      onClick={() => {
        void copy(value);
      }}
      whileTap={disabled || reduced ? undefined : { y: 1 }}
      transition={CELL}
      className={"intCopyBtn" + (className ? ` ${className}` : "")}
    >
      {showIcon ? (
        <span className="intCopyIcon" aria-hidden="true">
          <motion.svg
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{
              opacity: status === "idle" ? 1 : 0,
              scale: status === "idle" ? 1 : 0.92,
            }}
            transition={fade}
          >
            <path d="M9.6 5.1V3.7A1.7 1.7 0 0 0 7.9 2H3.7A1.7 1.7 0 0 0 2 3.7v4.2a1.7 1.7 0 0 0 1.7 1.7h1.4" />
            <rect x="5.1" y="5.1" width="6.9" height="6.9" rx="1.7" />
          </motion.svg>
  
          <motion.svg
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{
              opacity: status === "copied" ? 1 : 0,
              scale: status === "copied" ? 1 : 0.92,
            }}
            transition={fade}
          >
            <motion.path
              d="M2.9 7.4 5.6 10.1 11.1 4"
              initial={false}
              animate={{ pathLength: status === "copied" ? 1 : 0 }}
              transition={draw}
            />
          </motion.svg>
  
          <motion.svg
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{
              opacity: status === "error" ? 1 : 0,
              scale: status === "error" ? 1 : 0.92,
            }}
            transition={fade}
          >
            <path d="M3.6 3.6 10.4 10.4" />
            <path d="M10.4 3.6 3.6 10.4" />
          </motion.svg>
        </span>
      ) : null}

      <span aria-hidden="true" className="intCopyLabel">
        {labels.map(([key, text]) => (
          <motion.span
            key={key}
            initial={false}
            animate={
              key === status
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 3, filter: "blur(3px)" }
            }
            transition={fade}
          >
            {text}
          </motion.span>
        ))}
      </span>

      <span role="status" aria-live="polite" className="srOnly">
        {status === "copied" ? copiedLabel : status === "error" ? errorLabel : ""}
      </span>
    </motion.button>
  );
}
