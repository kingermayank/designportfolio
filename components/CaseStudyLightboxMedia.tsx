"use client";

import DeferredImage from "@/components/DeferredImage";
import DeferredVideo from "@/components/DeferredVideo";
import { videoAssetUrl } from "@/lib/videoAssetUrl";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type LightboxState = "idle" | "open" | "closing";

type CaseStudyLightboxMediaProps = {
  src: string;
  alt?: string;
  video?: boolean;
  className?: string;
};

export default function CaseStudyLightboxMedia({
  src,
  alt = "",
  video = false,
  className,
}: CaseStudyLightboxMediaProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [lightboxState, setLightboxState] = useState<LightboxState>("idle");
  const mediaLabel = alt || (video ? "Case study video" : "Case study image");

  const openLightbox = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    setMounted(true);
    setLightboxState("idle");
  };

  const closeLightbox = useCallback(() => {
    if (!mounted || lightboxState === "closing") return;

    setLightboxState("closing");
    const closeMs =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--modal-close-dur",
        ),
      ) || 150;

    closeTimerRef.current = window.setTimeout(() => {
      setMounted(false);
      setLightboxState("idle");
      triggerRef.current?.focus();
    }, closeMs);
  }, [lightboxState, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const frame = window.requestAnimationFrame(() => {
      setLightboxState("open");
      closeRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      closeLightbox();
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [closeLightbox, mounted]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    },
    [],
  );

  const lightbox = mounted ? (
    <div
      className={`caseStudyLightbox${lightboxState === "open" ? " is-open" : ""}${lightboxState === "closing" ? " is-closing" : ""}`}
    >
      <div className="caseStudyLightboxScrim" onClick={closeLightbox} />
      <div
        className={`caseStudyLightboxDialog t-modal${lightboxState === "open" ? " is-open" : ""}${lightboxState === "closing" ? " is-closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={`Enlarged ${mediaLabel}`}
      >
        <div className="caseStudyLightboxMedia">
          {video ? (
            <video src={videoAssetUrl(src)} controls autoPlay muted loop playsInline />
          ) : (
            // The lightbox should use the full-resolution original on demand.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} />
          )}
          <button
            ref={closeRef}
            type="button"
            className="caseStudyLightboxClose"
            aria-label="Close enlarged media"
            onClick={closeLightbox}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="caseStudyLightboxTrigger"
        aria-label={`Enlarge ${mediaLabel}`}
        onClick={openLightbox}
      >
        {video ? (
          <DeferredVideo
            src={src}
            activation="visible"
            className={className}
          />
        ) : (
          <DeferredImage src={src} alt={alt} className={className} />
        )}
      </button>
      {mounted ? createPortal(lightbox, document.body) : null}
    </>
  );
}
