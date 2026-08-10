"use client";

import { motion } from "framer-motion";
import { COLORS, type RegionStyle } from "./scenarios";

type RegionBoxProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  style: RegionStyle;
  /** 0–1 while drawing TL→BR; 1 when complete */
  drawProgress: number;
  zIndex: number;
  reduceMotion?: boolean;
};

/**
 * Default: dashed #0B0C0D, 2px, inside.
 * Hover: solid #074D8C, 2px, fill #F0F1F2 @ 25%.
 * Drawing uses default stroke while the rubber-band grows.
 */
export function RegionBox({
  x,
  y,
  w,
  h,
  style,
  drawProgress,
  zIndex,
  reduceMotion,
}: RegionBoxProps) {
  const progress = reduceMotion ? 1 : Math.max(0, Math.min(1, drawProgress));
  if (progress <= 0.001 || w < 1 || h < 1) return null;

  const isHover = style === "hover";
  const isDefault = style === "default" || style === "drawing";
  const stroke = isHover ? COLORS.hoverStroke : COLORS.defaultStroke;
  const strokeWidth = COLORS.strokeWidth;
  // SVG can't do "inside" stroke natively — inset rect by half stroke so
  // the visual edge matches an inside-aligned 2px stroke.
  const inset = strokeWidth / 2;
  const rw = Math.max(w - strokeWidth, 1);
  const rh = Math.max(h - strokeWidth, 1);

  return (
    <motion.g
      style={{ zIndex }}
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {isHover && (
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill={COLORS.hoverFill}
          fillOpacity={COLORS.hoverFillOpacity}
        />
      )}
      <rect
        x={x + inset}
        y={y + inset}
        width={rw}
        height={rh}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
        strokeLinejoin="miter"
        vectorEffect="non-scaling-stroke"
        strokeDasharray={isDefault ? "7 6" : undefined}
        opacity={style === "drawing" ? 0.95 : 1}
      />
    </motion.g>
  );
}
