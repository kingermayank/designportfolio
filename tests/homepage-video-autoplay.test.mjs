import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const work = await readFile(
  new URL("../components/Work.tsx", import.meta.url),
  "utf8",
);
const deferredVideo = await readFile(
  new URL("../components/DeferredVideo.tsx", import.meta.url),
  "utf8",
);

test("homepage project videos autoplay even when reduced motion is enabled", () => {
  assert.match(
    work,
    /<DeferredVideo[\s\S]*?activation="eager"[\s\S]*?respectReducedMotion=\{false\}/,
  );
});

test("an early play rejection preserves autoplay intent for the canplay retry", () => {
  assert.match(deferredVideo, /onCanPlay=\{\(event\) => syncPlayback\(event\.currentTarget\)\}/);
  assert.doesNotMatch(
    deferredVideo,
    /video\.play\(\)\.catch\(\(\) => \{[\s\S]*?setPlaybackIntent\("paused"\)/,
  );
});
