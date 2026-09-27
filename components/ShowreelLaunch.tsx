"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ShowreelLaunchProps = {
  src: string;
  poster?: string;
};

function nearestScrollParent(element: HTMLElement) {
  let parent = element.parentElement;

  while (parent) {
    const { overflowY } = window.getComputedStyle(parent);
    if (/(auto|scroll|overlay)/.test(overflowY)) return parent;
    parent = parent.parentElement;
  }

  return null;
}

const START_SECONDS = 2;
const IDLE_MS = 3000;

export default function ShowreelLaunch({ src, poster }: ShowreelLaunchProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const parked = useRef(true);
  const idleTimer = useRef<number | null>(null);
  const [requested, setRequested] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [idle, setIdle] = useState(false);

  const setVideoNode = useCallback((video: HTMLVideoElement | null) => {
    videoRef.current = video;
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const scrollRoot = nearestScrollParent(video);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRequested(true);
      },
      { root: scrollRoot, rootMargin: "240px 0px", threshold: 0.01 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const clearIdle = () => {
    if (idleTimer.current == null) return;
    window.clearTimeout(idleTimer.current);
    idleTimer.current = null;
  };

  const armIdle = () => {
    clearIdle();
    setIdle(false);
    idleTimer.current = window.setTimeout(() => setIdle(true), IDLE_MS);
  };

  useEffect(() => {
    if (!playing || !hovering) {
      clearIdle();
      return;
    }
    armIdle();
    return clearIdle;
  }, [playing, hovering]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!video.paused && !video.ended) {
      video.pause();
      return;
    }

    parked.current = false;
    if (video.ended || video.currentTime < START_SECONDS) {
      video.currentTime = START_SECONDS;
    }
    video.muted = false;
    void video.play().catch(() => undefined);
  };

  const controlsVisible = !playing || (hovering && !idle);
  const label = ended ? "Replay" : playing ? "Pause" : "Play";

  return (
    <button
      type="button"
      className="showreelLaunch"
      data-playing={playing ? "true" : "false"}
      data-controls={controlsVisible ? "visible" : "hidden"}
      aria-label={ended ? "Replay video" : playing ? "Pause video" : "Play video"}
      onClick={toggle}
      onMouseEnter={() => {
        setHovering(true);
        if (!videoRef.current?.paused) armIdle();
      }}
      onMouseMove={() => {
        if (!videoRef.current?.paused) armIdle();
      }}
      onMouseLeave={() => {
        setHovering(false);
        setIdle(false);
        clearIdle();
      }}
    >
      <video
        ref={setVideoNode}
        className="csFill showreelPreview"
        src={requested ? src : undefined}
        poster={poster}
        playsInline
        preload={requested ? "auto" : "none"}
        onLoadedData={(event) => {
          const video = event.currentTarget;
          if (parked.current && video.paused) video.currentTime = START_SECONDS;
        }}
        onPlay={() => {
          setPlaying(true);
          setEnded(false);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setEnded(true);
        }}
      />
      <span className="showreelScrim" aria-hidden="true" />
      <span className="showreelPlay" aria-hidden="true">
        {playing ? (
          <svg className="showreelPlayIcon" viewBox="0 0 24 24">
            <path d="M6.5 4.5h3.5v15H6.5zM14 4.5h3.5v15H14z" />
          </svg>
        ) : ended ? (
          <svg className="showreelPlayIcon" viewBox="0 0 24 24">
            <path d="M12 5V2.2L7.2 6.2 12 10.2V7.4a5.6 5.6 0 1 1-5.1 3.3l-2.3-1A8 8 0 1 0 12 5z" />
          </svg>
        ) : (
          <svg className="showreelPlayIcon" viewBox="0 0 24 24">
            <path d="M7 4.2 19.2 12 7 19.8Z" />
          </svg>
        )}
        <span className="showreelPlayLabel">{label}</span>
      </span>
    </button>
  );
}
