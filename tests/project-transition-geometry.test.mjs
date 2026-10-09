import assert from "node:assert/strict";
import test from "node:test";
import { clipBox, fitMedia, motionEase, transitionFrame, PROJECT_DURATION } from "../lib/projectTransitionGeometry.ts";

const cases = [
  { name: "desktop top card", viewport: { x: 0, y: 0, width: 1440, height: 900, radius: 0 }, card: { x: 440, y: 72, width: 480, height: 560, radius: 6 } },
  { name: "lower desktop card", viewport: { x: 0, y: 0, width: 1440, height: 900, radius: 0 }, card: { x: 930, y: 620, width: 480, height: 360, radius: 6 } },
  { name: "partially scrolled mobile card", viewport: { x: 0, y: 0, width: 390, height: 844, radius: 0 }, card: { x: 16, y: -120, width: 358, height: 450, radius: 6 } },
];

for (const { name, viewport, card } of cases) {
  const cover = { x: 8, y: 8, width: viewport.width - 16, height: viewport.height - 16, radius: 16 };
  const start = fitMedia(1600, 1000, [0.5, 0.5], card);
  const end = fitMedia(1600, 1000, [0.5, 0.5], cover);
  const frame = seconds => transitionFrame(card, start, cover, end, viewport, seconds);

  test(`${name}: exact start and end geometry`, () => {
    assert.deepEqual(frame(0).media, card);
    assert.deepEqual(frame(0).pose, start);
    assert.deepEqual(frame(PROJECT_DURATION).media, cover);
    assert.deepEqual(frame(PROJECT_DURATION).background, viewport);
    assert.equal(frame(PROJECT_DURATION).pose.y, viewport.height);
  });

  test(`${name}: slide and corner radius stay continuous in both directions`, () => {
    let previous = frame(0);
    const forward = [];
    for (let i = 0; i <= 120; i++) {
      const current = frame(PROJECT_DURATION * i / 120);
      assert.ok(current.pose.y >= previous.pose.y);
      assert.ok(current.media.radius >= 6 && current.media.radius <= 16);
      assert.ok(current.media.radius >= previous.media.radius);
      assert.ok(current.background.x <= current.media.x + 1e-9);
      assert.ok(current.background.y <= current.media.y + 1e-9);
      assert.ok(current.background.x + current.background.width >= current.media.x + current.media.width - 1e-9);
      assert.ok(current.background.y + current.background.height >= current.media.y + current.media.height - 1e-9);
      forward.push(current);
      previous = current;
    }
    for (let i = 0; i <= 120; i++) {
      assert.deepEqual(frame(PROJECT_DURATION * (120 - i) / 120), forward[120 - i]);
    }
  });
}

test("partially visible cards keep their real offscreen rounded edge", () => {
  const { card, viewport } = cases[2];
  assert.equal(clipBox(card, viewport), "inset(-120px 16px 514px 16px round 6px)");
});

test("easing clamps endpoints and remains symmetric", () => {
  assert.equal(motionEase(-1), 0);
  assert.equal(motionEase(2), 1);
  for (let i = 0; i <= 100; i++) {
    assert.ok(Math.abs(motionEase(i / 100) + motionEase(1 - i / 100) - 1) < 1e-12);
  }
});
