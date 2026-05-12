import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: "export",      // 必须：静态导出模式
  trailingSlash: true,   // 必须：适配 Cloudflare 的路径访问
  images: {
    unoptimized: true,   // 必须：静态导出不支持图片优化
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/u/**" },
      { protocol: "https", hostname: "serinanya.cn", pathname: "/**" },
      { protocol: "https", hostname: "yunyoujun.cn", pathname: "/**" },
      // ... 你其他的远程图片配置保持不变
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