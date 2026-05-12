import type { Metadata } from "next";
import { getPostsByTag } from "@/lib/blog";
import { getNoteTags } from "@/lib/notes"; // 导入获取标签清单的函数
import { blogName, siteKeywords } from "@/lib/global";
import { ArticleCard } from "../../article-card";

/**
 * 解决 "missing generateStaticParams()" 报错
 * 告诉 Next.js 你的博客里到底有哪些标签需要生成页面
 */
export async function generateStaticParams() {
  const tagsData = getNoteTags();
  
  return tagsData.map((item) => ({
    tag: item.tag, // 这里的 key 必须对应文件夹名 [tag]
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `${blogName} - #${decodedTag}`,
    keywords: [...siteKeywords, decodedTag],
  };
}

export default async function Tag({
  params,
}: {
  params: Promise<{ tag: string }>
}) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  return (
    <div className="page-padding flex flex-col gap-10">
      <div className="mt-6 space-y-5">
        <h2 className="text-4xl font-bold">{"#" + decodedTag}</h2>
        <span className="text-secondary-foreground">共 {posts.length} 篇文章</span>
      </div>
      <div className="grid grid-cols-1 gap-4"> 
        {posts.map((post, i) => (
          <ArticleCard {...post} key={i}/>
        ))}
      </div>
    </div>
  );
}