import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // 必须：Cloudflare Workers 部署 Next.js 必须开启独立输出
  output: "standalone", 

  images: {
    // 静态资源优化在 Worker 环境建议关闭，以避免构建失败
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
    // 处理 SVG 文件
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // 处理 ABC 乐谱文件：解决日志中的 Unknown module type 错误
    config.module.rules.push({
      test: /\.abc$/,
      use: ["raw-loader"],
    });

    return config;
  },
};

export default nextConfig;