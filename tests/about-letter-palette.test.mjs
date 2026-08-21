import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the hiring-manager envelope uses the warm letter palette", async () => {
  const source = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(source, /--env-paper:\s*#f0eadf/);
  assert.match(source, /--env-letter-top:\s*#fbf8f1/);
  assert.match(source, /--env-letter-bottom:\s*#e8dfd0/);
  assert.match(source, /--env-fold-shadow:\s*rgba\(0,\s*0,\s*0,\s*0\.16\)/);
  assert.match(
    source,
    /background:\s*linear-gradient\(180deg,\s*var\(--env-letter-top\)\s*0%,\s*var\(--env-letter-bottom\)\s*100%\)/,
  );
});

test("the hiring-manager envelope includes a red wax seal", async () => {
  const component = await readFile(
    new URL("../components/AboutContent.tsx", import.meta.url),
    "utf8",
  );
  const styles = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(component, /className="aboutEnvelopeSeal">MK<\/span>/);
  assert.match(styles, /\.aboutEnvelopeSeal\s*\{/);
  assert.match(styles, /--env-seal:\s*#a52b2b/);
});
