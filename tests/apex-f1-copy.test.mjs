import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(
  new URL("../lib/workLenses.ts", import.meta.url),
  "utf8",
);

test("Apex F1 is presented as a playable 3D game", () => {
  const start = source.indexOf('id: "f1-sim"');
  const end = source.indexOf('id: "keytag-3d"');
  const apex = source.slice(start, end);

  assert.match(apex, /title: "Apex F1"/);
  assert.match(apex, /kind: "3D Game"/);
  assert.match(apex, /body: "Play the 2026 Chinese Grand Prix/);
  assert.match(apex, /deterministic race engine/);
  assert.doesNotMatch(apex, /APEX F1 Sim|3D Simulation|Watch the Chinese Grand Prix/);
});
