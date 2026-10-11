import { test } from "node:test";
import assert from "node:assert/strict";
import { isExtensionNoise } from "../lib/ignoreExtensionHydrationNoise.ts";

// React's console.error shape: explanation (with its own "- " bullets), url, diff.
const MESSAGE =
  "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:\n\n- A server/client branch `if (typeof window !== 'undefined')`.\n- Invalid HTML tag nesting.\n\n%s%s";
const report = (diff) => [MESSAGE, "https://react.dev/link/hydration-mismatch", diff];

test("compact form: client has no style, extension added clip-path", () => {
  const diff = `
    <div
      className="workHoverThumb"
+     style={undefined}
-     style={{clip-path:"path(\\"M 9..."}}
    >`;
  assert.equal(isExtensionNoise(report(diff)), true);
});

test("expanded form: injected clip-path and transparent borders inside style", () => {
  const diff = `
    <button
      className="intCopyBtn workFitBtn"
      style={{
-       clip-path: "path(\\"M 29.7 0 L 117.62 0 c 10.9314 0 16.397 0 20.4952 2.2951 a 18 18..."
-       border-top-color: "transparent"
-       border-right-color: "transparent"
-       border-bottom-color: "transparent"
-       border-left-color: "transparent"
      }}
    >`;
  assert.equal(isExtensionNoise(report(diff)), true);
});

test("compact form: client style kept, extension appended clip-path", () => {
  const diff = `
+     style={{opacity:"1"}}
-     style={{opacity:"1",clip-path:"path(\\"M 22 0..."}}`;
  assert.equal(isExtensionNoise(report(diff)), true);
});

test("real style difference still surfaces", () => {
  const diff = `
+     style={{opacity:"1"}}
-     style={{opacity:"0",clip-path:"path(\\"M 22 0..."}}`;
  assert.equal(isExtensionNoise(report(diff)), false);
});

test("real attribute mismatch alongside the extension still surfaces", () => {
  const diff = `
+     style={undefined}
-     style={{clip-path:"path(\\"M 9..."}}
+     title="client"
-     title="server"`;
  assert.equal(isExtensionNoise(report(diff)), false);
});

test("non-hydration errors are untouched", () => {
  assert.equal(isExtensionNoise(["Something else broke"]), false);
});

test("Next 16.2+: diff folded into the first argument or an Error", () => {
  const diff = `
    <div
      className="workHoverThumb"
+     style={undefined}
-     style={{clip-path:"path(\\"M 9..."}}
    >`;
  assert.equal(isExtensionNoise([`${MESSAGE}\n${diff}`]), true);
  assert.equal(isExtensionNoise([new Error(`${MESSAGE}\n${diff}`)]), true);
  // …while a genuine mismatch in that shape still surfaces.
  const real = `
+     className="a"
-     className="b"`;
  assert.equal(isExtensionNoise([`${MESSAGE}\n${real}`]), false);
});
