import { ABOUT_INTRO } from "./about";
import { freezePage } from "./projectTransition";

import { clipBox, motionEase, PROJECT_DURATION, type Box } from "./projectTransitionGeometry";

export type AboutMotion = "aperture" | "settle" | "turn";

function readBox(element: HTMLElement): Box {
  const rect = element.getBoundingClientRect();
  // DOMRect coordinates are prototype getters, so spreading it loses them.
  return { x: rect.x, y: rect.y, width: rect.width, height: rect.height,
    radius: parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0 };
}

/** Own the preview pixels while Next swaps the homepage for About. */
export class AboutTransition {
  private controller: AbortController | null = null;

  dispose() { this.controller?.abort(); }

  open(source: HTMLElement, navigate: () => void, setBusy: (busy: boolean) => void, variant: AboutMotion = "aperture") {
    if (this.controller) return;
    const main = document.getElementById("main");
    if (!main) { navigate(); return; }
    const controller = new AbortController();
    this.controller = controller;
    const { signal } = controller;
    const root = document.documentElement;
    const sourceImage = source.querySelector<HTMLImageElement>("img");
    const hasPreview = !!sourceImage?.complete && !!sourceImage.naturalWidth;
    const from = readBox(source);
    if (from.width <= 0 || from.height <= 0) {
      this.controller = null;
      navigate();
      return;
    }
    const full = { x: 0, y: 0, width: innerWidth, height: innerHeight, radius: 0 };
    const saved = { clip: main.style.clipPath, visibility: main.style.visibility, inert: main.inert,
      opacity: main.style.opacity, transform: main.style.transform, origin: main.style.transformOrigin };
    const resume: Array<() => void> = [];
    const backdrop = freezePage(main, document.body, resume);
    backdrop.style.position = "fixed";
    backdrop.style.zIndex = "9990";
    const photo = document.createElement("div");
    photo.className = "aboutTransitionPhoto";
    const curtain = document.createElement("div");
    curtain.className = "aboutTransitionCurtain";
    const image = document.createElement("img");
    image.src = sourceImage?.currentSrc || sourceImage?.src || ABOUT_INTRO.hero.src;
    image.alt = "";
    curtain.append(image);
    photo.append(curtain);
    photo.setAttribute("aria-hidden", "true");
    const sourceStyle = getComputedStyle(source);
    const padding = hasPreview ? parseFloat(sourceStyle.paddingTop) || 0 : 0;
    const border = hasPreview ? parseFloat(sourceStyle.borderTopWidth) || 0 : 0;
    curtain.style.width = `${from.width}px`;
    curtain.style.height = `${from.height}px`;
    curtain.style.background = sourceStyle.backgroundColor;
    curtain.style.borderColor = sourceStyle.borderTopColor;
    let portrait: HTMLImageElement | null = null;
    let portraitVisibility = "";
    let portraitBox = full;
    const interpolate = (end: Box, progress: number): Box => ({
      x: from.x + (end.x - from.x) * progress, y: from.y + (end.y - from.y) * progress,
      width: from.width + (end.width - from.width) * progress,
      height: from.height + (end.height - from.height) * progress,
      radius: from.radius + (end.radius - from.radius) * progress,
    });
    const paint = (seconds: number) => {
      const progress = Math.min(1, seconds / PROJECT_DURATION);
      const eased = motionEase(progress);
      const remaining = 1 - eased;
      let frame = interpolate(full, eased);
      let angle = 0;
      if (variant === "settle") {
        frame = interpolate(portraitBox, eased);
        main.style.clipPath = "none";
        main.style.opacity = String(motionEase(Math.min(1, progress / 0.8)));
      } else if (variant === "turn") {
        // The front turns edge-on, then the destination unfolds from its back.
        const reveal = motionEase(Math.max(0, (progress - 0.4) / 0.6));
        frame = interpolate(full, reveal);
        const front = motionEase(Math.min(1, progress / 0.4));
        angle = -90 * front;
        curtain.style.opacity = progress < 0.4 ? "1" : "0";
        main.style.clipPath = clipBox(frame, full);
        main.style.opacity = progress < 0.4 ? "0" : "1";
        main.style.transformOrigin = `${frame.x + frame.width / 2}px ${frame.y + frame.height / 2}px`;
        main.style.transform = `perspective(1600px) rotateY(${75 * (1 - reveal)}deg)`;
      } else {
        main.style.clipPath = clipBox(frame, full);
        curtain.style.opacity = String(1 - motionEase(Math.min(1, progress / 0.72)));
      }
      curtain.style.width = `${frame.width}px`;
      curtain.style.height = `${frame.height}px`;
      curtain.style.transform = `translate3d(${frame.x}px,${frame.y}px,0) perspective(800px) rotateY(${angle}deg)`;
      curtain.style.padding = `${padding * remaining}px`;
      curtain.style.borderWidth = `${border * remaining}px`;
      curtain.style.borderRadius = `${frame.radius}px`;
      image.style.borderRadius = `${variant === "settle" ? 6 : 6 * remaining}px`;
    };
    paint(0);
    document.body.append(photo);
    root.dataset.aboutTransition = "true";
    main.inert = true;
    main.style.visibility = "hidden";
    setBusy(true);
    const stop = () => controller.abort();
    window.addEventListener("resize", stop, { once: true });
    window.addEventListener("popstate", stop, { once: true });
    const timeout = window.setTimeout(stop, 6000);
    const nextFrame = () => new Promise<number>((resolve, reject) => {
      if (signal.aborted) { reject(new Error("Cancelled")); return; }
      const abort = () => { cancelAnimationFrame(frame); reject(new Error("Cancelled")); };
      const frame = requestAnimationFrame(time => { signal.removeEventListener("abort", abort); resolve(time); });
      signal.addEventListener("abort", abort, { once: true });
    });
    void (async () => {
      try {
        navigate();
        let imageTarget: HTMLImageElement | null = null;
        while (!imageTarget || !imageTarget.complete || !imageTarget.naturalWidth) {
          await nextFrame();
          imageTarget = location.pathname === "/about" ? main.querySelector<HTMLImageElement>(".aboutLedePortrait img") : null;
        }
        const pageWindow = imageTarget.closest<HTMLElement>(".stage > .window");
        if (pageWindow) pageWindow.dataset.projectStageSettled = "true";
        const scroller = main.querySelector<HTMLElement>(".aboutPageScroll");
        if (scroller) scroller.scrollTop = 0;
        await nextFrame();
        portrait = imageTarget;
        portraitBox = readBox(portrait);
        portraitVisibility = portrait.style.visibility;
        if (variant === "settle") portrait.style.visibility = "hidden";
        paint(0);
        main.style.visibility = saved.visibility;
        const started = performance.now();
        for (let p = 0; p < 1;) {
          const now = await nextFrame();
          p = Math.min(1, (now - started) / (PROJECT_DURATION * 1000));
          paint(p * PROJECT_DURATION);
        }
        const heading = main.querySelector<HTMLElement>(".aboutPageTitle");
        main.inert = saved.inert;
        heading?.setAttribute("tabindex", "-1");
        heading?.focus({ preventScroll: true });
      } catch {
        // Route changes, resize, and slow assets always fall through to the
        // normal destination; none may strand a hidden or inert page.
      } finally {
        clearTimeout(timeout);
        window.removeEventListener("resize", stop);
        window.removeEventListener("popstate", stop);
        main.style.clipPath = saved.clip;
        main.style.opacity = saved.opacity;
        main.style.transform = saved.transform;
        main.style.transformOrigin = saved.origin;
        main.style.visibility = saved.visibility;
        main.inert = saved.inert;
        if (portrait) portrait.style.visibility = portraitVisibility;
        photo.remove();
        backdrop.remove();
        resume.forEach(restore => restore());
        delete root.dataset.aboutTransition;
        if (this.controller === controller) this.controller = null;
        setBusy(false);
      }
    })();
  }
}
