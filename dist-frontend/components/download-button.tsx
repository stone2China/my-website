import Link from "next/link";
import { useState } from "react";
import { Check, Copy, Download, Zap } from "lucide-react";
import { cn, copyToClipboard, normalizeVersion, formatDataSize, describeAsset } from "@/lib/utils";
import { Button } from "./ui/button";
import { googleSansCode } from "@/lib/fonts";
import type { GitHubRelease, GitHubAsset } from "@/lib/api";

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
  const [copied, setCopied] = useState(false);
  const version = normalizeVersion(release.tag_name);

  const directUrl = asset?.browser_download_url ?? "#";
  const isMirror = !!mirror && mirror !== "__proxy__";
  const isProxy = mirror === "__proxy__";
  // 镜像加速 URL：将 github.com 替换为镜像域名
  // 服务器代理：通过 /api/download?url=... 中转
  const downloadUrl = isProxy
    ? `/api/download?url=${encodeURIComponent(directUrl)}`
    : mirror
      ? directUrl.replace("https://github.com/", mirror)
      : directUrl;

  const handleCopy = async () => {
    await copyToClipboard(asset?.name ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <span className={cn(googleSansCode.className)}>
            {formatDataSize(asset.size)}
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
