import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export const dynamic = "force-static";

export function GET() {
  // 1. 获取模板文件的绝对路径
  const filePath = path.join(process.cwd(), "app/humans.txt/humans.template.txt");
  
  // 2. 读取文件内容
  const template = fs.readFileSync(filePath, "utf-8");

  // 3. 动态替换日期
  const date = new Date();
  const content = template.replace(
    "{0}",
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  );

  return new NextResponse(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}