import type { Metadata } from "next";
import localFont from "next/font/local";
import { Caveat, Geist, Geist_Mono } from "next/font/google";
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

// Body / UI — Regular for copy, Medium/SemiBold for headings & labels
const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

// Work 1 only — GT Walsheim Regular + Condensed Regular (trial)
const walsheim = localFont({
  src: "../public/fonts/GT-Walsheim-Regular.woff2",
  weight: "400",
  style: "normal",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${greedNarrow.variable} ${geist.variable} ${geistMono.variable} ${walsheim.variable} ${walsheimCondensed.variable} ${cesare.variable} ${caveat.variable} ${gothamNarrow.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
