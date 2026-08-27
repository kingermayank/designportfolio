import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const styles = await readFile(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);

const socialMenuSource = await readFile(
  new URL("../components/SocialMenu.tsx", import.meta.url),
  "utf8",
);

const workSource = await readFile(
  new URL("../components/Work.tsx", import.meta.url),
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
  assert.match(mobileRules, /\.workLenses\s*\{[^}]*gap:\s*16px 30px/s);
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
  assert.match(narrowRules, /\.workLenses\s*\{[^}]*gap:\s*12px 20px/s);
  assert.match(narrowRules, /\.workLens\s*\{[^}]*font-size:\s*15px/s);
  assert.match(phoneRules, /\.workLenses\s*\{[^}]*gap:\s*10px 18px/s);
  assert.match(phoneRules, /\.workLens\s*\{[^}]*font-size:\s*15px/s);
});

test("Visual Craft is the default lens and mobile inactive labels share one color", () => {
  const mobileRules = mediaRules("max-width: 720px", ".workLenses");

  assert.match(
    workSource,
    /useState<WorkLensId>\(initialLens \?\? "visual"\)/,
  );
  assert.match(
    mobileRules,
    /\.workLens:not\(\.on\),\s*\.workLens:not\(\.on\):hover\s*\{[^}]*color:\s*var\(--faint\)/s,
  );
});

test("mobile intro adds 16px before the work lenses", () => {
  const mobileRules = mediaRules("max-width: 900px", ".workPanel");

  assert.ok(mobileRules, "expected the 900px mobile breakpoint");
  assert.match(
    mobileRules,
    /\.workPanel\s*\{[^}]*padding:[\s\S]*calc\(var\(--space-3\) \+ var\(--space-4\)\)/,
  );
});

test("mobile social menu uses a staged flow-out with reduced-motion support", () => {
  assert.match(socialMenuSource, /ANIMATION STORYBOARD/);
  assert.match(socialMenuSource, /const \[stage, setStage\] = useState\(0\)/);
  assert.match(socialMenuSource, /const reduceMotion = useReducedMotion\(\)/);
  assert.match(
    socialMenuSource,
    /clipPath: open \? MENU_SHELL\.openClip : MENU_SHELL\.closedClip/,
  );
  assert.doesNotMatch(socialMenuSource, /clipPath:[^}]+scale:/s);
  assert.match(socialMenuSource, /index \* MENU_LINKS\.stagger/);
  assert.match(
    styles,
    /\.socialMenuPanel\s*\{[^}]*top:\s*calc\(100% \+ 8px\);[^}]*min-width:\s*220px;[^}]*padding:\s*8px;[^}]*border-radius:\s*8px !important;[^}]*transform:\s*none !important/s,
  );
});
