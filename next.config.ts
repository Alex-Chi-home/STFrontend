import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // фронтенд будет обращаться к /api/...
        destination: "http://10.90.15.41:5555/api/:path*", // прокси на HTTP API
      },
    ];
  },
};

export default nextConfig;
