import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: "standalone",
  allowedDevOrigins: ["127.0.0.1", "localhost"],

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/u/**" },
      { protocol: "https", hostname: "serinanya.cn", pathname: "/**" },
    ]
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"], 
    });
    config.module.rules.push({
      test: /\.abc$/,
      use: ["raw-loader"]
    });
    return config;
  },
};

export default nextConfig;
