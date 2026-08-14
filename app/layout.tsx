import type { Metadata } from "next";
import localFont from "next/font/local";
import { Azeret_Mono, Caveat } from "next/font/google";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

// The whole site runs on three faces: Azeret (everything), Azeret Mono (small
// labels — dates, badges, button text), and Cesare (the Work 1 wordmark).
// Caveat is the one exception, scoped to the hiring letter's handwriting.
// Azeret is a trial licence — only Regular and Medium ship, so 600 maps onto
// Medium rather than synthesizing a bold.
const azeret = localFont({
  src: [
    {
      path: "../public/fonts/Azeret-TRIAL-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Azeret-TRIAL-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Azeret-TRIAL-Medium.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-azeret",
  display: "swap",
});

const azeretMono = Azeret_Mono({
  subsets: ["latin"],
  variable: "--font-azeret-mono",
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
      className={`${azeret.variable} ${azeretMono.variable} ${cesare.variable} ${caveat.variable} ${gothamNarrow.variable}`}
    >
      <body>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
