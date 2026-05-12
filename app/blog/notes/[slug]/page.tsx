import type { Metadata } from "next";
import { blogName, siteKeywords } from "@/lib/global";
import { getNote, getAllNotes } from "@/lib/notes";
import { formatDate } from "@/lib/utils";
import { Markdown } from "@/components/markdown";
import { Badge } from "@/components/ui/badge";

/**
 * 1. 静态路由参数生成 (Static Site Generation)
 * 解决 "missing generateStaticParams()" 报错
 */
export async function generateStaticParams() {
  // 根据 lib/notes.ts，getAllNotes 需要一个布尔值参数
  // 传入 false 表示不加载详情内容，只获取列表，效率更高
  const notes = getAllNotes(false);
  
  return notes.map((note) => ({
    slug: note.slug,
  }));
}

/**
 * 2. 动态元数据生成
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);

  if (!note) return {};

  return {
    title: `${blogName} - ${note?.title}`,
    keywords: [...siteKeywords, ...note.tags],
  };
}

/**
 * 3. 页面渲染组件
 */
export default async function Note({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const note = getNote(slug);

  // 如果找不到笔记（通常在 build 阶段不会发生，因为参数由 generateStaticParams 提供）
  if (!note) {
    return (
      <div className="page-padding py-20 text-center">
        <h2 className="text-2xl font-semibold">文章不存在</h2>
      </div>
    );
  }

  return (
    <div className="page-padding flex flex-col gap-10">
      <div className="mt-6 flex flex-col gap-12">
        <h1 className="text-4xl font-bold tracking-tight">{note.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="text-muted-foreground underline underline-offset-4">
            By {note.author}
          </span>
          <span className="text-yellow-600 font-medium">
            {formatDate(note.date)}
          </span>
          <div className="flex gap-2">
            {note.tags.map((tag, i) => (
              <Badge variant="secondary" key={i}>
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <Markdown wrapper>
          {note.__content}
        </Markdown>
      </article>
    </div>
  );
}