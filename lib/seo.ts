import type { Metadata } from "next";

export const SITE_URL = new URL("https://www.kingermayank.com");
export const SITE_NAME = "Mayank Kinger — Portfolio";
export const DEFAULT_TITLE = "Mayank Kinger — Product Designer & Design Engineer";
export const DEFAULT_DESCRIPTION =
  "Mayank Kinger is a product designer and high-agency builder crafting thoughtful digital products, scalable systems, and polished interactive experiences.";

const SOCIAL_IMAGE = {
  url: "/social/mayank-kinger-portfolio.png",
  width: 1200,
  height: 630,
  alt: "Mayank Kinger portfolio homepage featuring product design and design engineering work",
};

type SeoOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };
  type?: "website" | "article";
};

export function createMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image,
  type = "website",
}: SeoOptions = {}): Metadata {
  const resolvedTitle = title
    ? `${title} — Mayank Kinger Portfolio`
    : DEFAULT_TITLE;
  const socialImage = image ?? SOCIAL_IMAGE;

  return {
    title: resolvedTitle,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: resolvedTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      creator: "@kingermayank",
      images: [socialImage],
    },
  };
}
