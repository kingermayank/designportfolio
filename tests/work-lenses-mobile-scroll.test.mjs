import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const styles = await readFile(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);

function mediaRules(query, selector) {
  const opening = `@media (${query}) {`;
  let searchFrom = 0;

  while (searchFrom < styles.length) {
    const start = styles.indexOf(opening, searchFrom);
    if (start === -1) break;

    let depth = 1;
    for (
      let index = start + opening.length;
      index < styles.length;
      index += 1
    ) {
      if (styles[index] === "{") depth += 1;
      if (styles[index] === "}") depth -= 1;
      if (depth === 0) {
        const rules = styles.slice(start + opening.length, index);
        if (rules.includes(selector)) return rules;
        searchFrom = index + 1;
        break;
      }
    }
  }

  return undefined;
}

test("mobile work lenses stay in one horizontally scrollable row", () => {
  const mobileRules = mediaRules("max-width: 720px", ".workLenses");

  assert.ok(mobileRules, "expected the 720px mobile breakpoint");
  assert.match(mobileRules, /\.workLenses\s*\{[^}]*flex-wrap:\s*nowrap/s);
  assert.match(mobileRules, /\.workLenses\s*\{[^}]*gap:\s*16px 26px/s);
  assert.match(mobileRules, /\.workLenses\s*\{[^}]*overflow-x:\s*auto/s);
  assert.match(mobileRules, /\.workLens\s*\{[^}]*flex:\s*0 0 auto/s);
  assert.match(mobileRules, /\.workLens\s*\{[^}]*white-space:\s*nowrap/s);
});

test("work lenses expose comfortable touch targets without changing label spacing", () => {
  assert.match(styles, /\.workLens\s*\{[^}]*min-height:\s*44px/s);
  assert.match(
    styles,
    /\.workLens\s*\{[^}]*margin-block:\s*calc\(\(1\.2em - 44px\) \/ 2\)/s,
  );
  assert.match(styles, /\.workLens\s*\{[^}]*margin-inline:\s*-8px/s);
  assert.match(styles, /\.workLens\s*\{[^}]*padding:\s*0 8px/s);
  assert.match(styles, /\.workLens\s*\{[^}]*touch-action:\s*manipulation/s);

  const mobileRules = mediaRules("max-width: 720px", ".workLenses");
  const phoneRules = mediaRules("max-width: 400px", ".workLenses");

  assert.match(mobileRules, /\.workLens\s*\{[^}]*padding-inline:\s*4px/s);
  assert.match(phoneRules, /\.workLens\s*\{[^}]*padding-inline:\s*3px/s);
});

test("mobile work lenses match the 15px intro copy and use the requested spacing", () => {
  const narrowRules = mediaRules("max-width: 560px", ".workLenses");
  const phoneRules = mediaRules("max-width: 400px", ".workLenses");

  assert.ok(narrowRules, "expected the 560px breakpoint");
  assert.ok(phoneRules, "expected the 400px breakpoint");
  assert.match(narrowRules, /\.workLenses\s*\{[^}]*gap:\s*12px 16px/s);
  assert.match(narrowRules, /\.workLens\s*\{[^}]*font-size:\s*15px/s);
  assert.match(phoneRules, /\.workLenses\s*\{[^}]*gap:\s*10px 14px/s);
  assert.match(phoneRules, /\.workLens\s*\{[^}]*font-size:\s*15px/s);
});
