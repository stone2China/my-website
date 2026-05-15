// src/app/blog/page.tsx

import Link from "next/link";
import { Tag } from "lucide-react"; 
import { getAllArticles, getTags } from "@/lib/blog"; 
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { getRelativeNumber } from "@/lib/utils";
import { getAllNotes } from "@/lib/notes";
import { BlogTabs } from "./blog-tabs";

// --- 新增修复配置 ---
export const dynamic = "force-static"; // 强制页面静态化，防止在边缘节点运行 Node.js 逻辑
export const revalidate = false;       // 禁用运行时重新验证
// --------------------

export default function BlogOverview() {
  // 1. 获取原始数据 (这些逻辑将在打包构建阶段在你的电脑/GitHub Action上运行，而不是在 Cloudflare 节点上)
  const rawPosts = getAllArticles(false);
  const rawNotes = getAllNotes(false);

  // 2. 预处理日期
  const posts = rawPosts.map(post => ({
    ...post,
    date: post.date instanceof Date ? post.date : new Date(post.date)
  }));

  const notes = rawNotes.map(note => ({
    ...note,
    date: note.date instanceof Date ? note.date : new Date(note.date)
  }));

  // 3. 标签逻辑
  const tags = getTags();

  return (
    <div className="page-padding flex gap-10">
      <BlogTabs posts={posts} notes={notes}/>

      {/* 右侧侧边栏 */}
      <div className="flex-1/3 flex flex-col gap-7 max-md:hidden">
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Tag size={20}/>
              标签
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-x-2 gap-y-1 justify-center">
            {tags.map(({ tag, amount }, i) => (
              <Link
                href={`/blog/tag/${tag}`}
                key={i}
                className="text-nowrap text-secondary-foreground hover:text-primary transition-colors"
                style={{ fontSize: `${getRelativeNumber(9, 20, amount, posts.length)}pt` }}>
                {"#"+ tag}
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}