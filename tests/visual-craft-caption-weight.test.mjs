import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const styles = await readFile(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);

test("Visual Craft company names use weight 600 while taglines remain regular", () => {
  assert.match(
    styles,
    /\.workCardName\s*\{[^}]*font-weight:\s*600/s,
  );
  assert.match(
    styles,
    /\.workCardTagline\s*\{[^}]*font-weight:\s*400/s,
  );
  assert.doesNotMatch(styles, /\.workUniform \.workCardName,/);
});
