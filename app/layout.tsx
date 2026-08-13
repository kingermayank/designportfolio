import type { Metadata } from "next";
import localFont from "next/font/local";
import { Caveat, Geist, Geist_Mono } from "next/font/google";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

// The whole site runs on three faces: Geist (everything), Geist Mono (small
// labels — dates, badges, button text), and Cesare (the Work 1 wordmark).
// Caveat is the one exception, scoped to the hiring letter's handwriting.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
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
      className={`${geist.variable} ${geistMono.variable} ${cesare.variable} ${caveat.variable} ${gothamNarrow.variable}`}
    >
      <body>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
