import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the shared footer is forty percent of its former height", async () => {
  const styles = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(
    styles,
    /\.siteFooter\s*\{[^}]*padding:\s*8px 24px max\(8px, env\(safe-area-inset-bottom\)\)/s,
  );
});
