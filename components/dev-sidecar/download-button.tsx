"use client";

import Link from "next/link";
import { Download, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { GitHubRelease, GitHubAsset } from "@/lib/dev-sidecar/api";

export function DownloadButton({
  release,
  asset,
  label,
  isStable = false,
  mirror = null,
}: {
  release: GitHubRelease
  asset: GitHubAsset | null
  label: string
  isStable?: boolean
  mirror?: string | null
}) {
  const version = release.tag_name.replace(/^v/, "");

  const directUrl = asset?.browser_download_url ?? "#";
  const isMirror = !!mirror && mirror !== "__proxy__";
  const isProxy = mirror === "__proxy__";
  const downloadUrl = isProxy
    ? `/api/download?url=${encodeURIComponent(directUrl)}`
    : mirror
      ? directUrl.replace("https://github.com/", mirror)
      : directUrl;

  const formatSize = (bytes: number): string => {
    const kb = bytes / 1024;
    const mb = kb / 1024;
    const gb = mb / 1024;
    const tb = gb / 1024;
    const pb = tb / 1024;
    if(tb >= 1024) return `${pb.toFixed(2)} PB`;
    if(gb >= 1024) return `${tb.toFixed(2)} TB`;
    if(mb >= 1024) return `${gb.toFixed(2)} GB`;
    if(kb >= 1024) return `${mb.toFixed(2)} MB`;
    return `${kb.toFixed(2)} KB`;
  };

  const describeAsset = (filename: string): string => {
    const map: Record<string, string> = {
      "windows-universal.exe": "Windows 通用安装包",
      "windows-x86_64.exe": "Windows x64 安装包",
      "windows-x64.exe": "Windows x64 安装包",
      "windows-arm64.exe": "Windows ARM64 安装包",
      "windows-ia32.exe": "Windows x86 安装包",
      "macos-universal.dmg": "macOS 通用安装包",
      "macos-arm64.dmg": "macOS ARM64 安装包",
      "macos-x86_64.dmg": "macOS Intel 安装包",
      "linux-x86_64.deb": "Linux x64 (.deb)",
      "linux-arm64.deb": "Linux ARM64 (.deb)",
      "linux-armv7l.deb": "Linux ARM v7l (.deb)",
      "linux-x86_64.AppImage": "Linux x64 (.AppImage)",
      "linux-arm64.AppImage": "Linux ARM64 (.AppImage)",
      "linux-armv7l.AppImage": "Linux ARM v7l (.AppImage)",
      "linux-x86_64.tar.gz": "Linux x64 (.tar.gz)",
      "linux-arm64.tar.gz": "Linux ARM64 (.tar.gz)",
      "linux-armv7l.tar.gz": "Linux ARM v7l (.tar.gz)",
      "linux-x86_64.rpm": "Linux x64 (.rpm)",
      "linux-arm64.rpm": "Linux ARM64 (.rpm)",
      "linux-armv7l.rpm": "Linux ARM v7l (.rpm)",
    };
    const match = filename.match(/DevSidecar-\d+\.\d+\.[^-]+-(.+)/);
    if (!match) return filename;
    const key = match[1];
    return map[key] ?? filename;
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <Button className="w-full h-fit justify-between" variant={isStable ? "default" : "outline"} asChild>
        <Link href={downloadUrl} target="_blank" className="no-underline">
          {isProxy ? <Download /> : isMirror ? <Zap /> : <Download />}
          <div className="flex flex-col items-center gap-0.5">
            <span>DevSidecar <code>{version}</code></span>
            <span className={cn("text-[10px]", !isStable && "text-destructive")}>
              {isProxy ? "服务器下载" : isMirror ? "加速下载" : label}
            </span>
          </div>
          {isProxy ? <Download className="opacity-0"/> : isMirror ? <Zap className="opacity-0"/> : <Download className="opacity-0"/>}
        </Link>
      </Button>
      {asset && (
        <div className="w-full flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
          <span>
            {formatSize(asset.size)}
          </span>
          <span>·</span>
          <span className="truncate max-w-48">{describeAsset(asset.name)}</span>
          {(isMirror || isProxy) && (
            <>
              <span>·</span>
              <span className="text-[9px] text-primary/60">{isProxy ? "代理" : "镜像"}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
