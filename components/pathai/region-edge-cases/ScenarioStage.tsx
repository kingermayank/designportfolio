"use client";

import { useMemo } from "react";
import { RegionBox } from "./RegionBox";
import { PointerPath } from "./PointerPath";
import { ExplanationCallout } from "./ExplanationCallout";
import {
  COMPOSITION_OFFSET,
  SLIDE_H,
  SLIDE_W,
  type RegionStyle,
  type ScenarioBeat,
  type ScenarioDef,
} from "./scenarios";

type ScenarioStageProps = {
  scenario: ScenarioDef;
  time: number;
  reduceMotion: boolean;
  /** Hide pointer/caption for strip thumbnails. */
  preview?: boolean;
};

function activeBeat(beats: ScenarioBeat[], time: number): ScenarioBeat {
  let current = beats[0];
  for (const beat of beats) {
    if (time >= beat.at) current = beat;
    else break;
  }
  return current;
}

function drawT(
  scenario: ScenarioDef,
  regionId: string,
  time: number,
  reduceMotion: boolean,
): number {
  const window = scenario.drawWindows[regionId];
  if (!window || window.end <= window.start) return 1;
  if (reduceMotion) return time >= window.start ? 1 : 0;
  if (time < window.start) return 0;
  if (time >= window.end) return 1;
  const linear = (time - window.start) / (window.end - window.start);
  return 1 - Math.pow(1 - linear, 2);
}

function styleFor(regionId: string, beat: ScenarioBeat): RegionStyle {
  if (beat.drawingRegionId === regionId) return "drawing";
  if (beat.hoverRegionId === regionId) return "hover";
  return "default";
}

/**
 * Full-bleed slide stage. Overlays share the slide viewBox — no secondary panels.
 */
export function ScenarioStage({
  scenario,
  time,
  reduceMotion,
  preview = false,
}: ScenarioStageProps) {
  const beat = useMemo(
    () => activeBeat(scenario.beats, time),
    [scenario.beats, time],
  );

  const pointer = useMemo(() => {
    if (preview) return { x: 0, y: 0, kind: "none" as const };
    const drawingId = beat.drawingRegionId;
    if (!drawingId || reduceMotion) return beat.pointer;
    const region = scenario.regions.find((r) => r.id === drawingId);
    const t = drawT(scenario, drawingId, time, reduceMotion);
    if (!region || t <= 0) return beat.pointer;
    return {
      kind: "crosshair" as const,
      x: region.x + region.w * t,
      y: region.y + region.h * t,
    };
  }, [beat, scenario, time, reduceMotion, preview]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      <svg
        viewBox={`0 0 ${SLIDE_W} ${SLIDE_H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, display: "block" }}
        aria-hidden
      >
        {/* Shared centering group — same transform for every scenario/frame. */}
        <g
          transform={`translate(${COMPOSITION_OFFSET.x}, ${COMPOSITION_OFFSET.y})`}
        >
          {scenario.regions
            .slice()
            .sort((a, b) => a.createOrder - b.createOrder)
            .map((region) => {
              const t = drawT(scenario, region.id, time, reduceMotion);
              const isDrawing = beat.drawingRegionId === region.id;
              const isVisible =
                beat.visibleRegionIds.includes(region.id) || isDrawing || t > 0;
              if (!isVisible || t <= 0) return null;

              const w = isDrawing ? Math.max(region.w * t, 1) : region.w;
              const h = isDrawing ? Math.max(region.h * t, 1) : region.h;

              return (
                <RegionBox
                  key={region.id}
                  x={region.x}
                  y={region.y}
                  w={w}
                  h={h}
                  style={styleFor(region.id, beat)}
                  drawProgress={1}
                  zIndex={10 + region.createOrder}
                  reduceMotion={reduceMotion}
                />
              );
            })}

          {!preview && (
            <PointerPath
              x={pointer.x}
              y={pointer.y}
              kind={pointer.kind}
              reduceMotion={reduceMotion}
            />
          )}
        </g>
      </svg>

      {!preview && (
        <ExplanationCallout text={beat.caption} reduceMotion={reduceMotion} />
      )}
    </div>
  );
}
