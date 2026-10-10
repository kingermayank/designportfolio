import { ABOUT_INTRO } from "./about";
import { freezePage } from "./projectTransition";
import { clipBox, fitMedia, motionEase, PROJECT_DURATION, transitionFrame, type Box } from "./projectTransitionGeometry";

const HISTORY_KEY = "portfolioAboutOrigin";
const ABOUT_LINK = '.workRoot a[href="/about"]';

type Origin = {
  id: string; box: Box; src: string; scroll: number;
  offset: { x: number; y: number }; padding: number; border: number;
  background: string; borderColor: string; objectPosition: string;
};

function readBox(element: HTMLElement): Box {
  const rect = element.getBoundingClientRect();
  return { x: rect.x, y: rect.y, width: rect.width, height: rect.height,
    radius: parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0 };
}

/** Share Visual Craft's frame timeline while the portrait settles into its layout. */
export class AboutTransition {
  private controller: AbortController | null = null;
  private origin: Origin | null = null;
  private path = location.pathname;
  private pending: string | null = null;

  constructor(private back: () => void, private setBusy: (busy: boolean) => void) {
    window.addEventListener("popstate", this.onPop, true);
  }

  dispose() {
    window.removeEventListener("popstate", this.onPop, true);
    this.controller?.abort();
  }

  setPath(path: string) {
    this.path = path;
    if (path !== "/" && path !== "/about") {
      this.controller?.abort();
      this.origin = null;
    }
  }

  private onPop = (event: PopStateEvent) => {
    if (this.controller) {
      if (location.pathname !== this.pending) this.controller.abort();
      return;
    }
    if (this.path === "/about" && location.pathname === "/" && this.origin &&
      event.state?.[HISTORY_KEY] === this.origin.id &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.run(this.origin, true, () => {});
    }
  };

  open(source: HTMLElement, navigate: () => void) {
    if (this.controller) return;
    const box = readBox(source);
    if (!box.width || !box.height) { navigate(); return; }
    const image = source.querySelector<HTMLImageElement>("img");
    const style = getComputedStyle(source);
    const link = document.querySelector<HTMLElement>(ABOUT_LINK);
    const anchor = link ? readBox(link) : box;
    const origin: Origin = {
      id: crypto.randomUUID(), box, src: image?.currentSrc || image?.src || ABOUT_INTRO.hero.src,
      scroll: document.querySelector(".workRoot")?.scrollTop ?? 0,
      offset: { x: box.x - anchor.x, y: box.y - anchor.y },
      padding: image ? parseFloat(style.paddingTop) || 0 : 0,
      border: image ? parseFloat(style.borderTopWidth) || 0 : 0,
      background: style.backgroundColor, borderColor: style.borderTopColor,
      objectPosition: image ? getComputedStyle(image).objectPosition : "center top",
    };
    this.origin = origin;
    history.replaceState({ ...history.state, [HISTORY_KEY]: origin.id }, "");
    this.run(origin, false, navigate);
  }

  close(): boolean {
    if (this.controller || !this.origin || this.path !== "/about" ||
      history.state?.[HISTORY_KEY] !== this.origin.id) return false;
    this.run(this.origin, true, this.back);
    return true;
  }

  private run(origin: Origin, reverse: boolean, navigate: () => void) {
    const main = document.getElementById("main");
    if (!main) { navigate(); return; }
    const controller = new AbortController();
    this.controller = controller;
    this.pending = reverse ? "/" : "/about";
    const { signal } = controller;
    const root = document.documentElement;
    const full: Box = { x: 0, y: 0, width: innerWidth, height: innerHeight, radius: 0 };
    let card = { ...origin.box };
    const outgoingPortrait = reverse ? main.querySelector<HTMLImageElement>(".aboutLedePortrait img") : null;
    let portraitBox = outgoingPortrait ? readBox(outgoingPortrait) : card;
    let arrivingPortrait: HTMLElement | null = null;
    let portraitVisibility = "";
    const saved = { clip: main.style.clipPath, visibility: main.style.visibility, inert: main.inert };
    const resume: Array<() => void> = [];
    const backdrop = freezePage(main, document.body, resume);
    backdrop.style.position = "fixed";
    backdrop.style.zIndex = reverse ? "9992" : "9990";
    // The moving portrait owns these pixels until it reaches its destination.
    const frozenPortrait = reverse ? backdrop.querySelector<HTMLElement>(".aboutLedePortrait img") : null;
    if (frozenPortrait) frozenPortrait.style.visibility = "hidden";
    const photo = document.createElement("div");
    photo.className = "aboutTransitionPhoto";
    photo.setAttribute("aria-hidden", "true");
    const curtain = document.createElement("div");
    curtain.className = "aboutTransitionCurtain";
    const image = document.createElement("img");
    image.src = origin.src;
    image.alt = "";
    image.style.objectPosition = origin.objectPosition;
    curtain.append(image);
    photo.append(curtain);
    curtain.style.width = `${card.width}px`;
    curtain.style.height = `${card.height}px`;
    curtain.style.background = origin.background;
    curtain.style.borderColor = origin.borderColor;
    const paint = (seconds: number) => {
      const frame = transitionFrame(card, fitMedia(card.width, card.height, [0.5, 0.5], card),
        full, fitMedia(card.width, card.height, [0.5, 0.5], full), full, seconds);
      (reverse ? backdrop : main).style.clipPath = clipBox(frame.background, full);
      photo.style.clipPath = clipBox(frame.background, full);
      const progress = motionEase(seconds / PROJECT_DURATION);
      const remaining = 1 - progress;
      const mix = (start: number, end: number) => start + (end - start) * progress;
      curtain.style.width = `${mix(card.width, portraitBox.width)}px`;
      curtain.style.height = `${mix(card.height, portraitBox.height)}px`;
      curtain.style.transform = `translate3d(${mix(card.x, portraitBox.x)}px,${mix(card.y, portraitBox.y)}px,0)`;
      curtain.style.padding = `${origin.padding * remaining}px`;
      curtain.style.borderWidth = `${origin.border * remaining}px`;
      curtain.style.borderRadius = `${mix(card.radius, portraitBox.radius)}px`;
      image.style.borderRadius = `${mix(6, portraitBox.radius)}px`;
      if (reverse) {
        // The originating portrait is a transient hover preview. Dismiss it
        // gently as it settles, instead of removing visible pixels abruptly.
        const opacity = String(Math.min(1, seconds / (PROJECT_DURATION * 0.15)));
        photo.style.opacity = opacity;
        backdrop.style.opacity = opacity;
      }
    };
    paint(reverse ? PROJECT_DURATION : 0);
    document.body.append(photo);
    root.dataset.aboutTransition = "true";
    main.inert = true;
    main.style.visibility = "hidden";
    this.setBusy(true);
    const stop = () => controller.abort();
    window.addEventListener("resize", stop, { once: true });
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
        let destination: HTMLElement | null = null;
        while (!destination) {
          await nextFrame();
          if (location.pathname !== this.pending) continue;
          destination = main.querySelector<HTMLElement>(reverse ? ABOUT_LINK : ".aboutLedePortrait img");
          if (destination instanceof HTMLImageElement &&
            (!destination.complete || !destination.naturalWidth)) destination = null;
        }
        if (!reverse) history.replaceState({ ...history.state, [HISTORY_KEY]: origin.id }, "");
        const pageWindow = destination.closest<HTMLElement>(".stage > .window");
        if (pageWindow) pageWindow.dataset.projectStageSettled = "true";
        const scroller = main.querySelector<HTMLElement>(reverse ? ".workRoot" : ".aboutPageScroll");
        if (scroller) scroller.scrollTop = reverse ? origin.scroll : 0;
        await nextFrame();
        if (reverse) {
          const anchor = readBox(destination);
          card = { ...card, x: anchor.x + origin.offset.x, y: anchor.y + origin.offset.y };
        } else {
          portraitBox = readBox(destination);
          arrivingPortrait = destination;
          portraitVisibility = destination.style.visibility;
          destination.style.visibility = "hidden";
        }
        paint(reverse ? PROJECT_DURATION : 0);
        main.style.visibility = saved.visibility;
        const started = performance.now();
        for (let progress = 0; progress < 1;) {
          const now = await nextFrame();
          progress = Math.min(1, (now - started) / (PROJECT_DURATION * 1000));
          paint((reverse ? 1 - progress : progress) * PROJECT_DURATION);
        }
        main.inert = saved.inert;
        if (reverse) destination.focus({ preventScroll: true });
        else {
          const heading = main.querySelector<HTMLElement>(".aboutPageTitle");
          heading?.setAttribute("tabindex", "-1");
          heading?.focus({ preventScroll: true });
        }
      } catch {
        // Cancellation and slow routes must always leave the live page usable.
      } finally {
        clearTimeout(timeout);
        window.removeEventListener("resize", stop);
        main.style.clipPath = saved.clip;
        main.style.visibility = saved.visibility;
        main.inert = saved.inert;
        if (arrivingPortrait) arrivingPortrait.style.visibility = portraitVisibility;
        photo.remove();
        backdrop.remove();
        resume.forEach(restore => restore());
        delete root.dataset.aboutTransition;
        if (this.controller === controller) { this.controller = null; this.pending = null; }
        this.setBusy(false);
      }
    })();
  }
}
