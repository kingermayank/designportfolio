"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";

/**
 * Comment-card anatomy → completed card (16:9).
 *
 * ONE persistent centered wrapper (fixed left/top/width/height).
 * Anatomy and card are two states inside that same coordinate system.
 * Their visual centers match exactly — no outer translateX / lateral settle.
 *
 * Only internal transforms + opacity animate (vertical tighten, chrome out,
 * shell in, menu last).
 */

const STAGE_W = 2606;
const STAGE_H = Math.round((STAGE_W * 9) / 16); // 1466

const FONT = "var(--font-gotham-narrow), 'Gotham Narrow', sans-serif";
const BACKGROUND = "#dce0e9";
const BORDER_LOW = "#e3e5e7";
const TEXT = "#0b0c0d";
const TEXT_SECONDARY = "#67737e";
const LABEL_COLOR = "#5E6A87";

const NAME = "Mike Drage";
const TIMESTAMP = "2021-04-22 09:32";
const COMMENT =
  "I think this region of the cell is cancerous. Just for reference this patient has stage 4 melanoma okay?";

const META_SIZE = 21.111;
const META_LH = 31.667;
const BODY_SIZE = 24.63;
const BODY_LH = 35.185;

const metaStyle: CSSProperties = {
  fontFamily: FONT,
  fontSize: META_SIZE,
  fontWeight: 350,
  lineHeight: `${META_LH}px`,
  textAlign: "left",
  margin: 0,
};

const bodyStyle: CSSProperties = {
  fontFamily: FONT,
  fontSize: BODY_SIZE,
  fontWeight: 325,
  lineHeight: `${BODY_LH}px`,
  textAlign: "left",
  margin: 0,
};

/* ── Card metrics ──────────────────────────────────────────────────────── */
const CARD = {
  w: 475,
  pad: 28.148,
  radius: 14.074,
  border: 1.759,
  sectionGap: 22,
  metaStackGap: 0,
  contentW: 418.704,
  menuSize: 42.222,
  nameH: META_LH,
  timestampH: META_LH,
  commentH: 105.555,
} as const;

const CARD_SCALE = 1.5;
const CARD_W = CARD.w * CARD_SCALE;
const CARD_H =
  (CARD.pad * 2 +
    CARD.nameH +
    CARD.metaStackGap +
    CARD.timestampH +
    CARD.sectionGap +
    CARD.commentH) *
  CARD_SCALE;
const CARD_PAD = CARD.pad * CARD_SCALE;

/* ── Anatomy column metrics ────────────────────────────────────────────── */
const COL = {
  labelW: 132,
  gapLabelLine: 20,
  lineW: 72,
  gapLineValue: 20,
  scale: 1.12,
  labelSize: 17,
  rowPitch: 112,
} as const;

const LABEL_BLOCK_W =
  (COL.labelW + COL.gapLabelLine + COL.lineW + COL.gapLineValue) * COL.scale;

/**
 * Value column width is derived so that, when BOTH the anatomy group and the
 * card are centered in the same wrapper, the value column’s left edge coincides
 * with the card content’s left edge. No guessed settle offsets.
 *
 *   VALUE_COL_W = CARD_W - 2 * CARD_PAD + LABEL_BLOCK_W
 */
const VALUE_COL_W = CARD_W - 2 * CARD_PAD + LABEL_BLOCK_W;

const ANATOMY_W = LABEL_BLOCK_W + VALUE_COL_W;
const ANATOMY_H =
  COL.rowPitch * 2 * COL.scale + CARD.commentH * COL.scale;

/* ── Persistent wrapper: fixed size + centered stage position ──────────── */
const WRAPPER_PAD = 48;
const WRAPPER_W = Math.max(ANATOMY_W, CARD_W) + WRAPPER_PAD * 2;
const WRAPPER_H = Math.max(ANATOMY_H, CARD_H) + WRAPPER_PAD * 2;
const WRAPPER_LEFT = (STAGE_W - WRAPPER_W) / 2;
const WRAPPER_TOP = (STAGE_H - WRAPPER_H) / 2;

/** Card centered inside wrapper (wrapper-local coords). */
const CARD_LEFT = (WRAPPER_W - CARD_W) / 2;
const CARD_TOP = (WRAPPER_H - CARD_H) / 2;

/** Anatomy group centered inside wrapper — same center as the card. */
const ANATOMY_LEFT = (WRAPPER_W - ANATOMY_W) / 2;

/**
 * Shared content spine: identical X for anatomy values and card content
 * because VALUE_COL_W was derived for that equality.
 * (ANATOMY_LEFT + LABEL_BLOCK_W) === (CARD_LEFT + CARD_PAD)
 */
const LABEL_X = ANATOMY_LEFT;
const CONTENT_X = ANATOMY_LEFT + LABEL_BLOCK_W;
const LINE_X = CONTENT_X - (COL.lineW + COL.gapLineValue) * COL.scale;

const ROW_LABELS = ["Name", "Timestamp", "Comment"] as const;

/** Equally spaced row centerlines about the shared vertical center of the wrapper. */
const WRAPPER_MID_Y = WRAPPER_H / 2;
const ROW_Y = [
  WRAPPER_MID_Y - COL.rowPitch * COL.scale,
  WRAPPER_MID_Y,
  WRAPPER_MID_Y + COL.rowPitch * COL.scale,
] as const;

function topForCenter(centerY: number, height: number, scale: number) {
  return centerY - (height * scale) / 2;
}

/** Start Y (anatomy) — equally spaced rows. */
const START = {
  nameY: topForCenter(ROW_Y[0], CARD.nameH, COL.scale),
  timestampY: topForCenter(ROW_Y[1], CARD.timestampH, COL.scale),
  commentY: topForCenter(ROW_Y[2], CARD.commentH, COL.scale),
  scale: COL.scale,
} as const;

/** End Y (card) — header cluster + separated comment. Zero DX. */
const END = {
  nameY: CARD_TOP + CARD_PAD,
  timestampY:
    CARD_TOP + CARD_PAD + (CARD.nameH + CARD.metaStackGap) * CARD_SCALE,
  commentY:
    CARD_TOP +
    CARD_PAD +
    (CARD.nameH + CARD.metaStackGap + CARD.timestampH + CARD.sectionGap) *
      CARD_SCALE,
  scale: CARD_SCALE,
  menuX: CARD_LEFT + CARD_W - CARD_PAD - CARD.menuSize * CARD_SCALE,
  menuY: CARD_TOP + CARD_PAD,
} as const;

const DY_NAME = END.nameY - START.nameY;
const DY_TIMESTAMP = END.timestampY - START.timestampY;
const DY_COMMENT = END.commentY - START.commentY;
const DS = END.scale - START.scale;

/* ── Timing ────────────────────────────────────────────────────────────── */
const MERGE_MS = 820;
const HOLD_ANATOMY_MS = 2600;
const HOLD_CARD_MS = 3000;
const FADE_MS = 360;
const LOOP_MS = HOLD_ANATOMY_MS + MERGE_MS + HOLD_CARD_MS + FADE_MS;

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

/** cubic-bezier(0.22, 1, 0.36, 1) */
function easeMerge(t: number) {
  const x = clamp(t);
  let lo = 0;
  let hi = 1;
  let s = x;
  for (let i = 0; i < 14; i++) {
    const bx = bezier1(s, 0.22, 0.36);
    if (Math.abs(bx - x) < 1e-5) break;
    if (bx < x) lo = s;
    else hi = s;
    s = (lo + hi) / 2;
  }
  return bezier1(s, 1, 1);
}

function bezier1(s: number, a: number, b: number) {
  const u = 1 - s;
  return 3 * u * u * s * a + 3 * u * s * s * b + s * s * s;
}

function Stage({
  localTime,
  reduceMotion,
}: {
  localTime: number;
  reduceMotion: boolean;
}) {
  const holdA = HOLD_ANATOMY_MS / 1000;
  const merge = MERGE_MS / 1000;
  const holdC = HOLD_CARD_MS / 1000;
  const fade = FADE_MS / 1000;

  let p = 0;
  let intro = 1;
  let outro = 1;

  if (reduceMotion) {
    p = 1;
  } else if (localTime < holdA) {
    intro = clamp(localTime / 0.3);
    p = 0;
  } else if (localTime < holdA + merge) {
    p = easeMerge((localTime - holdA) / merge);
  } else if (localTime < holdA + merge + holdC) {
    p = 1;
  } else {
    p = 1;
    outro = 1 - clamp((localTime - holdA - merge - holdC) / fade);
  }

  const chromeOpacity = 1 - clamp(p / 0.6);
  const chromeScaleX = 1 - 0.78 * p;
  const shellOpacity = p === 0 ? 0 : clamp((p - 0.02) / 0.75);
  const shellScale = 0.975 + 0.025 * p;
  const menuOpacity = clamp((p - 0.78) / 0.22);
  const menuScale = 0.96 + 0.04 * menuOpacity;

  const valueWidth = CARD.contentW - CARD.menuSize - CARD.sectionGap;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: STAGE_W,
        height: STAGE_H,
        overflow: "hidden",
        borderRadius: 8,
        background: BACKGROUND,
        fontFamily: FONT,
        opacity: intro * outro,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: STAGE_W / 2,
          top: STAGE_H / 2,
          width: 1200,
          height: 800,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          background:
            "radial-gradient(closest-side, rgba(255,255,255,.7), rgba(255,255,255,0))",
        }}
      />

      {/*
        Persistent wrapper — fixed left/top/width/height for the whole timeline.
        Anatomy + card share this coordinate system and the same center.
      */}
      <div
        style={{
          position: "absolute",
          left: WRAPPER_LEFT,
          top: WRAPPER_TOP,
          width: WRAPPER_W,
          height: WRAPPER_H,
          pointerEvents: "none",
        }}
      >
        {/* White card — centered in wrapper; opacity + scale only */}
        <div
          style={{
            position: "absolute",
            left: CARD_LEFT,
            top: CARD_TOP,
            width: CARD_W,
            height: CARD_H,
            boxSizing: "border-box",
            borderRadius: CARD.radius * CARD_SCALE,
            border: `${CARD.border * CARD_SCALE}px solid ${BORDER_LOW}`,
            background: "#fff",
            boxShadow: "0 14px 40px rgba(20, 30, 50, 0.1)",
            opacity: shellOpacity,
            transform: `scale(${shellScale})`,
            transformOrigin: "50% 50%",
            zIndex: 1,
          }}
        />

        {/* Anatomy chrome — same vertical centerline as the card */}
        {ROW_LABELS.map((label, i) => (
          <div key={label}>
            <div
              style={{
                position: "absolute",
                left: LABEL_X,
                top: ROW_Y[i] - COL.labelSize / 2,
                width: COL.labelW,
                height: COL.labelSize,
                fontFamily: FONT,
                fontSize: COL.labelSize,
                fontWeight: 350,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                color: LABEL_COLOR,
                lineHeight: 1,
                whiteSpace: "nowrap",
                opacity: chromeOpacity,
                transform: `scale(${COL.scale}) scaleX(${chromeScaleX})`,
                transformOrigin: "100% 50%",
                zIndex: 2,
              }}
            >
              {label}
            </div>
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: LINE_X,
                top: ROW_Y[i],
                width: COL.lineW * COL.scale,
                height: 1.5 * COL.scale,
                transform: `translateY(-50%) scaleX(${chromeScaleX})`,
                transformOrigin: "100% 50%",
                background: "rgba(94, 106, 135, 0.4)",
                opacity: chromeOpacity,
                zIndex: 2,
              }}
            />
          </div>
        ))}

        {/*
          Shared content nodes. Fixed left = CONTENT_X (no horizontal travel).
          Only translateY + scale during merge.
        */}
        <div
          style={{
            position: "absolute",
            left: CONTENT_X,
            top: START.nameY,
            width: valueWidth,
            transform: `translate3d(0, ${DY_NAME * p}px, 0) scale(${START.scale + DS * p})`,
            transformOrigin: "0 0",
            zIndex: 3,
          }}
        >
          <p style={{ ...metaStyle, color: TEXT, fontWeight: 500 }}>{NAME}</p>
        </div>

        <div
          style={{
            position: "absolute",
            left: CONTENT_X,
            top: START.timestampY,
            width: valueWidth,
            transform: `translate3d(0, ${DY_TIMESTAMP * p}px, 0) scale(${START.scale + DS * p})`,
            transformOrigin: "0 0",
            zIndex: 3,
          }}
        >
          <p style={{ ...metaStyle, color: TEXT_SECONDARY }}>{TIMESTAMP}</p>
        </div>

        <div
          style={{
            position: "absolute",
            left: CONTENT_X,
            top: START.commentY,
            width: CARD.contentW,
            transform: `translate3d(0, ${DY_COMMENT * p}px, 0) scale(${START.scale + DS * p})`,
            transformOrigin: "0 0",
            zIndex: 3,
          }}
        >
          <p style={{ ...bodyStyle, color: TEXT, minHeight: CARD.commentH }}>
            {COMMENT}
          </p>
        </div>

        {/* Menu — final header, fades in last */}
        <div
          style={{
            position: "absolute",
            left: END.menuX,
            top: END.menuY,
            width: CARD.menuSize,
            height: CARD.menuSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: menuOpacity,
            transform: `scale(${CARD_SCALE * menuScale})`,
            transformOrigin: "0 0",
            zIndex: 4,
          }}
        >
          <Image
            src="/pathai/comment-states/ellipsis-v.svg"
            alt=""
            width={8}
            height={22}
            unoptimized
            style={{ width: 8, height: 22 }}
          />
        </div>
      </div>
    </div>
  );
}

export default function CommentCardAnatomy() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [localTime, setLocalTime] = useState(0);
  const segmentStartedRef = useRef(0);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "80px", threshold: 0.05 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;
    const measure = () => setScale(element.clientWidth / STAGE_W);
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    segmentStartedRef.current = performance.now();
    setLocalTime(0);
    let frame = 0;
    const loopSec = LOOP_MS / 1000;
    const tick = (now: number) => {
      if (reduceMotion) {
        setLocalTime(HOLD_ANATOMY_MS / 1000 + MERGE_MS / 1000);
        frame = requestAnimationFrame(tick);
        return;
      }
      const local = (now - segmentStartedRef.current) / 1000;
      if (local >= loopSec) {
        segmentStartedRef.current = now;
        setLocalTime(0);
      } else {
        setLocalTime(local);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, reduceMotion]);

  return (
    <figure className="csFigure">
      <div
        ref={wrapperRef}
        className="csMedia csCommentStates"
        style={{ background: BACKGROUND, aspectRatio: STAGE_W / STAGE_H }}
        role="region"
        aria-label="Comment card anatomy: Name, Timestamp, and Comment reorganize into a centered completed comment card."
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: STAGE_W,
            height: STAGE_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
        >
          <Stage localTime={localTime} reduceMotion={reduceMotion} />
        </div>
      </div>
    </figure>
  );
}
