import { NextResponse } from "next/server";
import type { ReleasesResponse } from "@/lib/dev-sidecar/api";

const GITHUB_API = "https://api.github.com/repos/docmirror/dev-sidecar/releases";

/**
 * 内存缓存 —— 位于 Cloudflare Worker 的模块级作用域，
 * 冷启动时会重建，正常工作期间持续存在。
 */
let cache: { data: ReleasesResponse; timestamp: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 分钟

export async function GET() {
  const now = Date.now();

  // 缓存命中且未过期 → 直接返回
  if (cache && now - cache.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cache.data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  }

  // 缓存过期或不存在 → 从 GitHub 拉取最新 releases
  try {
    const res = await fetch(GITHUB_API, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "nocp.space-dev-sidecar/1.0",
      },
      // 最多等 15 秒，GitHub API 在国内可能较慢
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      // GitHub API 返回异常时，如果有旧缓存则降级返回旧缓存
      if (cache) {
        console.warn(`GitHub API returned ${res.status}, falling back to stale cache`);
        return NextResponse.json(cache.data, {
          headers: { "Cache-Control": "public, max-age=60" },
        });
      }
      return NextResponse.json(
        { error: `GitHub API returned ${res.status}` },
        { status: 502 }
      );
    }

    const data: ReleasesResponse = await res.json();

    // 更新内存缓存
    cache = { data, timestamp: Date.now() };

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    // 网络错误时降级返回旧缓存
    if (cache) {
      console.warn("Failed to fetch from GitHub, falling back to stale cache");
      return NextResponse.json(cache.data, {
        headers: { "Cache-Control": "public, max-age=60" },
      });
    }
    console.error("GitHub fetch error:", error);
    return NextResponse.json(
      { error: "无法从 GitHub 获取 releases 信息" },
      { status: 502 }
    );
  }
}
