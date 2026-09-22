"use client";

import {
  useEffect,
  useRef,
  useState,
  type ImgHTMLAttributes,
} from "react";

type DeferredImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "alt"> & {
  alt: string;
  loadMargin?: string;
  eager?: boolean;
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
  ...props
}: DeferredImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [requested, setRequested] = useState(eager);

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
    // Intentional: the source is withheld until the custom scroll root is near.
    // next/image cannot represent that source-less pre-intersection state.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={alt}
      ref={ref}
      src={requested ? src : undefined}
      srcSet={requested ? srcSet : undefined}
      sizes={requested ? sizes : undefined}
      loading={eager ? "eager" : "lazy"}
      decoding={props.decoding ?? "async"}
    />
  );
}
