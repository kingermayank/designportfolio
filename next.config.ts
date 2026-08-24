import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ];
  },
};

export default nextConfig;
