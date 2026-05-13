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
    // ✅ 删掉之前的 turbo 部分，Webpack 模式不需要它
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
