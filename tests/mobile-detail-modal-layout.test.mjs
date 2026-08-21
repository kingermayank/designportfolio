import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [engSource, styles] = await Promise.all([
  readFile(new URL("../components/EngDetailModal.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
]);

test("the mobile Design Engineering modal contains a fitted 4:3 preview", () => {
  assert.match(engSource, /className="engModalFrameViewport"/);
  assert.match(
    engSource,
    /const mobileViewport = window\.matchMedia\("\(max-width: 720px\)"\)\.matches;/,
  );
  assert.match(
    engSource,
    /mobileViewport\s*\?\s*Math\.min\(w \/ FRAME_W, h \/ FRAME_H\)\s*:\s*Math\.max\(w \/ FRAME_W, h \/ FRAME_H\)/s,
  );

  assert.match(
    styles,
    /@media \(max-width: 720px\)\s*\{[\s\S]*?\.engModal\s*\{[^}]*height:\s*calc\(100dvh - 24px\);/,
  );
  assert.match(
    styles,
    /@media \(max-width: 720px\)\s*\{[\s\S]*?\.engModalBody\s*\{[^}]*gap:\s*var\(--space-3\);[^}]*overflow-y:\s*auto;/,
  );
  assert.match(
    styles,
    /@media \(max-width: 720px\)\s*\{[\s\S]*?\.engModalStageWrap\s*\{[^}]*flex:\s*0 0 auto;/,
  );
  assert.match(
    styles,
    /@media \(max-width: 720px\)\s*\{[\s\S]*?\.engModalStage\s*\{[^}]*aspect-ratio:\s*4 \/ 3;[^}]*height:\s*auto;/,
  );
  assert.match(
    styles,
    /\.engModalFrameViewport\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0;[^}]*display:\s*flex;[^}]*justify-content:\s*center;[^}]*align-items:\s*flex-start;/s,
  );
  assert.match(
    styles,
    /@media \(max-width: 720px\)\s*\{[\s\S]*?\.engModalFrameViewport\s*\{[^}]*align-items:\s*center;/,
  );
  assert.match(
    styles,
    /@media \(max-width: 720px\)\s*\{[\s\S]*?\.engModalFrame\s*\{[^}]*transform-origin:\s*center;/,
  );
});

test("the mobile Product Thinking sheet scrolls and uses a 4px smaller title", () => {
  assert.match(
    styles,
    /\.sysOverlaySheet\s*\{[^}]*overflow-x:\s*hidden;[^}]*overflow-y:\s*auto;[^}]*overscroll-behavior:\s*contain;/s,
  );
  assert.match(
    styles,
    /@media \(max-width: 900px\)\s*\{[\s\S]*?\.sysOverlayHeadline\s*\{[^}]*font-size:\s*28px;[^}]*line-height:\s*32px;/,
  );
});
