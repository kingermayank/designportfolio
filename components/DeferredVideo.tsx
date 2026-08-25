"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
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
  /** Koto-style cursor-following play/pause control for editorial media. */
  floatingControls?: boolean;
  /** Anchor controls to the surrounding case-study frame instead of the video. */
  floatingControlPlacement?: "media" | "container";
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
  floatingControls = false,
  floatingControlPlacement = "media",
}: DeferredVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const [requested, setRequested] = useState(activation === "eager");
  const [visible, setVisible] = useState(activation === "eager");
  const [playbackIntent, setPlaybackIntent] = useState<
    "auto" | "playing" | "paused"
  >("auto");
  const [playing, setPlaying] = useState(false);
  const [controlHost, setControlHost] = useState<HTMLElement | null>(null);

  const setVideoNode = useCallback(
    (video: HTMLVideoElement | null) => {
      videoRef.current = video;
      setControlHost(
        floatingControls && floatingControlPlacement === "container"
          ? (video?.closest<HTMLElement>(".csMediaHoverWrap") ??
              video?.closest<HTMLElement>(".csMedia") ??
              null)
          : null,
      );
    },
    [floatingControlPlacement, floatingControls],
  );

  useEffect(() => {
    if (activation !== "visible") return;
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
  }, [activation, loadMargin]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !requested) return;
    video.playbackRate = playbackRate;

    const shouldPlay =
      visible &&
      (playbackIntent === "playing" ||
        (playbackIntent === "auto" && !reducedMotion));

    if (shouldPlay) {
      void video.play().catch(() => {
        setPlaying(false);
        setPlaybackIntent("paused");
      });
    } else {
      video.pause();
    }
  }, [playbackIntent, playbackRate, reducedMotion, requested, visible]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!video.paused && !video.ended) {
      setPlaybackIntent("paused");
      video.pause();
      return;
    }

    setRequested(true);
    setPlaybackIntent("playing");
  };

  const floatingControl = floatingControls ? (
    <button
      className="floatingVideoControl"
      type="button"
      aria-label={playing ? "Pause video" : "Play video"}
      data-playing={playing ? "true" : "false"}
      onClick={togglePlayback}
    >
      <span className="floatingVideoControlDisc" aria-hidden="true">
        <svg
          className="floatingVideoControlIcon floatingVideoControlPause"
          viewBox="0 0 24 24"
        >
          <path d="M7.5 5.5h3v13h-3zM13.5 5.5h3v13h-3z" />
        </svg>
        <svg
          className="floatingVideoControlIcon floatingVideoControlPlay"
          viewBox="0 0 24 24"
        >
          <path d="m8.25 5.25 10.5 6.75-10.5 6.75z" />
        </svg>
      </span>
    </button>
  ) : null;

  return (
    <Fragment>
      {posterPriority && poster ? (
        <link rel="preload" as="image" href={poster} />
      ) : null}
      <video
        ref={setVideoNode}
        className={className}
        style={style}
        src={requested && !reducedMotion ? src : undefined}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay={activation === "eager" && !reducedMotion}
        preload={requested ? "auto" : "none"}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {floatingControlPlacement === "container" && controlHost
        ? createPortal(floatingControl, controlHost)
        : floatingControlPlacement === "media"
          ? floatingControl
          : null}
    </Fragment>
  );
}
