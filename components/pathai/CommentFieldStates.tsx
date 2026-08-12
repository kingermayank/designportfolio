"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";

/* Four state cards: large hero + bottom selector strip on a 16:9 canvas. */
const STAGE_W = 2606;
const STAGE_H = Math.round((STAGE_W * 9) / 16); // 1466
const CARD_W = 475;
const CARD_H_MAX = 268; // tallest card (guidance)
const PAD = 28.148;
const GAP = 28.148;
const RADIUS = 14.074;
const CONTROL_RADIUS = 7.037;
const BORDER = 1.759;

/**
 * Per-card dwell for the carousel. Long enough for each card’s beat to finish,
 * then a short hold before auto-advancing.
 */
const STATE_BEATS = [
  {
    name: "Default",
    // Cursor enter → hover → click press/spring → fade; then hold.
    animEnd: 4.0,
    hold: 1.5,
  },
  {
    name: "Focused",
    animEnd: 3.0,
    hold: 2.0,
  },
  {
    name: "Typing",
    typeStart: 0.55,
    typeEnd: 5.0,
    hold: 1.5,
  },
  {
    name: "Completed",
    animEnd: 0.6,
    hold: 4.4,
  },
] as const;

const CARD_DWELL = STATE_BEATS.map((beat) => {
  const animEnd = "typeEnd" in beat ? beat.typeEnd : beat.animEnd;
  return animEnd + beat.hold;
});

/** Default-state cursor / click beat times (relative to Default segment start). */
const CURSOR = {
  fadeInStart: 0.3,
  fadeInEnd: 0.55,
  moveStart: 0.5,
  moveEnd: 2.2,
  hoverStart: 1.7,
  pressStart: 2.4,
  pressDown: 0.2,
  pressRelease: 0.42,
  fadeOutStart: 3.15,
  fadeOutEnd: 3.7,
  fromX: 505,
  fromY: -90,
  toX: 188,
  toY: 214,
} as const;

const HERO_SCALE = 1.68;
const HERO_CROSSFADE = "opacity 300ms cubic-bezier(0.22, 1, 0.36, 1)";
const HERO_TRANSFORM =
  "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)";
const STRIP_TRANSITION =
  "transform 300ms cubic-bezier(0.22, 1, 0.36, 1), filter 300ms ease, opacity 300ms cubic-bezier(0.22, 1, 0.36, 1)";
const STRIP_INACTIVE_OPACITY = 0.75;
const STRIP_INACTIVE_GRAYSCALE = 0.42;

/**
 * Hero: stage center, then −70px, then −30px. Strip overlay is independent.
 */
const HERO_CENTER_X = STAGE_W / 2;
const HERO_CENTER_Y = STAGE_H / 2 - 100;

/**
 * Bottom strip — static previews; active scales from center; inactive softly muted.
 * Clip wrappers hug each card’s natural height so the progress fill never overshoots.
 */
const STRIP_SCALE = 0.8;
const STRIP_SCALE_ACTIVE = 1.14;
const STRIP_GAP = 40;
const STRIP_BOTTOM = 76;
const STRIP_LABEL_SIZE = 26;
const STRIP_LABEL_ACTIVE = "#2C3548";
const STRIP_LABEL_INACTIVE = "#5E6A87";
/** Soft mute — same family as inactive cards; ~½ prior strong contrast. */
const PROGRESS_MUTE = "rgba(188, 194, 206, 0.16)";
/** Soft white-forward fill with a faint blue lift at the playhead. */
const PROGRESS_FILL =
  "linear-gradient(90deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.4) 58%, rgba(20,107,194,0.1) 100%)";
const PROGRESS_LINE = "rgba(20, 107, 194, 0.52)";
const PROGRESS_LINE_W = 1.5;

const STATE_NAMES = ["Default", "Focused", "Typing", "Completed"] as const;
const FONT_LABEL = "var(--font-label), var(--font-nitti-px), sans-serif";

const FONT = "var(--font-gotham-narrow), 'Gotham Narrow', sans-serif";
const BLUE = "#146bc2";
const BORDER_LOW = "#e3e5e7";
const TEXT = "#0b0c0d";
const TEXT_SECONDARY = "#67737e";
const PLACEHOLDER = "#9ba0a4";
const TEXT_DISABLED = "#b9bdc1";
const ACTION_DISABLED = "#e3e5e7";
const BACKGROUND = "#dce0e9";

const TYPED =
  "I think this region of the cell is cancerous. Just for reference this patient has";
const COMPLETE =
  "I think this region of the cell is cancerous. Just for reference this patient has stage 4 melanoma okay?";

const bodyText: CSSProperties = {
  fontFamily: FONT,
  fontSize: 24.63,
  fontWeight: 325,
  lineHeight: "35.185px",
  textAlign: "left",
};

const metaText: CSSProperties = {
  fontFamily: FONT,
  fontSize: 21.111,
  fontWeight: 350,
  lineHeight: "31.667px",
  textAlign: "left",
};

const cardStyle: CSSProperties = {
  boxSizing: "border-box",
  width: CARD_W,
  padding: PAD,
  border: `${BORDER}px solid ${BORDER_LOW}`,
  borderRadius: RADIUS,
  background: "#fff",
  fontFamily: FONT,
  textAlign: "left",
};

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function range(time: number, start: number, end: number) {
  return clamp((time - start) / (end - start));
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function Caret({ visible }: { visible: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: BORDER,
        height: 27,
        marginRight: 2,
        background: TEXT,
        verticalAlign: "-5px",
        opacity: visible ? 1 : 0,
      }}
    />
  );
}

function Button({
  children,
  primary = false,
  disabled = false,
  icon,
  active = false,
  press = 0,
  width,
}: {
  children: React.ReactNode;
  primary?: boolean;
  disabled?: boolean;
  icon?: string;
  active?: boolean;
  /** 0 = resting, 1 = fully pressed */
  press?: number;
  width?: number;
}) {
  const outline = !primary && !disabled;
  const scale = 1 - 0.1 * press;
  return (
    <div
      style={{
        boxSizing: "border-box",
        display: "inline-flex",
        width,
        alignItems: "center",
        justifyContent: "center",
        gap: 14.074,
        height: 42.222,
        padding: "0 21.111px",
        border: "none",
        borderRadius: CONTROL_RADIUS,
        // Inset ring so the blue stroke stays inside the button (not clipped by the card).
        boxShadow: outline ? `inset 0 0 0 ${BORDER}px ${BLUE}` : undefined,
        background: disabled
          ? ACTION_DISABLED
          : primary
            ? BLUE
            : active
              ? "rgba(20, 107, 194, 0.06)"
              : "#fff",
        color: disabled ? TEXT_DISABLED : primary ? "#fff" : BLUE,
        fontFamily: FONT,
        fontSize: 21.111,
        fontWeight: 350,
        lineHeight: 1,
        whiteSpace: "nowrap",
        transform: `scale(${scale})`,
        transformOrigin: "50% 50%",
      }}
    >
      {icon && (
        <Image
          src={icon}
          alt=""
          width={22}
          height={22}
          unoptimized
          style={{ width: 21.111, height: 21.111 }}
        />
      )}
      {children}
    </div>
  );
}

function ButtonRow({ saveEnabled }: { saveEnabled: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Button width={104.222}>Cancel</Button>
      <Button width={86.222} primary={saveEnabled} disabled={!saveEnabled}>
        Save
      </Button>
    </div>
  );
}

function Field({
  children,
  color = TEXT,
  focused = true,
}: {
  children: React.ReactNode;
  color?: string;
  focused?: boolean;
}) {
  return (
    <div
      style={{
        boxSizing: "border-box",
        position: "relative",
        width: 418.704,
        height: 126.667,
        border: `${BORDER}px solid ${focused ? BLUE : BORDER_LOW}`,
        borderRadius: CONTROL_RADIUS,
        background: "#fff",
      }}
    >
      <div
        style={{
          ...bodyText,
          position: "absolute",
          top: 12.32,
          left: 12.31,
          width: 390.556,
          color,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Cursor({
  x,
  y,
  press,
  opacity,
}: {
  x: number;
  y: number;
  press: number;
  opacity: number;
}) {
  if (opacity < 0.01) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        transform: `scale(${1 - 0.12 * press})`,
        transformOrigin: "2px 2px",
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      <svg
        width="30"
        height="39"
        viewBox="0 0 17 22"
        style={{
          display: "block",
          filter: "drop-shadow(0 1px 2px rgba(0,0,0,.35))",
        }}
        aria-hidden
      >
        <path
          d="M1 1 L1 17.2 L5.2 13.2 L8 19.6 L11 18.2 L8.3 12.1 L13.8 12.1 Z"
          fill="#fff"
          stroke="#22262b"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function GuidanceCard({
  active,
  press = 0,
  cursor,
}: {
  active: boolean;
  press?: number;
  cursor?: { x: number; y: number; press: number; opacity: number } | null;
}) {
  return (
    <div
      style={{
        ...cardStyle,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: GAP,
        minHeight: 267.407,
        overflow: cursor ? "visible" : "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: GAP,
          width: 418.704,
          height: 140.741,
        }}
      >
        <Image
          src="/pathai/comment-states/illustration.svg"
          alt=""
          width={141}
          height={141}
          unoptimized
          style={{ width: 140.741, height: 140.741, flexShrink: 0 }}
        />
        <p
          style={{
            ...bodyText,
            width: 249.815,
            margin: 0,
            color: TEXT_SECONDARY,
          }}
        >
          Draw directly on the slide with your cursor to add a comment.
        </p>
      </div>
      <div style={{ alignSelf: "flex-start" }}>
        <Button
          width={323.444}
          icon="/pathai/comment-states/comment-dots.svg"
          active={active}
          press={press}
        >
          Add Region Comment (C)
        </Button>
      </div>
      {cursor && (
        <Cursor
          x={cursor.x}
          y={cursor.y}
          press={cursor.press}
          opacity={cursor.opacity}
        />
      )}
    </div>
  );
}

function EmptyComposer({ blink }: { blink: boolean }) {
  return (
    <div
      style={{
        ...cardStyle,
        display: "flex",
        flexDirection: "column",
        gap: GAP,
        height: 253.333,
        overflow: "hidden",
      }}
    >
      <Field color={PLACEHOLDER}>
        <Caret visible={blink} />
        Enter a comment
      </Field>
      <ButtonRow saveEnabled={false} />
    </div>
  );
}

function TypingComposer({ characters, blink }: { characters: number; blink: boolean }) {
  return (
    <div
      style={{
        ...cardStyle,
        display: "flex",
        flexDirection: "column",
        gap: GAP,
        height: 253.333,
        overflow: "hidden",
      }}
    >
      <Field>
        {TYPED.slice(0, characters)}
        <Caret visible={blink} />
      </Field>
      <ButtonRow saveEnabled={characters > 0} />
    </div>
  );
}

function SavedComment() {
  return (
    <div
      style={{
        ...cardStyle,
        display: "flex",
        flexDirection: "column",
        gap: 14.074,
        minHeight: 245.37,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 14.074,
          width: 418.704,
        }}
      >
        <div style={{ flex: "1 0 0", minWidth: 0 }}>
          <p style={{ ...metaText, margin: 0, color: TEXT, fontWeight: 500 }}>
            Mike Drage
          </p>
          <p style={{ ...metaText, margin: 0, color: TEXT_SECONDARY }}>
            2021-04-22 09:32
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 42.222,
            height: 42.222,
            flexShrink: 0,
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
      <p
        style={{
          ...bodyText,
          width: 418.704,
          minHeight: 103,
          margin: 0,
          color: TEXT,
        }}
      >
        {COMPLETE}
      </p>
    </div>
  );
}

function Stage({
  activeIndex,
  localTime,
  reduceMotion,
  onSelect,
}: {
  activeIndex: number;
  localTime: number;
  reduceMotion: boolean;
  onSelect: (index: number) => void;
}) {
  const typingBeat = STATE_BEATS[2];
  const progress = clamp(localTime / CARD_DWELL[activeIndex]);
  const heroScale = HERO_SCALE + 0.03 * progress;

  // Live motion only while that card is the active hero.
  const heroBlink =
    !reduceMotion &&
    (activeIndex === 1 || activeIndex === 2) &&
    Math.floor(localTime * 2) % 2 === 0;

  const moveT = easeOutCubic(range(localTime, CURSOR.moveStart, CURSOR.moveEnd));
  const cursorX = lerp(CURSOR.fromX, CURSOR.toX, moveT);
  const cursorY = lerp(CURSOR.fromY, CURSOR.toY, moveT);
  const cursorIn = range(localTime, CURSOR.fadeInStart, CURSOR.fadeInEnd);
  const cursorOut = 1 - range(localTime, CURSOR.fadeOutStart, CURSOR.fadeOutEnd);
  const cursorOpacity =
    !reduceMotion && activeIndex === 0 ? cursorIn * cursorOut : 0;

  const hover =
    !reduceMotion && activeIndex === 0
      ? range(localTime, CURSOR.hoverStart, CURSOR.moveEnd)
      : 0;

  const pressDown = range(
    localTime,
    CURSOR.pressStart,
    CURSOR.pressStart + CURSOR.pressDown,
  );
  const pressReleaseT = range(
    localTime,
    CURSOR.pressStart + CURSOR.pressDown,
    CURSOR.pressStart + CURSOR.pressDown + CURSOR.pressRelease,
  );
  const buttonPress =
    reduceMotion || activeIndex !== 0
      ? 0
      : pressReleaseT > 0
        ? 1 - easeOutBack(pressReleaseT)
        : pressDown;

  const characters = (() => {
    if (activeIndex !== 2) {
      return TYPED.length;
    }
    if (reduceMotion) return TYPED.length;
    if (localTime < typingBeat.typeStart) return 0;
    if (localTime >= typingBeat.typeEnd) return TYPED.length;
    return Math.round(
      TYPED.length * range(localTime, typingBeat.typeStart, typingBeat.typeEnd),
    );
  })();

  // Live hero for the active index; still end-frames for the others (smooth crossfade).
  const heroCards = [
    activeIndex === 0 ? (
      <GuidanceCard
        key="hg"
        active={hover > 0.15}
        press={buttonPress}
        cursor={
          cursorOpacity > 0.01
            ? {
                x: cursorX,
                y: cursorY,
                press: buttonPress,
                opacity: cursorOpacity,
              }
            : null
        }
      />
    ) : (
      <GuidanceCard key="hg-still" active={false} />
    ),
    activeIndex === 1 ? (
      <EmptyComposer key="he" blink={heroBlink} />
    ) : (
      <EmptyComposer key="he-still" blink={true} />
    ),
    activeIndex === 2 ? (
      <TypingComposer key="ht" characters={characters} blink={heroBlink} />
    ) : (
      <TypingComposer key="ht-still" characters={TYPED.length} blink={false} />
    ),
    <SavedComment key="hs" />,
  ];

  const stripPreviews = [
    <GuidanceCard key="sg" active={false} />,
    <EmptyComposer key="se" blink={true} />,
    <TypingComposer key="st" characters={TYPED.length} blink={false} />,
    <SavedComment key="ss" />,
  ];

  // Slot sized for the largest scaled card so active cards never clip.
  const stripSlotW = Math.ceil(CARD_W * STRIP_SCALE * STRIP_SCALE_ACTIVE) + 12;
  const stripSlotH =
    Math.ceil(CARD_H_MAX * STRIP_SCALE * STRIP_SCALE_ACTIVE) + 12;
  // Vertical playhead: fill width + line position track left → right with dwell.
  const progressPct = progress * 100;

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
      }}
    >
      {/* Soft spotlight behind the hero */}
      <div
        style={{
          position: "absolute",
          left: HERO_CENTER_X,
          top: HERO_CENTER_Y,
          width: 1600,
          height: 1000,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          background:
            "radial-gradient(closest-side, rgba(255,255,255,.88), rgba(255,255,255,0))",
        }}
      />

      {/* Enlarged center card — ~300ms opacity crossfade between states */}
      <div
        style={{
          position: "absolute",
          left: HERO_CENTER_X,
          top: HERO_CENTER_Y,
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
      >
        {heroCards.map((card, i) => {
          const on = i === activeIndex;
          return (
            <div
              key={`hero-${i}`}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: CARD_W,
                transform: `translate(-50%, -50%) scale(${on ? heroScale : HERO_SCALE})`,
                transformOrigin: "50% 50%",
                opacity: on ? 1 : 0,
                transition: reduceMotion
                  ? "none"
                  : `${HERO_CROSSFADE}, ${HERO_TRANSFORM}`,
                zIndex: on ? 2 : 1,
              }}
            >
              {card}
            </div>
          );
        })}
      </div>

      {/* Bottom selector strip — clickable; active scales from center */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: STRIP_BOTTOM,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: STRIP_GAP,
          pointerEvents: "auto",
        }}
        role="tablist"
        aria-label="Comment field states"
      >
        {STATE_NAMES.map((name, i) => {
          const active = i === activeIndex;
          const scale = STRIP_SCALE * (active ? STRIP_SCALE_ACTIVE : 1);
          return (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`Show ${name} state`}
              onClick={() => onSelect(i)}
              style={{
                width: stripSlotW,
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                overflow: "visible",
              }}
            >
              <div
                style={{
                  width: stripSlotW,
                  height: stripSlotH,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "visible",
                }}
              >
                {/* Scale outer; inner clip hugs the card’s natural box. */}
                <div
                  style={{
                    width: CARD_W,
                    transform: `scale(${scale})`,
                    transformOrigin: "50% 50%",
                    transition: STRIP_TRANSITION,
                    filter: active
                      ? "none"
                      : `grayscale(${STRIP_INACTIVE_GRAYSCALE})`,
                    opacity: active ? 1 : STRIP_INACTIVE_OPACITY,
                    textAlign: "left",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: CARD_W,
                      overflow: "hidden",
                      borderRadius: RADIUS,
                      isolation: "isolate",
                    }}
                  >
                    {stripPreviews[i]}
                    {/* Progress: white-forward tint + thin blue leading edge */}
                    {active && (
                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: RADIUS,
                          overflow: "hidden",
                          clipPath: `inset(0 round ${RADIUS}px)`,
                          pointerEvents: "none",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: `${progressPct}%`,
                            background: PROGRESS_MUTE,
                            backdropFilter: `grayscale(${STRIP_INACTIVE_GRAYSCALE})`,
                            WebkitBackdropFilter: `grayscale(${STRIP_INACTIVE_GRAYSCALE})`,
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            bottom: 0,
                            width: `${progressPct}%`,
                            background: PROGRESS_FILL,
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: `min(calc(100% - ${PROGRESS_LINE_W}px), max(0px, calc(${progressPct}% - ${PROGRESS_LINE_W / 2}px)))`,
                            width: PROGRESS_LINE_W,
                            background: PROGRESS_LINE,
                            borderRadius: PROGRESS_LINE_W,
                            boxShadow: "0 0 0 1px rgba(20, 107, 194, 0.06)",
                            opacity: progress > 0.002 && progress < 0.998 ? 1 : 0,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontFamily: FONT_LABEL,
                  fontSize: STRIP_LABEL_SIZE,
                  fontWeight: 600,
                  letterSpacing: 2.8,
                  textTransform: "uppercase",
                  color: active ? STRIP_LABEL_ACTIVE : STRIP_LABEL_INACTIVE,
                  opacity: active ? 1 : 0.68,
                  transition:
                    "opacity 300ms cubic-bezier(0.22, 1, 0.36, 1), color 300ms cubic-bezier(0.22, 1, 0.36, 1)",
                  textAlign: "center",
                  width: "100%",
                  lineHeight: 1.15,
                }}
              >
                {name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CommentFieldStates() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [localTime, setLocalTime] = useState(0);
  const activeIndexRef = useRef(0);
  const segmentStartedRef = useRef(0);

  const selectCard = (index: number) => {
    activeIndexRef.current = index;
    setActiveIndex(index);
    segmentStartedRef.current = performance.now();
    setLocalTime(0);
  };

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
    const tick = (now: number) => {
      if (reduceMotion) {
        setLocalTime(CARD_DWELL[activeIndexRef.current]);
        frame = requestAnimationFrame(tick);
        return;
      }
      const local = (now - segmentStartedRef.current) / 1000;
      const dwell = CARD_DWELL[activeIndexRef.current];
      if (local >= dwell) {
        const next = (activeIndexRef.current + 1) % STATE_NAMES.length;
        activeIndexRef.current = next;
        setActiveIndex(next);
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
        aria-label="Region Comments interaction states: guidance, focused input, typed comment, and saved comment."
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
            // Allow strip clicks (descendants); hero stays non-interactive via its own styles.
            pointerEvents: "auto",
          }}
        >
          <Stage
            activeIndex={activeIndex}
            localTime={localTime}
            reduceMotion={reduceMotion}
            onSelect={selectCard}
          />
        </div>
      </div>
    </figure>
  );
}
