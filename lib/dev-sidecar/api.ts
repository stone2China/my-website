import axios from "axios";

const GITHUB_API = "https://api.github.com/repos/docmirror/dev-sidecar/releases";

/** GitHub API 返回的 asset 结构 */
export interface GitHubAsset {
  id: number;
  name: string;
  size: number;
  content_type: string;
  browser_download_url: string;
  download_count: number;
  created_at: string;
  updated_at: string;
}

/** GitHub API 返回的 release 结构 */
export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  published_at: string;
  prerelease: boolean;
  body: string;
  assets: GitHubAsset[];
}

export type ReleasesResponse = GitHubRelease[];

/** 从 asset 文件名中解析出 OS、架构、格式信息 */
export function parseAssetName(name: string): {
  os: "windows" | "macos" | "linux" | null;
  arch: string | null;
  format: string | null;
} | null {
  // DevSidecar-2.0.2-windows-universal.exe
  // DevSidecar-2.0.2-macos-universal.dmg
  // DevSidecar-2.0.2-linux-x86_64.deb
  // DevSidecar-2.0.2-linux-arm64.AppImage
  const match = name.match(/^DevSidecar-\d+\.\d+\.\S+?-(windows|macos|linux)-(.+)\.(\w+(?:\.\w+)?)$/);
  if (!match) return null;
  return {
    os: match[1] as "windows" | "macos" | "linux",
    arch: match[2],
    format: match[3],
  };
}

/** 获取所有 releases（按发布时间降序） */
export async function fetchReleases(perPage = 10): Promise<ReleasesResponse> {
  const res = await axios.get<ReleasesResponse>(`${GITHUB_API}?per_page=${perPage}`);
  return res.data;
}

/** 获取最新的稳定版 release */
export function getLatestStableRelease(releases: ReleasesResponse): GitHubRelease | null {
  return releases.find((r) => !r.prerelease) ?? null;
}

/** 获取最新的预览版 release */
export function getLatestPreviewRelease(releases: ReleasesResponse): GitHubRelease | null {
  return releases.find((r) => r.prerelease) ?? null;
}

/** 根据 OS 和架构筛选 asset */
export function findAsset(
  release: GitHubRelease,
  os: string,
  arch: string
): GitHubAsset | null {
  return release.assets.find((a) => {
    const parsed = parseAssetName(a.name);
    return parsed?.os === os && parsed?.arch === arch;
  }) ?? null;
}

/** 对某个 release 按 OS 筛选所有 assets */
export function getAssetsForOs(release: GitHubRelease, os: string): GitHubAsset[] {
  return release.assets.filter((a) => {
    const parsed = parseAssetName(a.name);
    return parsed?.os === os;
  });
}

/** 获取某 OS 可用的架构列表（从 assets 中提取） */
export function getArchList(release: GitHubRelease, os: string): string[] {
  const archSet = new Set<string>();
  for (const asset of release.assets) {
    const parsed = parseAssetName(asset.name);
    if (parsed?.os === os && parsed.arch) {
      archSet.add(parsed.arch);
    }
  }
  return Array.from(archSet);
}

/** 推荐的下载文件后缀映射 */
export const recommendedFormat: Record<string, string> = {
  windows: "exe",
  macos: "dmg",
  linux: "deb",
};
