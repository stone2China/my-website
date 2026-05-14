import type { Metadata } from "next";
import Link from "next/link";
import { Bot } from "lucide-react";
import { blogName, siteKeywords } from "@/lib/global";
import { getArticle, getAllArticles } from "@/lib/blog"; 
import { formatDate } from "@/lib/utils";
import { Markdown } from "@/components/markdown";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * 解决 "missing generateStaticParams()" 报错
 */
export async function generateStaticParams() {
  // 获取所有文章，生成静态路径清单
  const articles = getAllArticles(false);  
  
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);

  if(!article) return {};

  return {
    title: `${blogName} - ${article?.title}`,
    description: article?.excerpt,
    keywords: [...siteKeywords, ...article.tags],
  };
}

export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const article = getArticle(slug);

  if(!article) {
    return (
      <div className="page-padding py-20 text-center text-muted-foreground">
        文章不存在
      </div>
    );
  }

  // --- 关键修复：确保 article.date 转换为有效的 Date 对象 ---
  const safeDate = article.date instanceof Date 
    ? article.date 
    : new Date(article.date);
    
  // 如果日期转换失败（Invalid Date），兜底使用当前时间，防止 getFullYear 报错
  const finalDate = isNaN(safeDate.getTime()) ? new Date() : safeDate;
  // -------------------------------------------------------

  return (
    <div className="page-padding flex flex-col gap-10">
      <div className="mt-6 flex flex-col gap-12">
        <h1 className="text-4xl font-bold">{article.title}</h1>
        <div className="space-x-4">
          <span className="text-secondary-foreground">By {article.author}</span>
          {/* 传入处理后的 finalDate */}
          <span className="text-yellow-600">{formatDate(finalDate)}</span>
          <div className="inline-block space-x-2">
            {article.tags.map((tag, i) => (
              <Link
                href={`/blog/tag/${tag}`}
                key={i}
                className="hover:text-primary transition-colors">
                {"#"+ tag}
              </Link>
            ))}
          </div>
        </div>
        {article.hasAI && (
          <Alert className="rounded-md">
            <Bot className="h-4 w-4" />
            <AlertTitle>本文包含AI生成内容</AlertTitle>
            <AlertDescription>
              本文内容中有部分内容由AI生成,请仔细甄别
            </AlertDescription>
          </Alert>
        )}
      </div>
      <Markdown wrapper>
        {article.__content}
      </Markdown>
    </div>
  );
}