import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("every Visual Craft hover layer keeps its logo source loaded", async () => {
  const source = await readFile(
    new URL("../components/Work.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /src=\{c\.logo \|\| c\.thumb\}/);
  assert.doesNotMatch(
    source,
    /src=\{i === activeIdx \? c\.logo \|\| c\.thumb : undefined\}/,
  );
});

test("Rolipoli uses its project-specific hover logo", async () => {
  const source = await readFile(
    new URL("../components/Work.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /rolipoli:\s*"\/rolipoli\/logo_rolipoli\.png"/);
});
