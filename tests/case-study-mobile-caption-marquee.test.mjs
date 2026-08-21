import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [source, styles] = await Promise.all([
  readFile(new URL("../components/CaseStudies.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
]);

test("case-study media captions only duplicate when their text overflows", () => {
  assert.match(source, /function CaseCaptionTicker\(/);
  assert.match(source, /new ResizeObserver\(measure\)/);
  assert.match(source, /observer\.observe\(container\)/);
  assert.match(source, /observer\.observe\(label\)/);
  assert.match(source, /overflowing \? " is-overflowing" : ""/);
  assert.match(source, /overflowing \? \([\s\S]*csMediaHoverCaptionDuplicate/);
  assert.match(
    source,
    /<span className="csMediaHoverCaptionGap" aria-hidden\s*\/>/,
  );
  assert.doesNotMatch(
    source,
    /<span className="csMediaHoverCaptionGap" aria-hidden>\s*—/,
  );
});

test("every shared case-study hover caption uses the overflow ticker", () => {
  assert.equal(
    source.match(/<CaseCaptionTicker text=\{caption\} \/>/g)?.length,
    2,
  );
  assert.doesNotMatch(
    source,
    /<span className="csMediaHoverCaption">\{caption\}<\/span>/,
  );
});

test("mobile overflowing captions use 12px type and move right to left", () => {
  const mobileStart = styles.indexOf("@media (max-width: 900px)");
  assert.notEqual(mobileStart, -1);
  const mobileRules = styles.slice(mobileStart);

  assert.match(
    mobileRules,
    /\.csMediaHoverCaption\s*\{[^}]*font-size:\s*12px/s,
  );
  assert.match(
    mobileRules,
    /\.csMediaHoverCaption\.is-overflowing \.csMediaHoverCaptionTrack\s*\{[^}]*animation:\s*cs-caption-marquee-rtl/s,
  );
  assert.match(
    styles,
    /@keyframes cs-caption-marquee-rtl\s*\{[\s\S]*from\s*\{[^}]*translate3d\(0,[\s\S]*to\s*\{[^}]*translate3d\(calc\(-50% - 16px\)/s,
  );
});

test("case-study caption marquee is disabled for reduced motion", () => {
  assert.match(
    styles,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.csMediaHoverCaption\.is-overflowing \.csMediaHoverCaptionTrack\s*\{[^}]*animation:\s*none/s,
  );
});
