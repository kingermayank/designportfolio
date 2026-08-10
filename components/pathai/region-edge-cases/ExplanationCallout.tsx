"use client";

import { AnimatePresence, motion } from "framer-motion";

type ExplanationCalloutProps = {
  text?: string;
  reduceMotion?: boolean;
};

/** Same card language as the comment-card flow: Gotham Narrow on white. */
const FONT = "var(--font-gotham-narrow), 'Gotham Narrow', sans-serif";
const BORDER_LOW = "#e3e5e7";
const TEXT = "#0b0c0d";

export function ExplanationCallout({
  text,
  reduceMotion,
}: ExplanationCalloutProps) {
  return (
    <AnimatePresence mode="wait">
      {text ? (
        <motion.div
          key={text}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            left: "8%",
            right: "8%",
            bottom: 36,
            boxSizing: "border-box",
            padding: "20px 28.148px",
            border: `1.759px solid ${BORDER_LOW}`,
            borderRadius: 14.074,
            background: "#fff",
            color: TEXT,
            fontFamily: FONT,
            fontSize: 24.63,
            fontWeight: 325,
            lineHeight: "35.185px",
            letterSpacing: 0,
            pointerEvents: "none",
            zIndex: 20,
            textAlign: "left",
          }}
        >
          {text}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
