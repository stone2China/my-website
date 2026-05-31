import { Feed } from "feed";
import { blogName, blogDescription } from "./global";
import { getAllArticles } from "./blog";

const feed = new Feed({
  title: blogName,
  description: blogDescription,
  id: "https://blog.stone-dev.top",
  link: "https://blog.stone-dev.top",
  language: "zh-cn",
  favicon: "https://stone-dev.top/icon.png",
  copyright: `Copyright (c) stone ${new Date().getFullYear()}`,
  feedLinks: {
    atom: "https://stone-dev.top/rss/feed.xml",
    json: "https://stone-dev.top/rss/feed.json",
  },
  author: { name: "stone", link: "https://stone-dev.top" }
});

getAllArticles(true).forEach(article => {
  feed.addItem({
    title: article.title,
    id: `https://stone-dev.top/blog/${article.slug}`,
    link: `https://stone-dev.top/blog/${article.slug}`,
    description: article.excerpt,
    content: article.__content,
    author: [{ name: article.author }],
    date: article.date,
    image: article.photo,
  });
});

// export const atom = feed.atom1();
export const json = feed.json1();
