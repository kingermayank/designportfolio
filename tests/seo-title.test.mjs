import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the homepage SEO title is only Mayank Kinger", async () => {
  const source = await readFile(
    new URL("../lib/seo.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /DEFAULT_TITLE\s*=\s*"Mayank Kinger"/);
});
