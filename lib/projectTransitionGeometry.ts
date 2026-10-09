export type Box = { x: number; y: number; width: number; height: number; radius: number };
export type Pose = { x: number; y: number; scale: number };

// Shared by both directions; returning samples this timeline backwards.
export const PROJECT_TIMING = { expand: 1.25, slideStart: 0, reveal: 1.25 };
export const PROJECT_DURATION = Math.max(PROJECT_TIMING.expand, PROJECT_TIMING.slideStart + PROJECT_TIMING.reveal);

export function motionEase(progress: number): number {
  const p = Math.max(0, Math.min(1, progress));
  return p < 0.5 ? 16 * p ** 5 : 1 - (-2 * p + 2) ** 5 / 2;
}

export function fitMedia(width: number, height: number, position: [number, number], rect: Box): Pose {
  const scale = Math.max(rect.width / width, rect.height / height);
  return { scale, x: rect.x + (rect.width - width * scale) * position[0],
    y: rect.y + (rect.height - height * scale) * position[1] };
}

export function clipBox(rect: Box, viewport: Box): string {
  // Preserve offscreen bounds. Clamping a negative inset moves a partially
  // visible card's rounded corner onto the viewport edge and causes a jump.
  return `inset(${rect.y}px ${viewport.width - rect.x - rect.width}px ${viewport.height - rect.y - rect.height}px ${rect.x}px round ${rect.radius}px)`;
}

export function transitionFrame(card: Box, cardPose: Pose, cover: Box,
  coverPose: Pose, viewport: Box, seconds: number) {
  const expansion = motionEase(seconds / PROJECT_TIMING.expand);
  const slide = motionEase((seconds - PROJECT_TIMING.slideStart) / PROJECT_TIMING.reveal);
  const mix = (a: number, b: number) => a + (b - a) * expansion;
  const mixBox = (end: Box): Box => ({ x: mix(card.x, end.x), y: mix(card.y, end.y),
    width: mix(card.width, end.width), height: mix(card.height, end.height),
    radius: mix(card.radius, end.radius) });
  return {
    media: mixBox(cover),
    background: mixBox(viewport),
    pose: { x: mix(cardPose.x, coverPose.x),
      // Screen-space motion avoids upward expansion cancelling the slide.
      y: cardPose.y + slide * (viewport.height - cardPose.y),
      scale: mix(cardPose.scale, coverPose.scale) },
  };
}
