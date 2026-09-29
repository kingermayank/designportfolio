import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85],
    // Local assets use these query strings to refresh cached image revisions.
    localPatterns: [
      { pathname: "/**", search: "" },
      ...[1, 2, 3, 4, 5].map((version) => ({
        pathname: "/**",
        search: `?v=${version}`,
      })),
      { pathname: "/all-logos/npm.png", search: "?v=cf01fda6" },
    ],
  },
  async headers() {
    return [
      {
        source:
          "/:path*\\.(mp4|webm|mov|png|jpg|jpeg|webp|avif|svg|woff2|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/product-thinking",
        destination: "/product-strategy",
        permanent: true,
      },
      {
        source: "/product-thinking/:slug",
        destination: "/product-strategy/:slug",
        permanent: true,
      },
      {
        source: "/work/ikon-data-dictionary",
        destination: "/product-strategy/ikon-data-dictionary",
        permanent: true,
      },
      {
        source: "/work/ikon-service-blueprint",
        destination: "/product-strategy/ikon-service-blueprint",
        permanent: true,
      },
      {
        source: "/work/ikon-analytics",
        destination: "/product-strategy/ikon-analytics",
        permanent: true,
      },
      {
        source: "/work/ikon-agentic-outreach",
        destination: "/product-strategy/ikon-agentic-outreach",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
