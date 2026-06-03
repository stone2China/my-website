import { getAllArticles } from "@/lib/blog"; 
import { getAllNotes } from "@/lib/notes";
import { BlogTabs } from "./blog-tabs";

export const dynamic = "force-static";

export default function BlogOverview() {
  const rawPosts = getAllArticles(false);
  const rawNotes = getAllNotes(false);

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