"use client";

import { motion } from "framer-motion";
import type { PointerKind } from "./scenarios";

type PointerPathProps = {
  x: number;
  y: number;
  kind: PointerKind;
  reduceMotion?: boolean;
};

/** Cursor: black fill with white stroke (product pointer language). */
export function PointerPath({ x, y, kind, reduceMotion }: PointerPathProps) {
  if (kind === "none") return null;

  return (
    <motion.g
      initial={false}
      animate={{ x, y }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
      }
      style={{ pointerEvents: "none" }}
    >
      {kind === "crosshair" ? (
        <g strokeLinecap="round" fill="none">
          <line
            x1={-12}
            y1={0}
            x2={12}
            y2={0}
            stroke="#fff"
            strokeWidth={3}
          />
          <line
            x1={0}
            y1={-12}
            x2={0}
            y2={12}
            stroke="#fff"
            strokeWidth={3}
          />
          <line
            x1={-11}
            y1={0}
            x2={11}
            y2={0}
            stroke="#0B0C0D"
            strokeWidth={1.5}
          />
          <line
            x1={0}
            y1={-11}
            x2={0}
            y2={11}
            stroke="#0B0C0D"
            strokeWidth={1.5}
          />
        </g>
      ) : (
        <path
          d="M0 0 L0 22 L6 17 L10 26 L13 25 L9 15 L17 15 Z"
          fill="#0B0C0D"
          stroke="#fff"
          strokeWidth={1.35}
          strokeLinejoin="round"
          filter="drop-shadow(0 1px 2px rgba(0,0,0,.3))"
        />
      )}
    </motion.g>
  );
}
