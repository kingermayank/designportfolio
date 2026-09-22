import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const styles = await readFile(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);

test("Visual Craft contact CTA matches the homepage CTA sizing", () => {
  assert.match(
    styles,
    /\.workFitBtn\s*\{[^}]*height:\s*36px;[^}]*padding:\s*0 20px;/s,
  );
  assert.match(
    styles,
    /\.chContactButton\s*\{[^}]*height:\s*36px;[^}]*padding:\s*0 20px;/s,
  );
  assert.match(
    styles,
    /@media \(max-width: 720px\)\s*\{[\s\S]*?\.workFitBtn\s*\{[^}]*min-height:\s*44px;[\s\S]*?\}/,
  );
  assert.match(
    styles,
    /@media \(max-width: 720px\)\s*\{[\s\S]*?\.chContactButton\s*\{[^}]*height:\s*44px;/,
  );
});

test("Visual Craft back control uses the secondary CTA treatment and natural width", () => {
  assert.match(
    styles,
    /\.chBack\s*\{[^}]*gap:\s*6px;[^}]*min-width:\s*44px;[^}]*height:\s*36px;[^}]*padding:\s*0 20px;[^}]*background:\s*#353535;[^}]*color:\s*#fafafa;/s,
  );
  assert.match(styles, /\.chBack:hover\s*\{[^}]*background:\s*#4a4a4a;/s);
  assert.doesNotMatch(styles, /\.chBack\s*\{[^}]*width:\s*148px;/s);
  assert.match(
    styles,
    /@media \(max-width: 720px\)\s*\{[\s\S]*?\.chBack,[\s\S]*?\.chContactButton\s*\{[^}]*height:\s*44px;/,
  );
});
