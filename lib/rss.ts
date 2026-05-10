import { Feed } from "feed";
import { blogName, blogDescription } from "./global";
import { getAllArticles } from "./blog";

const feed = new Feed({
  title: blogName,
  description: blogDescription,
  id: "https://blog.stone.cn.mt",
  link: "https://blog.stone.cn.mt",
  language: "zh-cn",
  favicon: "https://stone.cn.mt/icon.png",
  copyright: `Copyright (c) stone2China ${new Date().getFullYear()}`,
  feedLinks: {
    atom: "https://stone.cn.mt/rss/feed.xml",
    json: "https://stone.cn.mt/rss/feed.json",
  },
  author: { name: "stone2China", link: "https://stone.cn.mt" }
});

getAllArticles(true).forEach(article => {
  feed.addItem({
    title: article.title,
    id: `https://stone.cn.mt/blog/${article.slug}`,
    link: `https://stone.cn.mt/blog/${article.slug}`,
    description: article.excerpt,
    content: article.__content,
    author: [{ name: article.author }],
    date: new Date(article.date),
    image: article.photo,
  });
});

// export const atom = feed.atom1();
export const json = feed.json1();
