import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  
  // Cloudflare Workers / OpenNext 环境通常建议使用 standalone
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
    // ✅ 告诉 Next.js 16 你的自定义 Webpack 配置需要如何映射到 Turbopack (或者留空强制报错提醒)
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
        "*.abc": {
          loaders: ["raw-loader"],
          as: "*.js",
        }
      }
    }
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"], // 建议用 use 代替 loader
    });
    config.module.rules.push({
      test: /\.abc$/,
      use: ["raw-loader"]
    });
    return config;
  },
};

export default nextConfig;
