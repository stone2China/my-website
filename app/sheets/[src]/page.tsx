import type { Metadata } from "next";
import { blogName, siteKeywords } from "@/lib/global";
import { getSheet } from "@/lib/sheets";
import { AbcSheet } from "@/components/abc-sheet";
import { PrintSheetButton } from "./print-sheet-button";
import fs from "fs";
import path from "path";

import "./print-visibility.css";

/**
 * 解决静态导出报错的关键：
 * 1. 自动生成路径清单
 * 2. 仅过滤 .abc 文件，确保 import 逻辑不崩溃
 */
export async function generateStaticParams() {
  const sheetsDirectory = path.resolve(process.cwd(), "data/sheets");
  
  if (!fs.existsSync(sheetsDirectory)) return [];

  const files = fs.readdirSync(sheetsDirectory);
  
  // 只处理 .abc 文件，因为下面的组件写死了只加载 .abc
  return files
    .filter(file => file.endsWith('.abc')) 
    .map((fileName) => ({
      src: fileName.replace(/\.abc$/, ""), 
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ src: string }>
}): Promise<Metadata> {
  const { src } = await params;
  const sheet = getSheet(src);

  if(!sheet) return {};

  return {
    title: `${blogName} - ${sheet.name}`,
    keywords: [...siteKeywords, sheet.name, sheet.author, "吉他", "吉他谱", "曲谱", "扒谱"],
  };
}

export default async function Sheet({
  params,
}: {
  params: Promise<{ src: string }>
}) {
  const { src } = await params;
  const sheet = getSheet(src);
  
  // 这里是报错的根源：如果 src 指向一个没有 .abc 文件的路径，构建就会失败
  // 我们已经在 generateStaticParams 过滤了非 abc 文件，这里现在是安全的
  const { default: content } = await import(`@/data/sheets/${src}.abc`);

  if(!sheet) return <></>;

  return (
    <div className="page-padding pt-24 flex flex-col gap-10" id="sheet-container">
      <div className="mt-6 flex flex-col gap-12">
        <h1 className="text-4xl font-bold">{sheet.name}</h1>
        <div className="space-x-6">
          <span className="text-secondary-foreground">作曲 / 编曲 {sheet.author}</span>
          <span>
            <span className="text-green-600">{sheet.tune}</span>
            &nbsp;调
          </span>
          <span>
            变调夹&nbsp;
            <span className="text-yellow-600">{sheet.capo}</span>
            &nbsp;品
          </span>
          <PrintSheetButton />
        </div>
      </div>
      <AbcSheet
        sheet={content}
        capo={sheet.capo}/>
    </div>
  );
}