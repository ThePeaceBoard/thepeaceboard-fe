// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  // Serve static files from node_modules
  async rewrites() {
    return [
      {
        source: '/node_modules/:path*',
        destination: '/node_modules/:path*',
      },
    ];
  },
};

export default nextConfig;
