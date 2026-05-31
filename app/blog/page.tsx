// src/app/blog/page.tsx

import { getAllArticles } from "@/lib/blog"; 
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

  return (
    <div className="page-padding flex gap-10">
      <BlogTabs posts={posts} notes={notes}/>
    </div>
  );
}