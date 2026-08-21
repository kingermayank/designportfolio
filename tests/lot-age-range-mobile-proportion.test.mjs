import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [source, styles] = await Promise.all([
  readFile(
    new URL("../components/toolbox/LotAgeRangeEmbed.tsx", import.meta.url),
    "utf8",
  ),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
]);

test("the Lot Age Range embed preserves its desktop composition when space narrows", () => {
  assert.match(source, /className="lotAgeRangeFrame"/);
  assert.doesNotMatch(source, /width:\s*"100%"/);
  assert.doesNotMatch(source, /maxWidth:\s*836/);

  assert.match(
    styles,
    /\.lotAgeRangeFrame\s*\{[^}]*width:\s*836px;[^}]*flex:\s*0 0 836px;[^}]*transform:\s*scale\(min\(1, calc\(100cqw \/ 836px\)\)\);[^}]*transform-origin:\s*center;/s,
  );
});

test("the Lot Age Range embed keeps a 24px gutter on both mobile sides", () => {
  assert.match(
    styles,
    /@media \(max-width: 900px\)\s*\{[\s\S]*?\.lotAgeRangeFrame\s*\{[^}]*transform:\s*scale\(min\(1, calc\(\(100cqw - 48px\) \/ 836px\)\)\);/,
  );
});
