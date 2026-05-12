import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: "export",      // 必须：启用静态导出
  trailingSlash: true,   // 必须：适配静态路径访问
  images: {
    unoptimized: true,   // 必须：静态模式不支持图片优化
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/u/**" },
      { protocol: "https", hostname: "serinanya.cn", pathname: "/**" },
      // ... 其余配置保持不变
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