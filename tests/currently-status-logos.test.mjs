import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("every active About status pairs its software with a logo", async () => {
  const data = await readFile(
    new URL("../lib/currentlyStatus.ts", import.meta.url),
    "utf8",
  );
  const component = await readFile(
    new URL("../components/CurrentlyStatus.tsx", import.meta.url),
    "utf8",
  );

  for (const logo of [
    "airtable",
    "arena",
    "heyclicky",
    "chatgpt",
    "cursor",
    "figjam",
    "flora",
    "gsap",
    "jitter",
    "notion",
    "npm",
    "paper",
    "raycast",
    "rive",
    "spotify",
    "strava",
    "vercel",
  ]) {
    assert.match(data, new RegExp(`logo:\\s*"/all-logos/${logo}\\.png"`));
  }

  for (const removedLogo of ["reve", "weave", "mixpanel"]) {
    assert.doesNotMatch(
      data,
      new RegExp(`logo:\\s*"/all-logos/${removedLogo}\\.png"`),
    );
  }

  assert.match(component, /currentlySoftwareLogo/);
  assert.match(component, /src=\{logo\}/);
  assert.doesNotMatch(component, /<\/span>\s*\.\s*<\/span>/);
});

test("About status logos use four-pixel smoothed corners", async () => {
  const styles = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(styles, /\.currentlySoftwareLogo\s*\{/);
  assert.match(styles, /border-radius:\s*4px/);
  assert.match(styles, /corner-shape:\s*squircle/);
});

test("dark About status logos use a padded white tile", async () => {
  const data = await readFile(
    new URL("../lib/currentlyStatus.ts", import.meta.url),
    "utf8",
  );
  const component = await readFile(
    new URL("../components/CurrentlyStatus.tsx", import.meta.url),
    "utf8",
  );
  const styles = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  for (const software of ["ChatGPT", "Strava", "Are.na"]) {
    assert.match(
      data,
      new RegExp(`software:\\s*"${software.replace(".", "\\.")}"[\\s\\S]*?needsLightTile:\\s*true`),
    );
  }

  assert.match(component, /needsLightTile\s*\?\s*" is-on-light"/);
  assert.match(
    styles,
    /\.currentlySoftwareLogo\.is-on-light\s*\{[^}]*background:\s*#fff[^}]*padding:\s*3px/s,
  );
});
