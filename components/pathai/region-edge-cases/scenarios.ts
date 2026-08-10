/**
 * Data for PathAI region-selection edge-case scenarios.
 * Coordinates are in slide-local space (0…SLIDE_W × 0…SLIDE_H).
 * Drawing always originates at region top-left and expands toward bottom-right.
 */

export const SLIDE_W = 1280;
export const SLIDE_H = 720;

export type RegionStyle = "default" | "hover" | "drawing";

export type RegionDef = {
  id: string;
  /** Top-left origin — draw always starts here. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Creation order (lower = earlier). Drives z-index. */
  createOrder: number;
};

export type PointerKind = "arrow" | "crosshair" | "none";

export type ScenarioBeat = {
  at: number;
  visibleRegionIds: string[];
  drawingRegionId?: string;
  hoverRegionId?: string | null;
  pointer: { x: number; y: number; kind: PointerKind };
  caption?: string;
};

export type ScenarioDef = {
  id: string;
  /** Short strip label — domain vocabulary. */
  label: string;
  title: string;
  regions: RegionDef[];
  beats: ScenarioBeat[];
  duration: number;
  /** Draw windows: pointer-down at start → drag TL→BR → release at end. */
  drawWindows: Record<string, { start: number; end: number }>;
};

/** Design tokens from PathAI region spec. */
export const COLORS = {
  /** Border/High Contrast — default dashed regions */
  defaultStroke: "#0B0C0D",
  /** Action/Primary/Hovered */
  hoverStroke: "#074D8C",
  hoverFill: "#F0F1F2",
  hoverFillOpacity: 0.25,
  strokeWidth: 2,
  blue: "#074D8C",
  stageBg: "#e8ebf2",
  chrome: "#f4f5f8",
  captionBg: "rgba(255, 236, 240, 0.95)",
  captionText: "#5a3d4a",
  title: "#5E6A87",
} as const;

/**
 * Region geometry placed over denser / readable tissue areas.
 * All boxes are authored as top-left + size (drag toward bottom-right).
 *
 * Every scenario's regions span the same composition bounds
 * (x 285…925, y-center 330) so all four states share one centered anchor and
 * nothing drifts during a crossfade.
 */
const R = {
  nestedOuter: {
    id: "nested-outer",
    x: 285,
    y: 120,
    w: 640,
    h: 420,
    createOrder: 0,
  },
  nestedInner: {
    id: "nested-inner",
    x: 445,
    y: 240,
    w: 280,
    h: 180,
    createOrder: 1,
  },
  overlapA: {
    id: "overlap-a",
    x: 285,
    y: 160,
    w: 400,
    h: 300,
    createOrder: 0,
  },
  overlapB: {
    id: "overlap-b",
    x: 525,
    y: 200,
    w: 400,
    h: 300,
    createOrder: 1,
  },
  existing: {
    id: "existing",
    x: 285,
    y: 155,
    w: 380,
    h: 300,
    createOrder: 0,
  },
  drawn: {
    id: "drawn",
    x: 505,
    y: 205,
    w: 420,
    h: 300,
    createOrder: 1,
  },
} as const;

export const SCENARIOS: ScenarioDef[] = [
  {
    id: "nested",
    label: "Nested Region Selection",
    title: "Nested Region Selection",
    regions: [R.nestedOuter, R.nestedInner],
    drawWindows: {
      "nested-outer": { start: 0.4, end: 1.05 },
      "nested-inner": { start: 1.45, end: 2.1 },
    },
    duration: 8.0,
    beats: [
      {
        at: 0,
        visibleRegionIds: [],
        pointer: { x: 285, y: 120, kind: "crosshair" },
      },
      {
        at: 0.4,
        visibleRegionIds: [],
        drawingRegionId: "nested-outer",
        pointer: { x: 285, y: 120, kind: "crosshair" },
      },
      {
        at: 1.05,
        visibleRegionIds: ["nested-outer"],
        hoverRegionId: "nested-outer",
        pointer: { x: 925, y: 540, kind: "arrow" },
      },
      {
        at: 1.45,
        visibleRegionIds: ["nested-outer"],
        drawingRegionId: "nested-inner",
        pointer: { x: 445, y: 240, kind: "crosshair" },
      },
      {
        at: 2.1,
        visibleRegionIds: ["nested-outer", "nested-inner"],
        hoverRegionId: "nested-inner",
        pointer: { x: 725, y: 420, kind: "arrow" },
      },
      {
        at: 2.85,
        visibleRegionIds: ["nested-outer", "nested-inner"],
        hoverRegionId: "nested-outer",
        pointer: { x: 555, y: 320, kind: "arrow" },
        caption:
          "A larger region may cover a smaller one. Hovering the nested area still activates the outer region — the inner region is selected from its card in the slides panel.",
      },
      {
        at: 5.2,
        visibleRegionIds: ["nested-outer", "nested-inner"],
        hoverRegionId: "nested-outer",
        pointer: { x: 555, y: 320, kind: "arrow" },
        caption:
          "A larger region may cover a smaller one. Hovering the nested area still activates the outer region — the inner region is selected from its card in the slides panel.",
      },
    ],
  },
  {
    id: "overlap-priority",
    label: "Hover and Selection Priority for Overlapping Regions",
    title: "Hover and Selection Priority for Overlapping Regions",
    regions: [R.overlapA, R.overlapB],
    drawWindows: {
      "overlap-a": { start: 0.35, end: 1.0 },
      "overlap-b": { start: 1.35, end: 2.0 },
    },
    duration: 7.8,
    beats: [
      {
        at: 0,
        visibleRegionIds: [],
        pointer: { x: 285, y: 160, kind: "crosshair" },
      },
      {
        at: 0.35,
        visibleRegionIds: [],
        drawingRegionId: "overlap-a",
        pointer: { x: 285, y: 160, kind: "crosshair" },
      },
      {
        at: 1.0,
        visibleRegionIds: ["overlap-a"],
        hoverRegionId: "overlap-a",
        pointer: { x: 685, y: 460, kind: "arrow" },
      },
      {
        at: 1.35,
        visibleRegionIds: ["overlap-a"],
        drawingRegionId: "overlap-b",
        pointer: { x: 525, y: 200, kind: "crosshair" },
      },
      {
        at: 2.0,
        visibleRegionIds: ["overlap-a", "overlap-b"],
        hoverRegionId: "overlap-b",
        pointer: { x: 925, y: 500, kind: "arrow" },
      },
      {
        at: 2.7,
        visibleRegionIds: ["overlap-a", "overlap-b"],
        hoverRegionId: "overlap-b",
        pointer: { x: 625, y: 320, kind: "arrow" },
        caption:
          "When regions overlap, the most recently created region sits on the upper layer. Hovering the intersection highlights that newer region.",
      },
      {
        at: 5.0,
        visibleRegionIds: ["overlap-a", "overlap-b"],
        hoverRegionId: "overlap-b",
        pointer: { x: 625, y: 320, kind: "arrow" },
        caption:
          "When regions overlap, the most recently created region sits on the upper layer. Hovering the intersection highlights that newer region.",
      },
    ],
  },
  {
    id: "draw-over",
    label: "Drawing a New Region Over an Existing One",
    title: "Drawing a New Region Over an Existing One",
    regions: [R.existing, R.drawn],
    drawWindows: {
      existing: { start: 0.25, end: 0.9 },
      drawn: { start: 1.55, end: 2.45 },
    },
    duration: 7.4,
    beats: [
      {
        at: 0,
        visibleRegionIds: [],
        pointer: { x: 285, y: 155, kind: "crosshair" },
      },
      {
        at: 0.25,
        visibleRegionIds: [],
        drawingRegionId: "existing",
        pointer: { x: 285, y: 155, kind: "crosshair" },
      },
      {
        at: 0.9,
        visibleRegionIds: ["existing"],
        pointer: { x: 665, y: 455, kind: "arrow" },
      },
      {
        at: 1.35,
        visibleRegionIds: ["existing"],
        pointer: { x: 505, y: 205, kind: "crosshair" },
        caption: "Pointer-down to start a new region — top-left origin.",
      },
      {
        at: 1.55,
        visibleRegionIds: ["existing"],
        drawingRegionId: "drawn",
        pointer: { x: 505, y: 205, kind: "crosshair" },
        caption:
          "While dragging across another region, existing hover states stay off — the draw cursor remains intact.",
      },
      {
        at: 2.45,
        visibleRegionIds: ["existing", "drawn"],
        hoverRegionId: "drawn",
        pointer: { x: 925, y: 505, kind: "arrow" },
        caption: "On release, the new region is complete.",
      },
      {
        at: 4.0,
        visibleRegionIds: ["existing", "drawn"],
        hoverRegionId: "drawn",
        pointer: { x: 725, y: 345, kind: "arrow" },
        caption: "On release, the new region is complete.",
      },
      {
        at: 5.6,
        visibleRegionIds: ["existing", "drawn"],
        hoverRegionId: "drawn",
        pointer: { x: 725, y: 345, kind: "arrow" },
        caption: "On release, the new region is complete.",
      },
    ],
  },
  {
    id: "z-index",
    label: "Z-Index Placement After an Overlapping Region Is Created",
    title: "Z-Index Placement After an Overlapping Region Is Created",
    regions: [R.existing, R.drawn],
    drawWindows: {
      existing: { start: 0, end: 0 },
      drawn: { start: 0, end: 0 },
    },
    duration: 6.8,
    beats: [
      {
        at: 0,
        visibleRegionIds: ["existing", "drawn"],
        hoverRegionId: "drawn",
        pointer: { x: 725, y: 345, kind: "arrow" },
        caption: "The newly created region is stacked above the earlier one.",
      },
      {
        at: 1.2,
        visibleRegionIds: ["existing", "drawn"],
        hoverRegionId: "drawn",
        pointer: { x: 585, y: 295, kind: "arrow" },
        caption:
          "Pointer over the overlap highlights the newer region — it owns the top z-index, visually and interactively.",
      },
      {
        at: 3.2,
        visibleRegionIds: ["existing", "drawn"],
        hoverRegionId: "drawn",
        pointer: { x: 585, y: 295, kind: "arrow" },
        caption:
          "Pointer over the overlap highlights the newer region — it owns the top z-index, visually and interactively.",
      },
      {
        at: 5.0,
        visibleRegionIds: ["existing", "drawn"],
        hoverRegionId: "drawn",
        pointer: { x: 585, y: 295, kind: "arrow" },
        caption:
          "Pointer over the overlap highlights the newer region — it owns the top z-index, visually and interactively.",
      },
    ],
  },
];

/**
 * One shared offset that centers the whole edge-case composition on the fixed
 * stage center. Derived from the union of every region across all scenarios —
 * never from the regions currently on screen — so the artwork keeps the exact
 * same position in every scenario and at every point in an animation.
 */
export const COMPOSITION_OFFSET = (() => {
  const regions = SCENARIOS.flatMap((scenario) => scenario.regions);
  const minX = Math.min(...regions.map((r) => r.x));
  const maxX = Math.max(...regions.map((r) => r.x + r.w));
  const minY = Math.min(...regions.map((r) => r.y));
  const maxY = Math.max(...regions.map((r) => r.y + r.h));
  return {
    x: SLIDE_W / 2 - (minX + maxX) / 2,
    y: SLIDE_H / 2 - (minY + maxY) / 2,
  };
})();
