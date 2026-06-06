import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import { Footer } from "./footer";
import LogoIcon from "@/assets/logo.png";
import "./globals.css";
import { cn } from "@/lib/utils";
import { googleSansCode, notoSansSC } from "@/lib/fonts";
import { ThemeToggle } from "@/components/theme-toggle";

const baiduAnalyticsScript = `
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?2255a6caae3ec9601a1509d6cbb4aa52";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
`;

export const metadata: Metadata = {
  title: "DevSidecar 下载站",
  description: "DevSidecar — 开发者边车，通过本地代理改善国内访问 GitHub 等境外网站的体验。在此下载各平台安装包。",
  icons: LogoIcon.src
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-cn" suppressHydrationWarning>
      <head>
        <Script>{baiduAnalyticsScript}</Script>
      </head>
      <body className={cn("flex flex-col items-center min-h-screen antialiased", notoSansSC.className, googleSansCode.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem>
          {children}
          <Footer />
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
