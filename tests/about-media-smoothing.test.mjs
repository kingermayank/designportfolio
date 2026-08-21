import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const styles = await readFile(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);

test("About podcast artwork uses squircle corner smoothing", () => {
  assert.match(
    styles,
    /\.aboutPodArt\s*\{[^}]*corner-shape:\s*squircle/s,
  );
});

test("About career marks use squircle corner smoothing", () => {
  assert.match(
    styles,
    /\.aboutCareerMark\s*\{[^}]*corner-shape:\s*squircle/s,
  );
});

test("the podcast viewport leaves room for the hover shadow", () => {
  assert.match(
    styles,
    /\.aboutPodViewport\s*\{[^}]*padding:\s*12px 0 40px/s,
  );
});
