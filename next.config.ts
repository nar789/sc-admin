import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "169.211.13.15",
        port: "1231",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
