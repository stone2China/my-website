import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // ❌ 删除或注释掉：output: "export",
  // ✅ 修改为：
  output: "standalone", 
  
  // ❌ 建议删除，静态路径适配在 Worker 模式下通常不需要
  // trailingSlash: true, 

  images: {
    // 在 Worker 模式下可以保持 true，除非你配置了专门的图片优化服务
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