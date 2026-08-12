"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

type CopyEmailButtonProps = {
  email: string;
  label?: string;
  copiedLabel?: string;
  errorLabel?: string;
  className?: string;
};

function CopyIcon() {
  return (
    <svg
      className="workFitBtnIcon"
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden
    >
      <rect
        x="5.5"
        y="5.5"
        width="8"
        height="8"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10.5 5.5V4A1.5 1.5 0 0 0 9 2.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="workFitBtnIcon"
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden
    >
      <path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CopyEmailButton({
  email,
  label = "Copy Email",
  copiedLabel = "Copied",
  errorLabel = "Failed",
  className = "workFitBtn workFitBtnGhost",
}: CopyEmailButtonProps) {
  const { copy, status } = useCopyToClipboard();
  const reduced = useReducedMotion();

  const text =
    status === "copied" ? copiedLabel : status === "error" ? errorLabel : label;

  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      onClick={() => {
        void copy(email);
      }}
    >
      <span className="workFitBtnLabel" aria-hidden="true">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={status}
            initial={reduced ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: reduced ? 0 : 0.18, ease: [0.23, 1, 0.32, 1] }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="workFitBtnIconSlot" aria-hidden="true">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={status === "copied" ? "check" : "copy"}
            initial={reduced ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.85 }}
            transition={{ duration: reduced ? 0 : 0.16, ease: [0.23, 1, 0.32, 1] }}
            style={{ display: "inline-flex" }}
          >
            {status === "copied" ? <CheckIcon /> : <CopyIcon />}
          </motion.span>
        </AnimatePresence>
      </span>
      <span role="status" aria-live="polite" className="srOnly">
        {status === "copied" ? copiedLabel : status === "error" ? errorLabel : ""}
      </span>
    </button>
  );
}
