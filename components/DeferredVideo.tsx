"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useReducedMotion } from "framer-motion";

type DeferredVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  style?: CSSProperties;
  playbackRate?: number;
  posterPriority?: boolean;
  loadMargin?: string;
  /**
   * `eager` starts loading immediately, while the poster remains visible until
   * playback. `visible` starts shortly before the media scrolls into view.
   */
  activation?: "eager" | "visible";
};

function nearestScrollParent(element: HTMLElement) {
  let parent = element.parentElement;

  while (parent) {
    const { overflowY } = window.getComputedStyle(parent);
    const scrollable = /(auto|scroll|overlay)/.test(overflowY);
    if (scrollable) return parent;
    parent = parent.parentElement;
  }

  return null;
}

/**
 * Poster-first decorative video. The source is immediate only for explicitly
 * eager media; below-fold video bytes stay off the network until useful.
 */
export default function DeferredVideo({
  src,
  poster,
  className,
  style,
  playbackRate = 1,
  posterPriority = false,
  loadMargin = "240px 0px",
  activation = "visible",
}: DeferredVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const [requested, setRequested] = useState(activation === "eager");
  const [visible, setVisible] = useState(activation === "eager");

  useEffect(() => {
    if (activation !== "visible" || reducedMotion) return;
    const video = videoRef.current;
    if (!video) return;
    const scrollRoot = nearestScrollParent(video);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setRequested(true);
      },
      { root: scrollRoot, rootMargin: loadMargin, threshold: 0.01 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [activation, loadMargin, reducedMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !requested || reducedMotion) return;
    video.playbackRate = playbackRate;

    if (visible) void video.play().catch(() => {});
    else video.pause();
  }, [playbackRate, reducedMotion, requested, visible]);

  return (
    <Fragment>
      {posterPriority && poster ? (
        <link rel="preload" as="image" href={poster} />
      ) : null}
      <video
        ref={videoRef}
        className={className}
        style={style}
        src={requested && !reducedMotion ? src : undefined}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay={activation === "eager" && !reducedMotion}
        preload={requested ? "auto" : "none"}
      />
    </Fragment>
  );
}
