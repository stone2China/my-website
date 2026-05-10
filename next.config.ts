/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. 核心修改：必须开启 standalone 模式
  output: "standalone", 
  
  reactStrictMode: false,
  
  // 2. 建议修改：在 Worker 环境中，Next.js 默认图片优化可能会报错
  // 如果部署后图片打不开，建议将 unoptimized 设为 true
  images: {
    unoptimized: true, 
    remotePatterns: [
      { protocol: "https", hostname: "nocp.space", pathname: "/**" },
      { protocol: "https", hostname: "github.com", pathname: "/**" },
      { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/u/**" },
      { protocol: "https", hostname: "serinanya.cn", pathname: "/**" },
      { protocol: "https", hostname: "yunyoujun.cn", pathname: "/**" },
      { protocol: "https", hostname: "blog.liuzhen932.top", pathname: "/**" },
      { protocol: "https", hostname: "blog.byteloid.one", pathname: "/img/**" },
      { protocol: "https", hostname: "thirdqq.qlogo.cn", pathname: "/g" },
      { protocol: "https", hostname: "ttio.cc", pathname: "/**" },
      { protocol: "https", hostname: "772123.xyz", pathname: "/**" },
      { protocol: "https", hostname: "smite.work", pathname: "/**" },
      { protocol: "https", hostname: "casear.net", pathname: "/static/img/**" },
      { protocol: "https", hostname: "opanel.cn", pathname: "/static/**" },
      { protocol: "https", hostname: "q1.qlogo.cn", pathname: "/g" },
      { protocol: "https", hostname: "henlo.cc", pathname: "/static/**" },
      { protocol: "https", hostname: "vnyzm.top", pathname: "/img/**" },
      { protocol: "https", hostname: "mgrowup.com", pathname: "/**" },
      { protocol: "https", hostname: "worable.top", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "nernge.cn", pathname: "/upload/**" },
      { protocol: "https", hostname: "blog.liseezn.top", pathname: "/**" },
      { protocol: "https", hostname: "limening.vercel.app", pathname: "/img/base/**" }
    ]
  },

  turbopack: {
    rules: {
      "*.svg": { loaders: ["@svgr/webpack"], as: "*.js" },
      "*.abc": { loaders: ["raw-loader"], as: "*.js" }
    }
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

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;