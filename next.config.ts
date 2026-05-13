import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: "standalone", 

  images: {
    unoptimized: true, 
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/u/**" },
      { protocol: "https", hostname: "serinanya.cn", pathname: "/**" },
    ]
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
    // ✅ 新增：为 Turbopack 配置自定义 loader 适配
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
        '*.abc': {
          loaders: ['raw-loader'],
          as: '*.js',
        },
      },
    },
  },
  // 保留 webpack 配置以确保向下兼容
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