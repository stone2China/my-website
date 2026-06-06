import { NextRequest, NextResponse } from "next/server";

/** 可用的 GitHub 镜像源，用于服务器中转下载 */
const MIRROR_SOURCES = [
  { prefix: "https://kkgithub.com/", timeout: 20000 },
  { prefix: "https://githubfast.com/", timeout: 10000 },
];

/** 获取文件并返回响应 */
async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "application/octet-stream,*/*",
      },
      redirect: "follow",
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing 'url' query parameter" }, { status: 400 });
  }

  const originalUrl: string = url;

  // 只尝试从镜像源获取（跳过直连 GitHub，国内大概率超时）
  async function tryFetch(): Promise<Response> {
    const errors: string[] = [];

    // 先尝试 kkgithub.com（国内可访问，但可能较慢）
    for (const mirror of MIRROR_SOURCES) {
      if (!originalUrl.startsWith("https://github.com/")) continue;
      const mirrorUrl = originalUrl.replace("https://github.com/", mirror.prefix);
      try {
        const res = await fetchWithTimeout(mirrorUrl, mirror.timeout);
        if (res.ok) return res;
        errors.push(`${mirror.prefix} => ${res.status}`);
      } catch (e) {
        errors.push(`${mirror.prefix} => ${e instanceof Error ? e.message : "unknown error"}`);
      }
    }

    // 所有镜像都失败后，最后尝试直连 GitHub
    try {
      const res = await fetchWithTimeout(originalUrl, 5000);
      if (res.ok) return res;
      errors.push(`github.com => ${res.status}`);
    } catch (e) {
      errors.push(`github.com => ${e instanceof Error ? e.message : "unknown error"}`);
    }

    throw new Error(`All sources failed:\n${errors.join("\n")}`);
  }

  try {
    const response = await tryFetch();

    // 提取文件名
    const disposition = response.headers.get("content-disposition");
    let filename = originalUrl.split("/").pop() || "download";
    if (disposition) {
      const match = disposition.match(/filename="?(.+?)"?$/);
      if (match) filename = match[1];
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const body = await response.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": body.byteLength.toString(),
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Download proxy error:", error);
    return NextResponse.json(
      { error: "代理下载失败，所有源均无法访问。请尝试使用镜像源直接下载。" },
      { status: 502 }
    );
  }
}
