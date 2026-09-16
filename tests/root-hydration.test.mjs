import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");

test("extension-injected root attributes are tolerated without suppressing page hydration", () => {
  assert.match(layout, /<html\s[\s\S]*?suppressHydrationWarning[\s\S]*?>/);
  assert.equal((layout.match(/suppressHydrationWarning/g) || []).length, 1);
  assert.doesNotMatch(layout, /data-scribe-recorder-ready/);
  assert.doesNotMatch(layout, /<body[^>]*suppressHydrationWarning/);
});
