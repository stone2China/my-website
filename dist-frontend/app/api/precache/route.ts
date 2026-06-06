import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

const GITHUB_API = "https://api.github.com/repos/docmirror/dev-sidecar/releases?per_page=5";
const CACHE_DIR = path.resolve(process.cwd(), ".cache", "downloads");

/** 需要预缓存的推荐文件匹配规则（只缓存常用文件，避免全量下载） */
const RECOMMENDED_PATTERNS = [
  "windows-universal.exe",
  "macos-universal.dmg",
  "linux-x86_64.deb",
  "linux-arm64.deb",
  "linux-x86_64.AppImage",
];

/** 从 URL 中提取文件名 */
function getFilename(url: string): string {
  const parsed = new URL(url);
  return path.basename(parsed.pathname);
}

/** 判断是否属于推荐缓存的文件 */
function isRecommended(name: string): boolean {
  return RECOMMENDED_PATTERNS.some((p) => name.includes(p));
}

/** 下载单个文件并缓存 */
async function downloadAndCache(
  url: string,
  filename: string,
  results: { file: string; status: "ok" | "skipped" | "error"; error?: string }[]
) {
  const filePath = path.join(CACHE_DIR, filename);

  // 检查是否已缓存
  try {
    await fs.access(filePath);
    results.push({ file: filename, status: "skipped" });
    console.log(`[Precache] Skipped (exists): ${filename}`);
    return;
  } catch {
    // 文件不存在，需要下载
  }

  try {
    console.log(`[Precache] Downloading: ${filename}`);
    const res = await fetch(url, {
      headers: { "User-Agent": "DevSidecar-Precache/1.0" },
    });

    if (!res.ok) {
      results.push({ file: filename, status: "error", error: `HTTP ${res.status}` });
      return;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    results.push({ file: filename, status: "ok" });
    console.log(`[Precache] Saved: ${filename} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
  } catch (err: any) {
    results.push({ file: filename, status: "error", error: err.message });
  }
}

/**
 * GET /api/precache
 * 提前把最新稳定版的推荐安装包缓存到服务器本地
 */
export async function GET() {
  const results: { file: string; status: "ok" | "skipped" | "error"; error?: string }[] = [];

  try {
    // 1. 获取最新 release
    const releasesRes = await fetch(GITHUB_API, {
      headers: { "User-Agent": "DevSidecar-Precache/1.0" },
    });

    if (!releasesRes.ok) {
      return NextResponse.json(
        { error: `GitHub API error: ${releasesRes.status}` },
        { status: 502 }
      );
    }

    const releases = await releasesRes.json();
    const latestStable = releases.find((r: any) => !r.prerelease && !r.draft);

    if (!latestStable) {
      return NextResponse.json({ error: "No stable release found" }, { status: 404 });
    }

    const version = latestStable.tag_name;
    const assets = latestStable.assets as { name: string; browser_download_url: string }[];

    // 2. 确保缓存目录存在
    await fs.mkdir(CACHE_DIR, { recursive: true });

    // 3. 筛选推荐文件，并发下载
    const toDownload = assets.filter((a) => isRecommended(a.name));
    console.log(`[Precache] Latest stable: ${version}, caching ${toDownload.length}/${assets.length} files`);

    await Promise.all(toDownload.map((a) => downloadAndCache(a.browser_download_url, getFilename(a.browser_download_url), results)));

    return NextResponse.json({
      version,
      total: toDownload.length,
      results,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
