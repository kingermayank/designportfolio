import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [engSource, styles] = await Promise.all([
  readFile(new URL("../components/EngDetailModal.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
]);

test("Design Engineering previews fill a viewport-capped, scrollable frame", () => {
  assert.match(engSource, /className="engModalFrameViewport"/);
  assert.match(engSource, /const FRAME_W = 1440;/);
  assert.match(engSource, /const FRAME_H = 1440;/);
  assert.match(
    engSource,
    /const \{ clientWidth: width, clientHeight: height \} = el;[\s\S]*const scale = width \/ FRAME_W;[\s\S]*setFrameScale\(scale\);[\s\S]*setFrameHeight\(height \/ scale\);/,
  );

  assert.match(
    styles,
    /@media \(max-width: 720px\)\s*\{[\s\S]*?\.engModal\s*\{[^}]*height:\s*calc\(100dvh - 24px\);/,
  );
  assert.match(
    styles,
    /\.engModalBody\s*\{[^}]*overflow-x:\s*hidden;[^}]*overflow-y:\s*auto;[^}]*overscroll-behavior:\s*contain;/s,
  );
  assert.match(
    styles,
    /\.engModalStageWrap\s*\{[^}]*flex:\s*0 0 auto;/s,
  );
  assert.match(
    styles,
    /\.engModalStage\s*\{[^}]*flex:\s*none;[^}]*width:\s*100%;[^}]*aspect-ratio:\s*1;[^}]*max-height:\s*calc\(100dvh - 13rem\);/s,
  );
  assert.match(
    styles,
    /\.engModalFrameViewport\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0;[^}]*display:\s*flex;[^}]*justify-content:\s*center;[^}]*align-items:\s*flex-start;/s,
  );
  assert.match(
    styles,
    /\.engModalFrame\s*\{[^}]*flex:\s*0 0 var\(--eng-frame-w, 1440px\);[^}]*width:\s*var\(--eng-frame-w, 1440px\);[^}]*height:\s*var\(--eng-frame-h, 1440px\);/s,
  );
  assert.match(
    styles,
    /@media \(max-width: 720px\)\s*\{[\s\S]*?\.engModalStage\s*\{[^}]*aspect-ratio:\s*1;[^}]*height:\s*auto;/,
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
