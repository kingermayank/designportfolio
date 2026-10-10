"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject, type MouseEvent, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import CaseStudies from "./CaseStudies";
import CopyEmailButton from "./CopyEmailButton";
import { LINKABLE_CASE_STUDIES } from "@/lib/caseStudies";
import { WORK_FIT_CTA } from "@/lib/letter";
import { brandColor } from "@/lib/brandColors";
import { replaceProjectHistoryUrl } from "@/lib/projectTransition";
import "./CraftStream.css";

const studies = LINKABLE_CASE_STUDIES;
const orderAt = (start: number, index: number) => ((start + index) % studies.length + studies.length) % studies.length;
const studyAt = (start: number, index: number) => studies[orderAt(start, index)];
const posterFor = (study: (typeof studies)[number]) => study.workPoster ?? (study.workCover && !/\.mp4(?:\?|$)/.test(study.workCover) ? study.workCover : undefined);

function ChapterFooter({ index, start, visited, onJump }: {
  index: number; start: number; visited: Set<string>;
  onJump: (slug: string, from: number) => void;
}) {
  const study = studyAt(start, index);
  const next = studyAt(start, index + 1);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const previewStudy = studies.find(item => item.slug === previewSlug) ?? next;
  const poster = posterFor(previewStudy);
  const jumpLink = (event: MouseEvent<HTMLAnchorElement>, slug: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onJump(slug, index);
  };
  return <footer className="craftChapterFooter craftFooter-combined" aria-label={`End of ${study.title}`}
    onPointerLeave={() => setPreviewSlug(null)}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPreviewSlug(null); }}>
    <h2 className="moreProjectsTitle">More projects<span className="moreProjectsDot">.</span></h2>
    <div className="craftFooterGrid">
      <a className="craftNextPreview" href={`/work/${previewStudy.slug}`} onClick={event => jumpLink(event, previewStudy.slug)}>
        <div className="craftNextCopy"><span className="craftFooterEyebrow">{previewSlug ? "Explore this chapter" : orderAt(start, index + 1) === 0 ? "Back to the first chapter" : "Up next"}</span>
          <h3>{previewStudy.title}</h3><p>{previewStudy.workSummary ?? previewStudy.tagline}</p>
        </div>
        {poster && <div className="craftNextThumbnail" data-previewing={!!previewSlug}>
          {studies.map(item => {
            const src = posterFor(item);
            // Keep the small set of stills mounted so hovering can crossfade.
            // eslint-disable-next-line @next/next/no-img-element
            return src ? <img key={item.slug} src={src} alt="" loading="lazy" width={960} height={640} data-selected={item.slug === previewStudy.slug} /> : null;
          })}
        </div>}
      </a>
      <nav className="craftProjectIndex" aria-label="Visual Craft case studies">
        <div className="craftIndexHeading craftFooterEyebrow"><span>Project index</span><span>{String(orderAt(start, index) + 1).padStart(2, "0")}/{String(studies.length).padStart(2, "0")}</span></div>
        <ol>{studies.map((item, order) => <li key={item.slug}>
          <a href={`/work/${item.slug}`} aria-current={item.slug === study.slug ? "step" : undefined}
            onPointerEnter={event => { if (event.pointerType === "mouse") setPreviewSlug(item.slug); }}
            onFocus={() => setPreviewSlug(item.slug)}
            data-previewed={previewSlug === item.slug}
            data-next={item.slug === next.slug}
            style={{ "--project-index-accent": brandColor(item.slug) ?? item.accent ?? "#fff" } as CSSProperties}
            onClick={event => jumpLink(event, item.slug)}>
            <span className="craftIndexNumber">{String(order + 1).padStart(2, "0")}</span>
            <strong>{item.title}</strong>
            <span className="craftIndexStatus">{item.slug === study.slug ? "Now viewing" : item.slug === next.slug ? "Up next ↓" : visited.has(item.slug) ? "View again ↓" : "Go here ↓"}</span>
          </a>
        </li>)}</ol>
      </nav>
    </div>
    <a className="craftIndexContinue" href={`/work/${next.slug}`} onClick={event => jumpLink(event, next.slug)}>
      <span>Keep scrolling for <strong>{next.title}</strong></span>
    </a>
  </footer>;
}

function Chapter({ index, start, active, scrollRef, onClose, onMeasure, visited, onJump }: {
  index: number; start: number; active: boolean; scrollRef: RefObject<HTMLDivElement | null>;
  onClose: () => void; onMeasure: (index: number, height: number) => void;
  visited: Set<string>; onJump: (slug: string, from: number) => void;
}) {
  const content = useRef<HTMLDivElement>(null);
  const study = studyAt(start, index);
  useLayoutEffect(() => {
    const node = content.current;
    if (!node) return;
    const measure = () => onMeasure(index, node.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [index, onMeasure]);

  const wrapCover = (cover: ReactNode) => index === 0 ? cover : (
    <div className="craftCoverRunway">
      <div className="craftCoverSticky">
        <div className="craftCoverSurface">{cover}</div>
      </div>
    </div>
  );
  return <div ref={content} className="craftChapterContent">
    <CaseStudies externalEntry={{ slug: study.slug, onClose }} layout="editorial"
      flow={{ active, scrollRef, wrapCover }} />
    <ChapterFooter index={index} start={start} visited={visited} onJump={onJump} />
  </div>;
}

export default function CraftStream({ slug, onClose }: { slug: string; onClose: () => void }) {
  const initial = Math.max(0, studies.findIndex(study => study.slug === slug));
  const [start] = useState(initial);
  const scrollRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLSpanElement>(null);
  const [heights, setHeights] = useState(() => new Map<number, number>());
  const [count, setCount] = useState(2);
  const [firstIndex, setFirstIndex] = useState(0);
  const [travelRange, setTravelRange] = useState<{ first: number; last: number } | null>(null);
  const travelFrame = useRef(0);
  const travelling = useRef(false);
  const cancelTravel = useRef<() => void>(() => {});
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState(() => new Set([slug]));
  const [jumpTick, setJumpTick] = useState(0);
  const pendingJump = useRef<{ index: number; source?: { index: number; top: number } } | null>(null);
  const [inCover, setInCover] = useState(true);
  const reduce = useReducedMotion();
  const activeRef = useRef(0);
  const scrollAnchor = useRef<{ index: number; top: number } | null>(null);
  const measure = useCallback((index: number, height: number) => {
    if (height <= 0) return;
    const measured = Math.ceil(height);
    setHeights(previous => {
      if (previous.get(index) === measured) return previous;
      const next = new Map(previous);
      next.set(index, measured);
      return next;
    });
  }, []);


  useLayoutEffect(() => {
    const root = scrollRef.current;
    const anchor = scrollAnchor.current;
    if (!root || !anchor) return;
    const article = root.querySelector<HTMLElement>(`[data-index="${anchor.index}"]`);
    if (article) root.scrollTop += article.getBoundingClientRect().top - anchor.top;
    scrollAnchor.current = null;
  }, [active, travelRange]);

  // Keep only the current chapter and its neighbors mounted. Measured placeholders
  // preserve the scroll position when earlier chapters are revisited.
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (document.documentElement.hasAttribute("data-project-transition")) return;
      const viewport = root.getBoundingClientRect();
      const height = root.clientHeight;
      const articles = Array.from(root.querySelectorAll<HTMLElement>(":scope > .craftChapter"));
      let current = activeRef.current;
      for (const article of articles) {
        const bounds = article.getBoundingClientRect();
        const index = Number(article.dataset.index);
        if (bounds.top <= viewport.top + height * 0.4 && bounds.bottom > viewport.top + height * 0.4) current = index;
        const runway = article.querySelector<HTMLElement>(".craftCoverRunway");
        const surface = article.querySelector<HTMLElement>(".craftCoverSurface");
        if (runway && surface) {
          const top = runway.getBoundingClientRect().top - viewport.top;
          const p = Math.max(0, Math.min(1, (height - top) / (height * 1.7)));
          const t = reduce ? 1 : p;
          surface.style.transform = `scale(${0.8 + 0.2 * t})`;
          surface.style.clipPath = "inset(0 round 16px)";
        }
      }
      const chapter = articles.find(article => Number(article.dataset.index) === current);
      if (chapter && progressRef.current && progressFillRef.current) {
        const bounds = chapter.getBoundingClientRect();
        const study = studyAt(start, current);
        // Complete when the last footer content is visible; hold at 100% until
        // the next cover becomes current. A new chapter starts at zero.
        const distance = Math.max(1, bounds.height - height);
        const progress = Math.max(0, Math.min(1, (viewport.top - bounds.top) / distance));
        progressFillRef.current.style.transform = `scaleX(${progress})`;
        progressFillRef.current.style.backgroundColor = brandColor(study.slug) ?? study.accent ?? "#ffffff";
        progressRef.current.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
        progressRef.current.setAttribute("aria-label", `${study.title} reading progress`);
        progressRef.current.setAttribute("aria-valuetext", `${Math.round(progress * 100)}% of ${study.title}`);
      }
      const cover = chapter?.querySelector<HTMLElement>(".csCover");
      setInCover(cover ? cover.getBoundingClientRect().bottom > viewport.top : true);
      if (current !== activeRef.current) {
        if (chapter && !travelling.current) scrollAnchor.current = { index: current, top: chapter.getBoundingClientRect().top };
        activeRef.current = current;
        setActive(current);
        setVisited(previous => new Set(previous).add(studyAt(start, current).slug));
      }
      const last = articles[articles.length - 1];
      if (last && last.getBoundingClientRect().bottom < viewport.bottom + height * 2) {
        setCount(value => Math.max(value, Number(last.dataset.index) + 2));
      }
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    root.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    const observer = new ResizeObserver(queue);
    for (const node of root.querySelectorAll(":scope > .craftChapter")) observer.observe(node);
    queue();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      root.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [count, firstIndex, active, reduce, start]);

  useEffect(() => {
    if (travelling.current) return;
    if (active === 0 && location.pathname === `/work/${slug}`) return;
    const study = studyAt(start, active);
    // Native replacement retains Next's routing state and the original homepage
    // history entry. Copying the URL or refreshing opens this individual project.
    replaceProjectHistoryUrl(`/work/${study.slug}`);
    document.title = `${study.title} — Mayank Kinger Portfolio`;
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `${location.origin}/work/${study.slug}`);
  }, [active, start, slug, travelRange]);

  useLayoutEffect(() => {
    const pending = pendingJump.current;
    const root = scrollRef.current;
    if (!pending || !root) return;
    const article = root.querySelector<HTMLElement>(`[data-index="${pending.index}"]`);
    const target = article;
    if (!target) return;
    const destination = () => {
      const runway = article?.querySelector<HTMLElement>(".craftCoverRunway");
      const coverTravel = runway ? Math.max(0, runway.offsetHeight - root.clientHeight) : 0;
      return root.scrollTop + target.getBoundingClientRect().top - root.getBoundingClientRect().top + coverTravel;
    };
    pendingJump.current = null;
    // Mount the travel corridor first, then preserve the outgoing position before
    // animating through real case-study content (including backward jumps).
    const source = pending.source;
    if (source) {
      const node = root.querySelector<HTMLElement>(`[data-index="${source.index}"]`);
      if (node) root.scrollTop += node.getBoundingClientRect().top - source.top;
    }
    const origin = root.scrollTop;
    const duration = reduce ? 0 : Math.min(1300, 650 + Math.abs(destination() - origin) / root.clientHeight * 24);
    const started = performance.now();
    const finish = () => {
      travelling.current = false;
      travelFrame.current = 0;
      scrollAnchor.current = { index: pending.index, top: article!.getBoundingClientRect().top };
      activeRef.current = pending.index;
      setActive(pending.index);
      setTravelRange(null);
      const heading = article?.querySelector<HTMLElement>("h1");
      heading?.setAttribute("tabindex", "-1");
      heading?.focus({ preventScroll: true });
    };
    const tick = (now: number) => {
      const p = duration === 0 ? 1 : Math.min(1, (now - started) / duration);
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      root.scrollTo({ top: origin + (destination() - origin) * eased, behavior: "instant" });
      if (p < 1) travelFrame.current = requestAnimationFrame(tick);
      else finish();
    };
    travelling.current = true;
    travelFrame.current = requestAnimationFrame(tick);
  }, [active, count, firstIndex, jumpTick, reduce]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const cancel = () => {
      if (!travelling.current) return;
      cancelAnimationFrame(travelFrame.current);
      travelling.current = false;
      const article = root.querySelector<HTMLElement>(`[data-index="${activeRef.current}"]`);
      if (article) scrollAnchor.current = { index: activeRef.current, top: article.getBoundingClientRect().top };
      setTravelRange(null);
    };
    cancelTravel.current = cancel;
    const onKey = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " ", "Escape"].includes(event.key)) cancel();
    };
    root.addEventListener("wheel", cancel, { passive: true });
    root.addEventListener("touchstart", cancel, { passive: true });
    root.addEventListener("pointerdown", cancel);
    root.addEventListener("keydown", onKey);
    window.addEventListener("resize", cancel);
    return () => {
      cancelAnimationFrame(travelFrame.current);
      root.removeEventListener("wheel", cancel);
      root.removeEventListener("touchstart", cancel);
      root.removeEventListener("pointerdown", cancel);
      root.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", cancel);
    };
  }, []);

  function jumpToProject(targetSlug: string, from: number) {
    const order = studies.findIndex(study => study.slug === targetSlug);
    const root = scrollRef.current;
    if (order < 0 || !root) return;
    cancelTravel.current();
    let target = Math.floor((start + from) / studies.length) * studies.length - start + order;
    if (targetSlug === studyAt(start, from + 1).slug) target = from + 1;
    const source = root.querySelector<HTMLElement>(`[data-index="${from}"]`);
    pendingJump.current = { index: target, source: source ? { index: from, top: source.getBoundingClientRect().top } : undefined };
    scrollAnchor.current = null;
    travelling.current = true;
    setFirstIndex(value => Math.min(value, target));
    setCount(value => Math.max(value, target + 2));
    setTravelRange({ first: Math.min(from, target) - 1, last: Math.max(from, target) + 1 });
    setVisited(previous => new Set(previous).add(targetSlug));
    setJumpTick(value => value + 1);
  }

  return <>
    <div className="craftReadingProgress" ref={progressRef} role="progressbar"
      aria-label={`${studyAt(start, 0).title} reading progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
      <span ref={progressFillRef} />
    </div>
    <div className="craftStream csDetail" ref={scrollRef} data-mode="chapter" data-craft-entry={slug}>
      {Array.from({ length: count - firstIndex }, (_, offset) => {
        const index = firstIndex + offset;
        const mounted = travelRange ? index >= travelRange.first && index <= travelRange.last : Math.abs(index - active) <= 1;
        return <article className="craftChapter" key={index} data-index={index}
          aria-label={`${studyAt(start, index).title} case study`}
          style={mounted ? undefined : { height: heights.get(index) ?? "600svh" }}>
          {mounted && <Chapter index={index} start={start} active={index === active} scrollRef={scrollRef} onClose={onClose} onMeasure={measure} visited={visited} onJump={jumpToProject} />}
        </article>;
      })}
    </div>
    <div className="craftStreamControls">
      <button type="button" className="workFitBtn workFitBtnGhost" onClick={onClose}>← Back</button>
      {!inCover && <CopyEmailButton email={WORK_FIT_CTA.email} label={WORK_FIT_CTA.contactLabel} copiedLabel="Email copied" className="workFitBtn workFitBtnSolid" />}
    </div>

  </>;
}
