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
import { videoAssetUrl } from "@/lib/videoAssetUrl";

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
  /** Leave the poster in place and load the file only while the card is hovered. */
  playOnHover?: boolean;
  hovered?: boolean;
  /** Seek here once before the first hover play. Later pauses resume in place. */
  posterTime?: number;
  /** Keep autoplay enabled for essential preview media when reduced motion is on. */
  respectReducedMotion?: boolean;
  /** Koto-style cursor-following play/pause control for editorial media. */
  floatingControls?: boolean;
  /** Anchor controls to the surrounding case-study frame instead of the video. */
  floatingControlPlacement?: "media" | "container";
  onPlaybackStart?: () => void;
  onPlaybackError?: () => void;
  /**
   * Width / height of the file. Set before any bytes arrive so the player
   * cannot stretch the picture into a default 300×150 box.
   */
  aspectRatio?: number;
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
  playOnHover = false,
  hovered = false,
  posterTime,
  respectReducedMotion = true,
  floatingControls = false,
  floatingControlPlacement = "media",
  onPlaybackStart,
  onPlaybackError,
  aspectRatio,
}: DeferredVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const restPending = useRef(posterTime != null);
  const reducedMotion = useReducedMotion();
  const [requested, setRequested] = useState(activation === "eager" && !playOnHover);
  const [visible, setVisible] = useState(activation === "eager");
  const [playbackIntent, setPlaybackIntent] = useState<
    "auto" | "playing" | "paused"
  >(playOnHover ? "paused" : "auto");
  const playbackIntentRef = useRef(playbackIntent);
  playbackIntentRef.current = playbackIntent;
  const [playing, setPlaying] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [controlHost, setControlHost] = useState<HTMLElement | null>(null);
  const motionAllowed = !respectReducedMotion || !reducedMotion;

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
    if (!playOnHover) return;
    if (hovered) {
      setRequested(true);
      setPlaybackIntent("playing");
      return;
    }
    setPlaybackIntent("paused");
  }, [hovered, playOnHover]);

  useEffect(() => {
    if (activation !== "visible" || playOnHover) return;
    const video = videoRef.current;
    if (!video) return;
    const scrollRoot = nearestScrollParent(video);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setRequested(true);
        }
      },
      { root: scrollRoot, rootMargin: loadMargin, threshold: 0.01 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [activation, loadMargin, playOnHover]);

  const syncPlayback = useCallback(
    (video: HTMLVideoElement) => {
      video.playbackRate = playbackRate;

      const shouldPlay =
        motionAllowed &&
        (playbackIntent === "playing"
          ? visible || playOnHover
          : playbackIntent === "auto" && visible);

      if (shouldPlay) {
        const play = () => {
          // Loading and hydration can briefly make play() reject. Keep the
          // original intent so onCanPlay can retry instead of freezing on poster.
          void video.play().catch(() => setPlaying(false));
        };
        if (playOnHover && posterTime != null && restPending.current) {
          const startAtRest = () => {
            if (!restPending.current) {
              play();
              return;
            }
            if (Math.abs(video.currentTime - posterTime) <= 0.03) {
              restPending.current = false;
              play();
              return;
            }
            video.addEventListener(
              "seeked",
              () => {
                restPending.current = false;
                if (playbackIntentRef.current === "playing") play();
              },
              { once: true },
            );
            video.currentTime = posterTime;
          };
          if (video.readyState >= 1) startAtRest();
          else video.addEventListener("loadedmetadata", startAtRest, { once: true });
          return;
        }
        play();
      } else {
        video.pause();
      }
    },
    [motionAllowed, playOnHover, playbackIntent, playbackRate, posterTime, visible],
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !requested) return;
    syncPlayback(video);
  }, [requested, syncPlayback]);

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
        width={aspectRatio ? 1600 : undefined}
        height={aspectRatio ? Math.max(1, Math.round(1600 / aspectRatio)) : undefined}
        style={{
          ...style,
          ...(aspectRatio ? { aspectRatio: String(aspectRatio) } : {}),
        }}
        src={requested && motionAllowed ? videoAssetUrl(src) : undefined}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay={activation === "eager" && motionAllowed && !playOnHover}
        preload={requested ? "metadata" : "none"}
        onCanPlay={(event) => syncPlayback(event.currentTarget)}
        onPlay={() => {
          setPlaying(true);
          setRevealed(true);
          onPlaybackStart?.();
        }}
        onPause={() => setPlaying(false)}
        onError={() => onPlaybackError?.()}
      />
      {poster && !revealed ? (
        // The video poster is stretched until the file header arrives. A real
        // image keeps the still in the right shape for that whole wait.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={className}
          src={poster}
          alt=""
          style={{
            ...style,
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            maxWidth: "none",
            maxHeight: "none",
            zIndex: 1,
            ...(aspectRatio ? { aspectRatio: String(aspectRatio) } : {}),
          }}
        />
      ) : null}
      {floatingControlPlacement === "container" && controlHost
        ? createPortal(floatingControl, controlHost)
        : floatingControlPlacement === "media"
          ? floatingControl
          : null}
    </Fragment>
  );
}
