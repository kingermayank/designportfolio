import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const [styles, modal, data] = await Promise.all([
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  readFile(new URL("../components/EngDetailModal.tsx", import.meta.url), "utf8"),
  readFile(new URL("../lib/workLenses.ts", import.meta.url), "utf8"),
]);

test("engineering website call-to-action buttons are fully rounded", () => {
  assert.match(styles, /\.engModalCta\s*\{[^}]*border-radius: var\(--radius-pill\)/);
  assert.match(styles, /\.engModalCta\s*\{[^}]*height: 36px;[^}]*padding: 0 20px;[^}]*font-size: 14px/);
});

test("Warpbnb process assets exist and follow the requested order", async () => {
  const warp = data.slice(data.indexOf('id: "warpbnb-site"'), data.indexOf('id: "agave-site"'));
  let previous = -1;
  for (const file of ["storybook.mp4", "figma-screens.mp4", "icons.png", "prompt-arch.png", "automation-fail.png", "voiceover.png", "commercial.png"]) {
    const index = warp.indexOf(`/warpbnb/archive/${file}`);
    assert.ok(index > previous);
    previous = index;
    await access(new URL(`../public/warpbnb/archive/${file}`, import.meta.url));
  }
  assert.match(warp, /title: "Process breakdown"/);
  assert.match(warp, /body: "I took Warpbnb from Figma to code with Magicpath and Cursor/);
  assert.equal((warp.match(/plainMedia: true/g) || []).length, 7);
  assert.equal((warp.match(/title:/g) || []).length, 2);
  assert.match(modal, /<DeferredVideo[^>]*activation="eager" floatingControls/);
  assert.match(styles, /\.engModalBody:has\(> \.engModalMediaSection\)\s*\{\s*gap: 8px/);
  assert.match(styles, /\.engModalProcessSection \+ \.engModalMediaSection\s*\{\s*margin-top: 16px/);
  assert.match(styles, /\.engModalContentSection\.engModalMediaSection\s*\{[^}]*padding-top: 0;[^}]*border-top: 0/);
  assert.match(modal, /className="engModalContentImage"[^>]*alt=\{block.alt\}[^>]*loading="lazy"/);
});

test("engineering details share Product Strategy's right-side panel and close control", () => {
  assert.match(modal, /sysOverlay engDetailOverlay/);
  assert.match(modal, /className="sysOverlayStage"/);
  assert.match(modal, /className="sysOverlaySheet engModal engDetailSheet"/);
  assert.match(modal, /className="sysOverlayClose engDetailClose"/);
  assert.match(styles, /\.engDetailOverlay \.engDetailSheet\s*\{[^}]*height: 100%;[^}]*animation: none;/);
  assert.match(styles, /\.engDetailOverlay \.engDetailSheet\s*\{[^}]*display: block;[^}]*overflow-y: auto/);
  assert.match(styles, /\.engDetailOverlay \.engModalBody\s*\{[^}]*overflow: visible/);
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
  assert.match(agave, /title: "Process breakdown"/);
  assert.match(agave, /body: "As part of my prompt-driven workflow to generate multiple iterations, I used a mix of Paper and Claude/);
  assert.match(modal, /block.id === "paper-board" \? "sysOverlaySectionLabel"/);
  assert.match(modal, /className="sysOverlaySectionBody">\{block.body\}/);
  assert.match(styles, /\.engModalProcessSection\s*\{\s*gap: 8px/);
  assert.match(styles, /\.engModalProcessSection \.engModalContentFrame\s*\{\s*margin-top: 16px/);
  const board = agave.slice(agave.indexOf('id: "paper-board"'));
  assert.doesNotMatch(board, /href:|linkLabel:/);
});

test("engineering stack chips sit below the title, outside the preview", () => {
  const chips = modal.indexOf('className="sysOverlayTags engModalStack"');
  assert.match(modal, /item.tools.map\(\(tool\)/);
  assert.match(modal, /className="engModalToolIcon" src=\{tool.logo\} alt=""/);
  assert.match(modal, /aria-label="Tools used"/);
  assert.doesNotMatch(modal, /item.stack.map/);
  assert.match(modal, /<a href=\{tool.href\} target="_blank" rel="noopener noreferrer"/);
  assert.match(data, /name: "Mobbin MCP",[^}]*href: "https:\/\/mobbin.com\/mcp"/);
  assert.match(data, /name: "Claude Code",[^}]*href: "https:\/\/claude.com\/product\/claude-code"/);
  assert.ok(chips > modal.indexOf('className="engModalTitle"'));
  assert.ok(chips < modal.indexOf('className="engModalBody"'));
  assert.match(modal, /viewBox="0 0 12 12"[\s\S]*?M1\.5 1\.5l9 9M10\.5 1\.5l-9 9/);
});

test("all descriptions are uncapped and content embeds share preview radius", () => {
  assert.match(styles, /\.engModalLead\s*\{[^}]*max-width: none/);
  assert.match(styles, /\.engModalContentFrame\s*\{[^}]*height: 600px;[^}]*border-radius: var\(--radius-md\)/);
  assert.match(styles, /\.engModalStage\s*\{[^}]*border-radius: var\(--radius-md\)/);
});

test("website CTA sits beside the title and descriptions end in one divider", () => {
  const header = modal.slice(modal.indexOf('<header className="engModalHead"'), modal.indexOf('</header>'));
  const summary = modal.slice(modal.indexOf('className="engModalMeta"'), modal.indexOf('item.content?.map'));
  assert.match(header, /engModalTitleRow[\s\S]*engModalCta/);
  assert.doesNotMatch(summary, /engModalCta/);
  assert.match(styles, /\.engModalMeta\s*\{[^}]*border-bottom: 1px solid var\(--color-border\)/);
  assert.match(styles, /\.engModalMeta \+ \.engModalContentSection\s*\{[^}]*border-top: 0/);
});
