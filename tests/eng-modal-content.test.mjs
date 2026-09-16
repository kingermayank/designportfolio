import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [styles, modal, data] = await Promise.all([
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  readFile(new URL("../components/EngDetailModal.tsx", import.meta.url), "utf8"),
  readFile(new URL("../lib/workLenses.ts", import.meta.url), "utf8"),
]);

test("engineering details share Product Strategy's right-side panel and close control", () => {
  assert.match(modal, /sysOverlay engDetailOverlay/);
  assert.match(modal, /className="sysOverlayStage"/);
  assert.match(modal, /className="sysOverlaySheet engModal engDetailSheet"/);
  assert.match(modal, /className="sysOverlayClose engDetailClose"/);
  assert.match(styles, /\.engDetailOverlay \.engDetailSheet\s*\{[^}]*height: 100%;[^}]*animation: none;/);
  assert.match(styles, /@media \(min-width: 721px\)[\s\S]*?\.engModalBody\s*\{[^}]*overflow-y: auto;/);
});

test("engineering project content follows the summary and supports text, video, and embeds", () => {
  assert.ok(modal.indexOf("item.content?.map") > modal.indexOf('className="engModalMeta"'));
  assert.match(modal, /block.type === "text"/);
  assert.match(modal, /block.type === "video"/);
  assert.match(modal, /controls playsInline preload="metadata"/);
  assert.match(modal, /className="engModalContentFrame"[^>]*height="600"[^>]*loading="lazy"/);
});

test("desktop live previews retain their rectangular logical viewport proportions", () => {
  assert.match(styles, /@media \(min-width: 721px\)[\s\S]*?\.engModalStage\s*\{[^}]*aspect-ratio: 1440 \/ 900;[^}]*height: auto;/);
  assert.doesNotMatch(styles, /height: clamp\(360px, calc\(100dvh - 240px\), 680px\)/);
});

test("Agave includes the renamed Paper board without an outbound link", () => {
  const agave = data.slice(data.indexOf('id: "agave-site"'), data.indexOf('id: "f1-sim"'));
  assert.match(agave, /content: \[/);
  assert.match(agave, /src: "https:\/\/app.paper.design\/file\/01KYASAGY134T3WXWFBZRYXGEM\/2-0"/);
  assert.match(agave, /title: "AI-Assisted Prototyping in Paper"/);
  const board = agave.slice(agave.indexOf('id: "paper-board"'));
  assert.doesNotMatch(board, /href:|linkLabel:/);
});

test("engineering stack chips sit below the title, outside the preview", () => {
  const chips = modal.indexOf('className="sysOverlayTags engModalStack"');
  assert.ok(chips > modal.indexOf('className="engModalTitle"'));
  assert.ok(chips < modal.indexOf('className="engModalBody"'));
  assert.match(modal, /viewBox="0 0 12 12"[\s\S]*?M1\.5 1\.5l9 9M10\.5 1\.5l-9 9/);
});

test("descriptions without a CTA are uncapped and content embeds share preview radius", () => {
  assert.match(styles, /\.engModalMeta:not\(:has\(\.engModalCta\)\) \.engModalLead\s*\{[^}]*max-width: none/);
  assert.match(styles, /\.engModalContentFrame\s*\{[^}]*height: 600px;[^}]*border-radius: var\(--radius-md\)/);
  assert.match(styles, /\.engModalStage\s*\{[^}]*border-radius: var\(--radius-md\)/);
});

test("desktop engineering descriptions have forty pixels more width allowance", () => {
  assert.match(styles, /@media \(min-width: 901px\)\s*\{\s*\.engModalLead\s*\{[^}]*max-width: calc\(46ch \+ 40px\)/);
});
