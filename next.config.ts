// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ skip ESLint during `next build`
  eslint: { ignoreDuringBuilds: true },

  // ✅ skip TS type-check errors during `next build`
  typescript: { ignoreBuildErrors: true },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  async rewrites() {
    return [
      {
        source: "/node_modules/:path*",
        destination: "/node_modules/:path*",
      },
    ];
  },
};

export default nextConfig;
