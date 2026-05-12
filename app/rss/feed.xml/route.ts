import { NextResponse } from "next/server";

// 强制静态导出，解决 output: export 的报错
export const dynamic = "force-static";

// 只保留这一个 GET 函数
export async function GET() {
  // 暂时返回 unavailable，确保构建通过
  return new NextResponse("RSS Feed Unavailable", {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}