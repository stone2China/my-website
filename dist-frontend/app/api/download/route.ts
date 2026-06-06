import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

/** 缓存目录（项目根目录下的 .cache/downloads） */
const CACHE_DIR = path.resolve(process.cwd(), ".cache", "downloads");

/** 从 URL 中提取文件名 */
function getFilename(url: string): string {
  const parsed = new URL(url);
  return path.basename(parsed.pathname);
}

/** 确保缓存目录存在 */
async function ensureCacheDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch {
    // 目录已存在
  }
}

/** 尝试从缓存读取文件，返回文件内容或 null */
async function getFromCache(filename: string): Promise<Buffer | null> {
  try {
    const filePath = path.join(CACHE_DIR, filename);
    return await fs.readFile(filePath);
  } catch {
    return null;
  }
}

/** 将文件写入缓存 */
async function writeToCache(filename: string, data: Buffer) {
  try {
    await ensureCacheDir();
    const filePath = path.join(CACHE_DIR, filename);
    await fs.writeFile(filePath, data);
    console.log(`[Cache] Saved: ${filename}`);
  } catch (err) {
    console.error(`[Cache] Failed to save ${filename}:`, err);
  }
}

/**
 * GET /api/download?url=...
 * 从 GitHub 代理下载文件，服务器中转，带本地磁盘缓存
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // 只允许代理 GitHub 的下载链接
  if (!url.startsWith("https://github.com/") && !url.startsWith("https://objects.githubusercontent.com/")) {
    return NextResponse.json({ error: "Invalid url" }, { status: 403 });
  }

  const filename = getFilename(url);

  // 1. 检查缓存
  const cached = await getFromCache(filename);
  if (cached) {
    console.log(`[Download] Serving cached: ${filename}`);
    return new NextResponse(new Uint8Array(cached), {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "public, max-age=86400",
        "X-Cache": "HIT",
      },
    });
  }

  // 2. 从 GitHub 下载并缓存
  try {
    console.log(`[Download] Fetching from GitHub: ${filename}`);
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DevSidecar-Download/1.0)",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `GitHub responded with ${response.status}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type") ?? "application/octet-stream";

    // 读取完整响应体，写入缓存后再返回
    const buffer = Buffer.from(await response.arrayBuffer());

    // 异步写入缓存（不阻塞响应）
    writeToCache(filename, buffer);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "public, max-age=86400",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("Proxy download failed:", error);
    return NextResponse.json({ error: "Failed to proxy download" }, { status: 502 });
  }
}
