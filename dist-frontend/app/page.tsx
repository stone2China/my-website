"use client";

import { useEffect, useState } from "react";
import { DownloadButton } from "@/components/download-button";
import { Spinner } from "@/components/ui/spinner";
import {
  fetchCachedReleases,
  getLatestStableRelease,
  findAsset,
  getArchList,
  parseAssetName,
  type GitHubRelease,
} from "@/lib/api";
import { ReleasesContext } from "@/contexts/releases";
import { HistoryVersionsDialog } from "./history-versions-dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, ExternalLink, Monitor, Apple, Terminal, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/** 可用的 GitHub 下载加速镜像源（通过替换域名实现加速） */
const MIRROR_PROXIES: { label: string; value: string }[] = [
  { label: "kkgithub.com", value: "https://kkgithub.com/" },
  { label: "githubfast.com", value: "https://githubfast.com/" },
  { label: "服务器代理", value: "__proxy__" },
];

const osOptions = [
  { value: "windows", label: "Windows", icon: Monitor },
  { value: "macos", label: "macOS", icon: Apple },
  { value: "linux", label: "Linux", icon: Terminal },
] as const;

export default function Home() {
  const [os, setOs] = useState<string | null>(null);
  const [arch, setArch] = useState<string | null>(null);
  const [mirror, setMirror] = useState<string | null>(MIRROR_PROXIES[0].value);
  const [releases, setReleases] = useState<GitHubRelease[] | null>(null);
  const [releasesLoading, setReleasesLoading] = useState(true);

  const latestStable = releases ? getLatestStableRelease(releases) : null;

  // 当 OS 改变时，自动选择推荐架构
  useEffect(() => {
    if (os && latestStable) {
      const archList = getArchList(latestStable, os);
      // 优先选 universal，其次第一个
      const preferred = archList.includes("universal") ? "universal" : archList[0];
      // 只在用户未手动选择时自动切换
      if (arch === null || !archList.includes(arch)) {
        setArch(preferred);
      }
    } else {
      setArch(null);
    }
  }, [os, latestStable]);

  const stableAsset = latestStable && os && arch
    ? findAsset(latestStable, os, arch)
    : null;

  const availableArchs = latestStable && os
    ? getArchList(latestStable, os)
    : [];

  useEffect(() => {
    setReleasesLoading(true);
    fetchCachedReleases()
      .then(setReleases)
      .catch(console.error)
      .finally(() => setReleasesLoading(false));
  }, []);

  return (
    <ReleasesContext.Provider value={{
      releases,
      os,
      arch,
      selectedRelease: latestStable,
      selectedAsset: stableAsset,
    }}>
      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
        {/* Logo & Title */}
        <div className="flex flex-col items-center gap-3 mt-4">
          <h1 className="text-2xl font-bold">DevSidecar</h1>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            开发者边车 — 通过本地代理改善国内访问 GitHub 等境外网站的体验
          </p>
        </div>

        {/* OS Selector */}
        <div className="flex gap-2">
          {osOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                onClick={() => { setOs(opt.value); }}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-xl border-2 transition-all cursor-pointer",
                  os === opt.value
                    ? "border-primary bg-primary/10 text-primary font-medium shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                <Icon size={20} />
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Arch Selector */}
        {os && availableArchs.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {availableArchs.map((a) => {
              const assetForArch = findAsset(latestStable!, os, a);
              const parsed = assetForArch ? parseAssetName(assetForArch.name) : null;
              return (
                <button
                  key={a}
                  onClick={() => setArch(a)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer",
                    arch === a
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {a}
                  {parsed?.format && (
                    <span className="ml-1 opacity-60">.{(parsed.format)}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Download Area */}
        {os && arch && (
          <div className="w-full max-w-sm flex flex-col items-center gap-4 
                          [&_code]:font-(family-name:--font-google-sans-code)! [&_code]:text-xs">
            {releasesLoading ? (
              <div className="flex justify-center py-6">
                <Spinner className="size-6" />
              </div>
            ) : (
              <>
                {latestStable && (
                  <div className="w-full space-y-3">
                    <div className="text-center text-xs text-muted-foreground">
                      最新稳定版
                    </div>
                    <DownloadButton
                      release={latestStable}
                      asset={stableAsset}
                      label="稳定版"
                      isStable
                      mirror={mirror}
                    />

                    {/* 镜像源选择 */}
                    {stableAsset && (
                      <div className="flex items-center justify-center gap-2">
                        <Zap size={12} className="text-muted-foreground" />
                        <Select value={mirror ?? "__direct__"} onValueChange={(v) => setMirror(v === "__direct__" ? null : v)}>
                          <SelectTrigger className="w-44 h-7 text-xs">
                            <SelectValue placeholder="选择镜像源" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__direct__">直连 (GitHub)</SelectItem>
                            {MIRROR_PROXIES.map((m) => (
                              <SelectItem key={m.value} value={m.value}>
                                {m.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}

                {!stableAsset && (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    此平台暂无可用下载
                  </p>
                )}

                {/* Actions */}
                <div className="flex justify-center gap-3 mt-2">
                  <HistoryVersionsDialog>
                    <Button variant="outline" size="sm">
                      历史版本
                      <ArrowRight />
                    </Button>
                  </HistoryVersionsDialog>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="https://github.com/docmirror/dev-sidecar/releases" target="_blank">
                      <Github />
                      所有 Release
                    </Link>
                  </Button>
                </div>

                {/* Release Notes */}
                {latestStable && (
                  <details className="w-full mt-2">
                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground text-center">
                      查看更新日志
                    </summary>
                    <div className="mt-3 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground 
                                 max-h-64 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                      {latestStable.body}
                    </div>
                  </details>
                )}
              </>
            )}
          </div>
        )}

        {/* GitHub Link */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
          <Github size={14} />
          <Link
            href="https://github.com/docmirror/dev-sidecar"
            target="_blank"
            className="hover:text-foreground transition-colors"
          >
            docmirror/dev-sidecar
          </Link>
          <ExternalLink size={12} />
        </div>
      </main>
    </ReleasesContext.Provider>
  );
}
