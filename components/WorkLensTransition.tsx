"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import "./WorkLensTransition.css";

const ease = [0.22, 1, 0.36, 1] as const;
const depth: Variants = {
  enter: { opacity: 0, y: 20, scale: 0.965 },
  center: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.42, ease } },
  exit: { opacity: 0, y: -8, scale: 0.985, transition: { duration: 0.16, ease } },
};
const reduced: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

/** Depth swap between Visual Craft, Product Strategy, and Design Engineering. */
export default function WorkLensTransition({ lens, children }: {
  lens: string; children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={lens} className="workLensPane workLensDepth"
        variants={reduce ? reduced : depth}
        initial="enter" animate="center" exit="exit" style={{ transformOrigin: "50% 0%" }}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
