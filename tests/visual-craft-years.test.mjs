import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Visual Craft shows the requested project years", async () => {
  const source = await readFile(
    new URL("../components/Work.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /toolbox:\s*2026/);
  assert.match(source, /warpbnb:\s*2026/);
  assert.match(source, /rolipoli:\s*2023/);
  assert.match(source, /year:\s*VISUAL_CRAFT_YEAR_BY_SLUG\[s\.slug\]\s*\?\?\s*s\.year/);
});
