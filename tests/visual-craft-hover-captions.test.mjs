import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Visual Craft hover captions use the original case-study tagline", async () => {
  const source = await readFile(
    new URL("../components/Work.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /tagline:\s*s\.tagline,/);
  assert.doesNotMatch(
    source,
    /tagline:\s*s\.workCaption\s*\?\?\s*s\.tagline,/,
  );
});
