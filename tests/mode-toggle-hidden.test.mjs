import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the work and grid mode toggle is hidden", async () => {
  const styles = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  const baseRule = styles.match(/\.modeToggle\s*\{([^}]*)\}/)?.[1] ?? "";

  assert.match(baseRule, /display:\s*none/);
});
