import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [component, styles] = await Promise.all([
  readFile(new URL("../components/Work.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
]);

test("Visual Craft thumbnails no longer render the top-right arrow", () => {
  assert.doesNotMatch(component, /workCardArrow/);
  assert.doesNotMatch(styles, /\.workCardArrow/);
});

test("Visual Craft media zooms by five percent on hover and focus", () => {
  assert.match(
    styles,
    /\.workCardMedia\s*\{[^}]*transition:\s*transform 167ms ease-out/s,
  );
  assert.match(
    styles,
    /\.workCard:not\(\.workCardStatic\):hover\s+\.workCardMedia,[\s\S]*\.workCard:not\(\.workCardStatic\):focus-visible\s+\.workCardMedia\s*\{[^}]*transform:\s*scale\(1\.05\)/s,
  );
});

test("Visual Craft media zoom is disabled when reduced motion is requested", () => {
  assert.match(
    styles,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.workCard:not\(\.workCardStatic\):hover\s+\.workCardMedia,[\s\S]*\.workCard:not\(\.workCardStatic\):focus-visible\s+\.workCardMedia\s*\{[^}]*transform:\s*none/s,
  );
});
