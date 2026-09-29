"use client";

import {
  useEffect,
  useRef,
  useState,
  type ImgHTMLAttributes,
} from "react";
import { getImageProps } from "next/image";
import { MEDIA_BLURS, MEDIA_IMAGE_BYTES } from "@/lib/mediaBlurData.generated";

type DeferredImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "alt"> & {
  alt: string;
  loadMargin?: string;
  eager?: boolean;
  quality?: 75 | 85;
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

/**
 * Native lazy-loading eagerly fetches images inside the site's fixed scroll
 * panels in some browsers. Keep the URL off the element until it approaches
 * the panel viewport so below-fold case-study media stays off the network.
 */
export default function DeferredImage({
  src,
  srcSet,
  sizes,
  alt,
  loadMargin = "320px 0px",
  eager = false,
  quality = 85,
  ...props
}: DeferredImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [requested, setRequested] = useState(eager);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const imageSrc = typeof src === "string" ? src : undefined;
  const sourcePath = imageSrc?.split("?")[0];
  const sourceBytes = sourcePath ? MEDIA_IMAGE_BYTES[sourcePath] : undefined;
  // Tiny pre-compressed originals are often faster (and sharper) than another
  // image-optimizer request. Larger images get responsive width candidates.
  const optimize = sourceBytes === undefined || sourceBytes > 200 * 1024;
  const responsive = imageSrc && !srcSet && optimize && /^\/[^?]+\.(?:avif|jpe?g|png|webp)(?:\?.*)?$/i.test(imageSrc)
    ? getImageProps({
        src: imageSrc,
        alt,
        fill: true,
        sizes: sizes ?? "(max-width: 720px) 100vw, (max-width: 1440px) 75vw, 1400px",
        quality,
      }).props
    : null;
  const blur = sourcePath ? MEDIA_BLURS[sourcePath] : undefined;

  useEffect(() => {
    if (requested) return;
    const image = ref.current;
    if (!image) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRequested(true);
        observer.disconnect();
      },
      {
        root: nearestScrollParent(image),
        rootMargin: loadMargin,
        threshold: 0.01,
      },
    );

    observer.observe(image);
    return () => observer.disconnect();
  }, [loadMargin, requested]);

  return (
    // Keep the full source offscreen, but paint a tiny inline preview immediately.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={alt}
      ref={ref}
      src={requested ? (responsive?.src ?? src) : undefined}
      srcSet={requested ? (srcSet ?? responsive?.srcSet) : undefined}
      sizes={requested ? (sizes ?? responsive?.sizes) : undefined}
      style={{
        ...props.style,
        ...(blur && loadedSrc !== imageSrc
          ? { backgroundImage: `url("${blur}")`, backgroundSize: "100% 100%" }
          : {}),
      }}
      loading={eager ? "eager" : "lazy"}
      decoding={props.decoding ?? "async"}
      onLoad={(event) => {
        setLoadedSrc(imageSrc ?? null);
        props.onLoad?.(event);
      }}
    />
  );
}
