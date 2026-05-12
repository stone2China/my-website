import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: "export",      // 必须开启，用于导出纯静态文件
  trailingSlash: true,   // 必须开启，确保路径以 / 结尾，适配 GitHub Pages
  
  // 💡 如果你还没绑定 nocp.space 域名，请取消下面这行的注释
  // basePath: "/my-website", 

  images: {
    unoptimized: true,   // 静态导出不支持 Next.js 的图片优化，必须关闭
    remotePatterns: [
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
      { protocol: "https", hostname: "limening.vercel.app", pathname: "/img/base/**" },
      { protocol: "https", hostname: "qingzhou.dpdns.org", pathname: "/**" }
    ]
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  webpack(config) {
    // 适配 SVG 
    config.module.rules.push({
      test: /\.svg$/,
      loader: "@svgr/webpack",
    });
    // 适配你的吉他曲谱文件
    config.module.rules.push({
      test: /\.abc$/,
      loader: "raw-loader"
    });
    return config;
  },
};

export default nextConfig;