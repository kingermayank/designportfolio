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

test("only the first homepage video loads eagerly; other cards keep their posters", () => {
  assert.match(
    work,
    /<DeferredVideo[\s\S]*?activation=\{priority \? "eager" : "visible"\}[\s\S]*?respectReducedMotion=\{false\}[\s\S]*?posterPriority=\{priority\}/,
  );
});

test("an early play rejection preserves autoplay intent for the canplay retry", () => {
  assert.match(deferredVideo, /onCanPlay=\{\(event\) => syncPlayback\(event\.currentTarget\)\}/);
  assert.doesNotMatch(
    deferredVideo,
    /video\.play\(\)\.catch\(\(\) => \{[\s\S]*?setPlaybackIntent\("paused"\)/,
  );
});
