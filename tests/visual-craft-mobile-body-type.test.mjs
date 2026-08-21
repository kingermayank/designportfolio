import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [source, styles] = await Promise.all([
  readFile(new URL("../components/CaseStudies.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
]);

test("Visual Craft overview and impact copy is 8px smaller on mobile", () => {
  assert.match(
    source,
    /isVisualCraft\(study\) \? " csEditorialIntroVisual" : ""/,
  );

  const mobileStart = styles.indexOf("@media (max-width: 900px)");
  assert.notEqual(mobileStart, -1);
  const mobileRules = styles.slice(mobileStart);

  assert.match(
    mobileRules,
    /\.csEditorialIntroVisual \.csEditorialOverview p\s*\{[^}]*font-size:\s*16px;[^}]*line-height:\s*22px;/s,
  );
  assert.match(
    mobileRules,
    /\.csEditorialImpactVisual > p\s*\{[^}]*font-size:\s*27px;[^}]*line-height:\s*32px;/s,
  );
});
