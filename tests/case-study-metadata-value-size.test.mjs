import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const styles = await readFile(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);

test("Visual Craft metadata values are two pixels smaller without changing labels", () => {
  assert.match(
    styles,
    /\.chMetaValue\s*\{[^}]*font-size:\s*calc\(var\(--ch-text-body\)\s*-\s*1px\)/s,
  );
  assert.match(
    styles,
    /\.chMetaTagsList\s*\{[^}]*font-size:\s*calc\(var\(--ch-text-body\)\s*-\s*1px\)/s,
  );
  assert.match(
    styles,
    /\.chMetaLabel\s*\{[^}]*font-size:\s*var\(--ch-text-eyebrow\)/s,
  );
});
