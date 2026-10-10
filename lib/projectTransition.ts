import { animate } from "framer-motion";

import { clipBox, fitMedia, transitionFrame, PROJECT_DURATION, type Box, type Pose } from "./projectTransitionGeometry";

const HISTORY_KEY = "portfolioProjectOrigin";

/** Let Next carry its internal history fields; pass only our own marker. */
export function replaceProjectHistoryUrl(href: string) {
  const origin = history.state?.[HISTORY_KEY];
  history.replaceState(origin ? { [HISTORY_KEY]: origin } : null, "", href);
}

type Still = { canvas: HTMLCanvasElement; position: [number, number]; pose: Pose; videoTime?: number };
type Origin = { id: string; path: string; slug: string; scrollTop: number; still: Still; cover?: Box };
type Navigation = { push: (href: string) => void; back: () => void; prefetch: (href: string) => void };

function box(element: HTMLElement): Box {
  const rect = element.getBoundingClientRect();
  return { x: rect.x, y: rect.y, width: rect.width, height: rect.height,
    radius: parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0 };
}

function fullscreen(): Box {
  return { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight, radius: 0 };
}

function visible(rect: Box) {
  return rect.width > 0 && rect.height > 0 && rect.y < innerHeight && rect.y + rect.height > 0;
}

/** Capture local media pixels, preserving the video frame during the route swap. */
function snapshot(element: HTMLElement, resume: Array<() => void>): Still | null {
  const poster = element.querySelector<HTMLImageElement>("img");
  const video = element.querySelector<HTMLVideoElement>("video");
  const media = poster?.complete && poster.naturalWidth ? poster
    : video && video.readyState >= 2 && video.videoWidth ? video : null;
  if (!media) return null;
  const width = media instanceof HTMLVideoElement ? media.videoWidth : media.naturalWidth;
  const height = media instanceof HTMLVideoElement ? media.videoHeight : media.naturalHeight;
  const canvas = document.createElement("canvas");
  const resolution = Math.min(1, 1920 / Math.max(width, height));
  canvas.width = Math.round(width * resolution);
  canvas.height = Math.round(height * resolution);
  const context = canvas.getContext("2d");
  if (!context) return null;
  try { context.drawImage(media, 0, 0, canvas.width, canvas.height); }
  catch { return null; }
  if (media instanceof HTMLVideoElement && !media.paused) {
    media.pause();
    resume.push(() => { if (media.isConnected) void media.play().catch(() => {}); });
  }
  const position = getComputedStyle(media).objectPosition.split(" ");
  const fraction = (value: string | undefined) => {
    if (value === "left" || value === "top") return 0;
    if (value === "right" || value === "bottom") return 1;
    return value?.endsWith("%") ? parseFloat(value) / 100 : 0.5;
  };
  const anchor: [number, number] = [fraction(position[0]), fraction(position[1])];
  const bounds = media.getBoundingClientRect();
  const scale = Math.max(bounds.width / canvas.width, bounds.height / canvas.height);
  return { canvas, position: anchor, videoTime: media instanceof HTMLVideoElement ? media.currentTime : undefined, pose: {
    x: bounds.x + (bounds.width - canvas.width * scale) * anchor[0],
    y: bounds.y + (bounds.height - canvas.height * scale) * anchor[1], scale,
  } };
}

/** Keep an inert visual copy across route mounting, including nested scroll
 * and the current hover/animation pose. */
export function freezePage(main: HTMLElement, parent: HTMLElement, resume: Array<() => void>, source = false): HTMLElement {
  const clone = main.cloneNode(true) as HTMLElement;
  const originals = [main, ...main.querySelectorAll<HTMLElement>("*")];
  const copies = [clone, ...clone.querySelectorAll<HTMLElement>("*")];
  const prefix = `transition-${crypto.randomUUID()}-`;
  const ids = new Map(originals.slice(1).filter((element) => element.id)
    .map((element) => [element.id, `${prefix}${element.id}`]));
  const scrolls: Array<() => void> = [];
  originals.forEach((element, index) => {
    const copy = copies[index];
    // Avoid duplicate live IDs without breaking SVG gradients and clip paths.
    if (element.id && ids.has(element.id)) copy.id = ids.get(element.id)!;
    else copy.removeAttribute("id");
    const style = getComputedStyle(element);
    copy.style.animation = "none";
    copy.style.transition = "none";
    copy.style.transform = style.transform;
    copy.style.opacity = style.opacity;
    copy.style.willChange = "auto";
    if (element.matches(".workCardMediaWrap")) {
      // The clone is no longer :hover. Preserve the caption gutter captured
      // at click time instead of letting its media frame grow by 24px.
      copy.style.bottom = style.bottom;
    }
    if (element.scrollTop || element.scrollLeft) {
      const { scrollTop, scrollLeft } = element;
      scrolls.push(() => { copy.scrollTop = scrollTop; copy.scrollLeft = scrollLeft; });
    }
    if (element instanceof HTMLCanvasElement && copy instanceof HTMLCanvasElement) {
      // cloneNode copies canvas attributes, but never its drawn pixels.
      if (element.width && element.height) {
        copy.getContext("2d")?.drawImage(element, 0, 0);
      }
    }
    if (element instanceof HTMLVideoElement) {
      const bounds = element.getBoundingClientRect();
      const onScreen = bounds.bottom > 0 && bounds.top < innerHeight && bounds.right > 0 && bounds.left < innerWidth;
      if (!element.paused) {
        element.pause();
        resume.push(() => { if (element.isConnected) void element.play().catch(() => {}); });
      }
      if (!onScreen || element.readyState < 2 || !element.videoWidth) {
        // An unloaded video still displays its poster. A blank canvas loses it.
        const poster = document.createElement("img");
        poster.className = element.className;
        poster.style.cssText = copy.style.cssText;
        poster.alt = "";
        if (element.poster) poster.src = element.poster;
        else poster.style.visibility = "hidden";
        copy.replaceWith(poster);
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.className = element.className;
      canvas.style.cssText = copy.style.cssText;
      const resolution = Math.min(1, 1920 / Math.max(element.videoWidth, element.videoHeight));
      canvas.width = Math.max(1, Math.round(element.videoWidth * resolution));
      canvas.height = Math.max(1, Math.round(element.videoHeight * resolution));
      canvas.getContext("2d")?.drawImage(element, 0, 0, canvas.width, canvas.height);
      copy.replaceWith(canvas);
    }
  });
  // Most pages have no referenced IDs; avoid another full attribute walk then.
  for (const element of ids.size ? clone.querySelectorAll("*") : []) {
    for (const attribute of Array.from(element.attributes)) {
      const value = attribute.value.replace(/url\((["']?)#([^)'"\s]+)\1\)/g,
        (match, quote: string, id: string) => ids.has(id) ? `url(${quote}#${ids.get(id)}${quote})` : match);
      if ((attribute.name === "href" || attribute.name === "xlink:href") && value.startsWith("#") && ids.has(value.slice(1))) {
        element.setAttribute(attribute.name, `#${ids.get(value.slice(1))}`);
      } else if (value !== attribute.value) {
        element.setAttribute(attribute.name, value);
      }
    }
  }
  clone.querySelectorAll("script, iframe, link").forEach((element) => element.remove());
  clone.classList.add("projectTransitionBackdrop");
  if (source) clone.classList.add("projectTransitionSource");
  clone.inert = true;
  // Reparenting an already scrolled clone can reset its nested scroll offsets.
  // Attach to its final parent first, then restore the captured positions.
  parent.prepend(clone);
  scrolls.forEach((restore) => restore());
  return clone;
}

/** A single persistent layer owns the media while Next mounts either route. */
export class ProjectTransition {
  private origin: Origin | null = null;
  private abort: AbortController | null = null;
  private pendingPath: string | null = null;
  private path: string;

  constructor(private navigation: Navigation, private setBusy: (busy: boolean) => void) {
    this.path = location.pathname;
    window.addEventListener("popstate", this.onPop, true);
  }

  setPath(path: string) {
    this.path = path;
    if (path !== "/" && path !== this.origin?.path) {
      const stream = document.querySelector<HTMLElement>("[data-craft-entry]");
      if (this.origin && stream && history.state?.[HISTORY_KEY] === this.origin.id && path.startsWith("/work/")) {
        // Scrolling replaces this history entry, but its return thumbnail stays
        // the card that originally opened the reading session.
        this.origin.path = path;
      } else this.origin = null;
    }
  }

  dispose() {
    this.abort?.abort();
    window.removeEventListener("popstate", this.onPop, true);
  }

  open(href: string, source?: HTMLElement): boolean {
    if (this.abort) return true;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    const project = /^\/work\/([a-z0-9-]+)$/.exec(href);
    if (project && this.path === "/" && source) {
      const resumes: Array<() => void> = [];
      const still = snapshot(source, resumes);
      if (!still) return false;
      const id = `${Date.now()}`;
      this.origin = { id, path: href, slug: project[1],
        scrollTop: document.querySelector(".workRoot")?.scrollTop ?? 0, still };
      // Preserve Next's own history fields; no synthetic history entries.
      history.replaceState({ ...history.state, [HISTORY_KEY]: id }, "");
      this.navigation.prefetch(href);
      void this.run("open", source, still, resumes, false);
      return true;
    }
    if (href === "/" && this.origin && this.path === this.origin.path &&
        history.state?.[HISTORY_KEY] === this.origin.id) {
      void this.run("close", null, null, [], false);
      return true;
    }
    return false;
  }

  private onPop = () => {
    if (this.abort) {
      // The Back button's intentional history navigation completes this run.
      if (location.pathname === this.pendingPath) return;
      this.abort.abort();
      return;
    }
    if (!this.origin || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const goingBack = this.path === this.origin.path && location.pathname === "/";
    const goingForward = this.path === "/" && location.pathname === this.origin.path;
    if ((!goingBack && !goingForward) || history.state?.[HISTORY_KEY] !== this.origin.id) return;
    const source = goingBack ? null : document.querySelector<HTMLElement>(`.workCard[data-slug="${this.origin.slug}"] .workCardMediaWrap`);
    if (goingForward && source) {
      this.origin.scrollTop = source.closest<HTMLElement>(".workRoot")?.scrollTop ?? this.origin.scrollTop;
    }
    void this.run(goingBack ? "close" : "open", source, null, [], true);
  };

  private async run(direction: "open" | "close", source: HTMLElement | null,
    initial: Still | null, resume: Array<() => void>, historyNavigation: boolean) {
    const origin = this.origin;
    if (!origin) return;
    const controller = new AbortController();
    this.abort = controller;
    const { signal } = controller;
    const root = document.documentElement;
    const main = document.getElementById("main");
    const previouslyInert = main?.inert ?? false;
    const targetPath = direction === "open" ? origin.path : "/";
    const cardSelector = `.workCard[data-slug="${origin.slug}"] .workCardMediaWrap`;
    const heroSlug = origin.path.split("/").pop() ?? origin.slug;
    const heroSelector = `[data-project-hero="${heroSlug}"]`;
    // Use the actual cover's inset and radius for the animation endpoint,
    // rather than briefly expanding to a square, edge-to-edge viewport.
    const readCover = () => {
      const cover = main?.querySelector<HTMLElement>(heroSelector);
      const hero = cover?.querySelector<HTMLElement>(".chMedia");
      if (!cover || !hero) return null;
      const stream = hero.closest<HTMLElement>(".craftStream");
      if (stream && direction === "close") return origin.cover ?? fullscreen();
      const bounds = box(hero);
      // The hero uses svh; innerHeight can differ when mobile browser chrome
      // changes. Measure the rendered cover rather than guessing its height.
      const scrollTop = hero.closest<HTMLElement>(".csDetail")?.scrollTop ?? 0;
      return { ...bounds, y: bounds.y + scrollTop };
    };
    let expandedBox = readCover() ?? origin.cover ?? fullscreen();
    const overlay = document.createElement("div");
    overlay.className = "projectTransitionLayer";
    overlay.setAttribute("aria-hidden", "true");
    const backing = document.createElement("div");
    backing.className = "projectTransitionBacking";
    backing.setAttribute("aria-hidden", "true");
    const frame = document.createElement("div");
    frame.className = "projectTransitionFrame";
    overlay.append(frame);
    let navigated = historyNavigation;
    let focusTarget: HTMLElement | null = null;
    let backdrop: HTMLElement | null = null;
    const previousClip = main?.style.clipPath ?? "";
    const animations = new Set<ReturnType<typeof animate>>();
    const stop = () => animations.forEach((animation) => animation.stop());
    signal.addEventListener("abort", stop, { once: true });

    const check = () => { if (signal.aborted) throw new Error("Transition cancelled"); };
    const tween = async (duration: number, update: (progress: number) => void) => {
      check();
      const animation = animate(0, 1, { duration, ease: "linear", onUpdate: update });
      animations.add(animation);
      // stop() does not resolve Motion's finished promise. Abort must also
      // release the async run so neither history nor resizing strands a layer.
      await new Promise<void>((resolve) => {
        const done = () => { signal.removeEventListener("abort", done); resolve(); };
        signal.addEventListener("abort", done, { once: true });
        void animation.finished.then(done);
      });
      animations.delete(animation);
      check();
    };
    const waitFor = async <T,>(read: () => T | null): Promise<T> => {
      const start = performance.now();
      return new Promise<T>((resolve, reject) => {
        let raf = 0;
        const cleanup = () => { cancelAnimationFrame(raf); clearTimeout(timeout); signal.removeEventListener("abort", cancelled); };
        const cancelled = () => { cleanup(); reject(new Error("Transition cancelled")); };
        const timeout = window.setTimeout(() => { cleanup(); reject(new Error("Destination not ready")); }, 4000);
        const poll = () => {
          if (signal.aborted) return cancelled();
          try {
            const value = read();
            if (value) { cleanup(); resolve(value); }
            else if (performance.now() - start < 4000) raf = requestAnimationFrame(poll);
          } catch (error) {
            cleanup();
            reject(error);
          }
        };
        signal.addEventListener("abort", cancelled, { once: true });
        poll();
      });
    };
    const mountStill = (still: Still) => {
      const canvas = document.createElement("canvas");
      canvas.width = still.canvas.width;
      canvas.height = still.canvas.height;
      canvas.getContext("2d")?.drawImage(still.canvas, 0, 0);
      frame.append(canvas);
      return canvas;
    };
    const fit = (still: Still, rect: Box): Pose =>
      fitMedia(still.canvas.width, still.canvas.height, still.position, rect);
    const clip = (rect: Box) => clipBox(rect, fullscreen());
    const paint = (canvas: HTMLCanvasElement, rect: Box, pose: Pose) => {
      canvas.style.transform = `translate3d(${pose.x}px,${pose.y}px,0) scale(${pose.scale})`;
      frame.style.clipPath = clip(rect);
    };
    const total = PROJECT_DURATION;
    const paintCurtain = (canvas: HTMLCanvasElement, still: Still, card: Box,
      cardPose: Pose, seconds: number) => {
      const geometry = transitionFrame(card, cardPose, expandedBox,
        fit(still, expandedBox), fullscreen(), seconds);
      paint(canvas, geometry.media, geometry.pose);
      // Only the solid backing fills the gutter; content stays rounded.
      backing.style.clipPath = clip(geometry.background);
      return frame.style.clipPath;
    };
    const navigate = () => {
      if (navigated) return;
      check();
      navigated = true;
      this.pendingPath = targetPath;
      if (direction === "open") this.navigation.push(origin.path);
      else this.navigation.back();
    };
    const resize = () => controller.abort();
    // A suspended animation or interrupted route must not leave an inert page.
    const watchdog = window.setTimeout(() => controller.abort(), 10000);

    try {
      // The thumbnail is the curtain for both directions. The destination
      // hero is independent and is never substituted into this layer.
      const still = direction === "close" ? origin.still
        : initial ?? (source && snapshot(source, resume)) ?? origin.still;
      if (direction === "open") origin.still = still;
      const sourceBox = source ? box(source) : fullscreen();
      const onScreen = visible(sourceBox);
      const first = mountStill(still);
      paint(first, direction === "open" && onScreen ? sourceBox : fullscreen(),
        direction === "open" && onScreen ? still.pose : fit(still, fullscreen()));
      backing.style.clipPath = frame.style.clipPath;
      if (direction === "close") paintCurtain(first, still, fullscreen(), fit(still, fullscreen()), total);
      root.dataset.projectTransition = direction;
      this.setBusy(true);
      if (main) main.inert = true;
      document.body.append(backing, overlay);
      backdrop = main ? freezePage(main, direction === "open" ? document.body : overlay, resume,
        direction === "open") : null;
      if (direction === "open" && backdrop) {
        // Keep the outgoing homepage outside the growing window. The live
        // destination sits above this copy and shares the thumbnail's clip.
        if (main) main.style.clipPath = frame.style.clipPath;
        // The persistent layer replaces the card's media, rather than sitting
        // above another visible thumbnail in the frozen homepage. Keep its
        // exact captured crop/frame as the sole image during the handoff.
        const frozenSource = backdrop.querySelector<HTMLElement>(cardSelector);
        if (frozenSource) frozenSource.style.visibility = "hidden";
        if (source) {
          const previousVisibility = source.style.visibility;
          source.style.visibility = "hidden";
          resume.push(() => { source.style.visibility = previousVisibility; });
        }
      }
      window.addEventListener("resize", resize, { once: true });
      if (direction === "open") {
        // Mount the real page before starting the reveal. A slow route holds
        // the original thumbnail, rather than splitting motion at fullscreen.
        navigate();
        const hero = await waitFor(() => location.pathname === targetPath
          ? main?.querySelector<HTMLElement>(`${heroSelector} .chMedia`) ?? null : null);
        // The default page entrance translates the entire window by 8px.
        // Its transform must not contaminate the measured cover endpoint or
        // restart when the project-transition attribute is removed.
        const pageWindow = hero.closest<HTMLElement>(".stage > .window");
        if (pageWindow) pageWindow.dataset.projectStageSettled = "true";
        const scroller = hero.closest<HTMLElement>(".csDetail");
        if (scroller) scroller.scrollTop = 0;
        history.replaceState({ ...history.state, [HISTORY_KEY]: origin.id }, "");
        await waitFor(() => {
          const video = hero.querySelector("video");
          const poster = hero.querySelector("img");
          return hero.classList.contains("chMediaEmpty") || (video && video.readyState >= 2) || (poster?.complete && poster.naturalWidth) ? true : null;
        });
        expandedBox = readCover() ?? expandedBox;
        origin.cover = expandedBox;
        const from = onScreen ? sourceBox : fullscreen();
        const fromPose = onScreen ? still.pose : fit(still, fullscreen());
        // The destination's growing clip covers the homepage copy in place.
        // There is no separate text fade or floating label above the media.
        await tween(total, (progress) => {
          const seconds = progress * total;
          const pageClip = paintCurtain(first, still, from, fromPose, seconds);
          if (main) main.style.clipPath = pageClip;
        });
        focusTarget = main?.querySelector<HTMLElement>(`${heroSelector} h1`) ?? null;
        focusTarget?.setAttribute("tabindex", "-1");
        return;
      }
      // Keep the case study visible inside the contracting window while
      // Next restores the homepage underneath it, including Browser Back.
      root.dataset.projectCovered = "true";
      navigate();
      const destination = await waitFor(() => location.pathname === targetPath
        ? main?.querySelector<HTMLElement>(cardSelector) ?? null : null);
      const pageWindow = destination.closest<HTMLElement>(".stage > .window");
      if (pageWindow) pageWindow.dataset.projectStageSettled = "true";
      const scroller = main?.querySelector<HTMLElement>(".workRoot");
      if (scroller) {
        scroller.dataset.projectRestored = "true";
        scroller.scrollTop = origin.scrollTop;
      }
      // Let the restored responsive grid mount and settle before measuring.
      // Keep the saved scroll offset while layout/React effects run.
      let lastBox: Box | null = null;
      let stableFrames = 0;
      await waitFor(() => {
        if (scroller) scroller.scrollTop = origin.scrollTop;
        const current = box(destination);
        const stable = lastBox && ["x", "y", "width", "height"].every((key) =>
          Math.abs(current[key as keyof Box] - lastBox![key as keyof Box]) < 0.25);
        stableFrames = stable ? stableFrames + 1 : 0;
        lastBox = current;
        return stableFrames >= 3 && current.width > 0 && current.height > 0 ? true : null;
      });
      if (!visible(box(destination))) destination.scrollIntoView({ block: "center", behavior: "instant" });
      const video = destination.querySelector("video");
      if (video && video.readyState >= 2 && still.videoTime !== undefined) {
        // Hover-only videos may have no source after the homepage remounts.
        // Synchronize only an already loaded video; never gate Back on it.
        try { video.currentTime = still.videoTime; } catch { /* Keep the saved frame. */ }
      }
      const destinationBox = box(destination);
      // The original pixels already live in `still`. Only the restored card's
      // geometry is needed, even when its lazy poster/video has not loaded.
      const destinationMedia = destination.querySelector<HTMLElement>("img, video");
      const destinationPose = fit(still, destinationMedia ? box(destinationMedia) : destinationBox);
      const previousVisibility = destination.style.visibility;
      destination.style.visibility = "hidden";
      resume.push(() => { destination.style.visibility = previousVisibility; });
      // Homepage text stays beneath the case-study snapshot and is uncovered
      // progressively by the same contracting clip as the thumbnail.
      delete root.dataset.projectCovered;
      root.dataset.projectTransition = "return";
      await tween(total, (progress) => {
        const seconds = (1 - progress) * total;
        const pageClip = paintCurtain(first, still, destinationBox, destinationPose, seconds);
        if (backdrop) backdrop.style.clipPath = pageClip;
      });
      focusTarget = destination.closest<HTMLElement>("a");
    } catch {
      // Missing media, cancelled navigation, or a slow route must never trap
      // the visitor behind the transition. Continue normal navigation.
      if (!navigated && !signal.aborted) navigate();
    } finally {
      clearTimeout(watchdog);
      window.removeEventListener("resize", resize);
      signal.removeEventListener("abort", stop);
      stop();
      resume.forEach((restore) => restore());
      overlay.remove();
      backing.remove();
      backdrop?.remove();
      if (main) main.style.clipPath = previousClip;
      if (main) main.inert = previouslyInert;
      // Restore keyboard focus while hover handlers still know this is a
      // transition handoff, rather than a new interaction with the card.
      focusTarget?.focus({ preventScroll: true });
      delete root.dataset.projectCovered;
      delete root.dataset.projectTransition;
      if (this.abort === controller) {
        this.abort = null;
        this.pendingPath = null;
        this.setBusy(false);
      }
    }
  }
}
