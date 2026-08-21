import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [source, styles] = await Promise.all([
  readFile(new URL("../components/CaseStudies.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
]);

test("Visual Craft impact copy uses the full mobile content width", () => {
  assert.match(
    source,
    /isVisualCraft\(study\) \? " csEditorialImpactVisual" : ""/,
  );

  const mobileStart = styles.indexOf("@media (max-width: 900px)");
  assert.notEqual(mobileStart, -1);
  const mobileRules = styles.slice(mobileStart);

  assert.match(
    mobileRules,
    /\.csEditorialImpactVisual > p\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*none;/s,
  );
});
