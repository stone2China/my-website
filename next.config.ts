import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: "export",      // 💡 核心：告诉 Next.js 只生成静态 HTML/CSS/JS
  trailingSlash: true,   // 💡 核心：适配 Cloudflare 的目录访问方式
  images: {
    unoptimized: true,   // 💡 核心：静态模式不支持图片优化
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/u/**" },
      { protocol: "https", hostname: "serinanya.cn", pathname: "/**" },
      // ...保持你之前的 remotePatterns 列表不变
    ]
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      loader: "@svgr/webpack",
    });
    config.module.rules.push({
      test: /\.abc$/,
      loader: "raw-loader"
    });
    return config;
  },
};

export default nextConfig;