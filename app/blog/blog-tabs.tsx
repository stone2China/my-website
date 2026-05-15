"use client";

import type { Post } from "@/lib/blog";
import type { Note } from "@/lib/notes";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleCard } from "./article-card";
import { NoteCard } from "./note-card";

export function BlogTabs({ posts, notes }: {
  posts: Post[]
  notes: Note[]
}) {
  const [activeTab, setActiveTab] = useState("blog");
  const [isMounted, setIsMounted] = useState(false); // 新增：挂载状态

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // 关键修复 1：只有在浏览器环境下才操作 history
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `#${value}`);
    }
  };

  useEffect(() => {
    setIsMounted(true); // 组件挂载后标记为 true

    // 关键修复 2：将所有对 window 的访问移动到 useEffect 内部
    const hash = window.location.hash.slice(1);
    if(hash === "notes" || hash === "blog") {
      setActiveTab(hash);
    }

    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1);
      if(newHash === "notes" || newHash === "blog") {
        setActiveTab(newHash);
      }
    };
    
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // 关键修复 3：防止水合错误 (Hydration Mismatch)
  // 在服务器端渲染时返回一个简单的骨架，避免因 hash 不同导致的前后端内容不一致
  if (!isMounted) {
    return (
      <div className="flex-2/3 max-sm:flex-1 max-sm:min-w-0 opacity-0">
        <div className="h-10 w-48 bg-muted rounded mb-4" />
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-2/3 max-sm:flex-1 max-sm:min-w-0">
      <TabsList className="[&>*]:cursor-pointer">
        <TabsTrigger value="blog">博客 ({posts.length})</TabsTrigger>
        <TabsTrigger value="notes">笔记 ({notes.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="blog">
        {posts.map((post, i) => (
          <ArticleCard 
            {...post} 
            key={i} 
            // 兜底：确保传给子组件的日期格式正确
            date={post.date instanceof Date ? post.date : new Date(post.date)} 
          />
        ))}
      </TabsContent>
      <TabsContent value="notes">
        {notes.map((note, i) => (
          <NoteCard 
            {...note} 
            key={i} 
            // 兜底：确保传给子组件的日期格式正确
            date={note.date instanceof Date ? note.date : new Date(note.date)}
          />
        ))}
      </TabsContent>
    </Tabs>
  );
}