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

export default function BlogOverview() {
  // 1. 获取原始数据
  const rawPosts = getAllArticles(false);
  const rawNotes = getAllNotes(false);

  // 2. 关键修复：统一预处理日期，防止 ArticleCard 和 NoteCard 崩溃
  const posts = rawPosts.map(post => ({
    ...post,
    date: post.date instanceof Date ? post.date : new Date(post.date)
  }));

  const notes = rawNotes.map(note => ({
    ...note,
    date: note.date instanceof Date ? note.date : new Date(note.date)
  }));

  return (
    <div className="page-padding flex gap-10">
      {/* 3. 此时传下去的 posts 和 notes 里的 date 已经是真正的 Date 对象了 */}
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
          <CardContent className="space-x-1 text-center">
            {getTags().map(({ tag, amount }, i) => (
              <Link
                href={`/blog/tag/${tag}`}
                key={i}
                className="text-nowrap text-secondary-foreground"
                style={{ fontSize: `${getRelativeNumber(9, 26, amount, posts.length)}pt` }}>
                {"#"+ tag}
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}