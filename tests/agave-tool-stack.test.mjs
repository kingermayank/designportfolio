import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const [data, source, styles] = await Promise.all([
  readFile(new URL("../lib/workLenses.ts", import.meta.url), "utf8"),
  readFile(new URL("../components/Work.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
]);

test("Agave displays Paper and Cursor process tool logos", async () => {
  const agave = data.slice(data.indexOf('id: "agave-site"'), data.indexOf('id: "f1-sim"'));
  assert.ok(!agave.includes('name: "Vercel"'));
  for (const [name, file] of [["Paper", "paper-2.jpg"], ["Cursor", "cursor-2.png"]]) {
    assert.ok(agave.includes(`name: "${name}"`));
    assert.ok(agave.includes(`logo: "/all-logos/${file}"`));
    await access(new URL(`../public/all-logos/${file}`, import.meta.url));
  }
  assert.match(source, /className="engCardTitleRow"[\s\S]*?className="engCardTools"/);
  assert.match(source, /aria-label=\{`Tools used:/);
});

test("tool logos expand with a four-pixel gap and subtle hover elevation", () => {
  assert.match(styles, /width: 16px;[\s\S]*?var\(--tool-index\) \* 14px/);
  assert.match(styles, /\.engCardTitleRow\s*\{[^}]*gap: 6px/);
  assert.match(source, /zIndex: index \+ 1/);
  assert.match(styles, /\.engCard:hover \.engCardTool\s*\{[^}]*transform: translateX\(calc\(4px \+ var\(--tool-index\) \* 20px\)\)/);
  assert.match(styles, /\.engCard:hover \.engCardTool\s*\{[^}]*box-shadow:[^}]*255 255 255 \/ 8%/);
  assert.match(styles, /\.engCard:focus-visible \.engCardTool/);
  assert.match(styles, /@media \(hover: none\)[\s\S]*?2px \+ var\(--tool-index\) \* 20px/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.engCardTool\s*\{[^}]*transition: none/);
});

test("project tool logos default to sixteen pixels with Cursor at seventeen", () => {
  assert.match(styles, /\.engCardTool\s*\{[^}]*width: 16px;[^}]*height: 16px/);
  assert.match(styles, /\.engCardTool:has\(img\[src\$="cursor-2\.png"\]\)\s*\{[^}]*width: 17px;[^}]*height: 17px/);
  assert.doesNotMatch(styles, /\.engCardTool:has\([^}]*width: 19px/);
});

test("Sketchfab's transparent corners use its matching blue tile background", () => {
  assert.match(styles, /\.engCardTool:has\(img\[src\$="sketchfab\.png"\]\)\s*\{[^}]*background: #1aaad9/);
});

test("tool tiles use five-pixel corners with progressive squircle smoothing", () => {
  assert.match(styles, /\.engCardTool\s*\{[^}]*border-radius: 5px/);
  assert.match(styles, /@supports \(corner-shape: squircle\)\s*\{[\s\S]*?\.engCardTool::after\s*\{[^}]*corner-shape: squircle/);
});
