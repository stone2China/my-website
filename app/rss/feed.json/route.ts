import { NextResponse } from "next/server";
import { json } from "@/lib/rss";

// 告诉 Next.js 这是一个静态路由，修复静态导出错误
export const dynamic = "force-static";

export async function GET() {
  return new NextResponse(json, {
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    }
  });
}