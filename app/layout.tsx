import type { Metadata } from "next";
import localFont from "next/font/local";
import { Caveat } from "next/font/google";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

// Display: Greed Narrow — Regular for large display, SemiBold for mid titles.
const greedNarrow = localFont({
  src: [
    {
      path: "../public/fonts/GreedNarrow-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/GreedNarrow-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/GreedNarrow-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-greed-narrow",
  display: "swap",
});

// Body / UI — GT Walsheim Regular + Medium (trial)
const walsheim = localFont({
  src: [
    {
      path: "../public/fonts/GT-Walsheim-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/GT-Walsheim-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-walsheim",
  display: "swap",
});

const walsheimCondensed = localFont({
  src: "../public/fonts/GT-Walsheim-Condensed-Regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-walsheim-condensed",
  display: "swap",
});

// Small caps / UI labels — Nitti PX Bold (Semibold weight)
const nittiPx = localFont({
  src: [
    {
      path: "../public/fonts/NittiPX-Bold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-nitti-px",
  display: "swap",
});

// Work 1 wordmark
const cesare = localFont({
  src: "../public/fonts/Cesare-Regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-cesare",
  display: "swap",
});

// Hiring letter greeting / signature (handwritten note aesthetic)
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-letter",
  display: "swap",
});

// PathAI Region Comments UI — Figma uses Gotham Narrow Book (325) / Medium (350, 500)
const gothamNarrow = localFont({
  src: [
    {
      path: "../public/fonts/GothamNarrow-Book.otf",
      weight: "325",
      style: "normal",
    },
    {
      path: "../public/fonts/GothamNarrow-Medium.otf",
      weight: "350",
      style: "normal",
    },
    {
      path: "../public/fonts/GothamNarrow-Medium.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-gotham-narrow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mayank Kinger",
  description:
    "Product designer and high agency builder with a founder's mindset who ships experiences with speed, taste, and judgement.",
  icons: {
    icon: [
      {
        url: "/icons/favicon-light.png",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icons/favicon-dark.png",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${greedNarrow.variable} ${walsheim.variable} ${walsheimCondensed.variable} ${nittiPx.variable} ${cesare.variable} ${caveat.variable} ${gothamNarrow.variable}`}
    >
      <body>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
