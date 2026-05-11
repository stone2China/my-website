<<<<<<< HEAD
// 1. 这里的 import recommended 也可以删掉了，因为下面不再使用它
import Link from "next/link";
import { Tag } from "lucide-react"; // BookMarked 和 Rss 也可以删了，因为图标不用了
import { getAllArticles, getTags } from "@/lib/blog"; // getPostByTitle 也不用了
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
=======
import Link from "next/link";
import { Rss, Tag } from "lucide-react";
import { getAllArticles, getTags } from "@/lib/blog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
>>>>>>> 789d1358d11d428c54e9c8c63ffb5f01d973e0c8
import { getRelativeNumber } from "@/lib/utils";
import { getAllNotes } from "@/lib/notes";
import { BlogTabs } from "./blog-tabs";

export default function BlogOverview() {
  const posts = getAllArticles(false);
  const notes = getAllNotes(false);

  return (
    <div className="page-padding flex gap-10">
<<<<<<< HEAD
      {/* 左侧文章列表保持不变 */}
      <BlogTabs posts={posts} notes={notes}/>

      {/* 右侧侧边栏 */}
      <div className="flex-1/3 flex flex-col gap-7 max-md:hidden">
        
        {/* 只保留标签卡片 */}
=======
      <BlogTabs posts={posts} notes={notes}/>

      <div className="flex-1/3 flex flex-col gap-7 max-md:hidden">
>>>>>>> 789d1358d11d428c54e9c8c63ffb5f01d973e0c8
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
                className="text-nowrap text-secondary-foreground"
                style={{ fontSize: `${getRelativeNumber(9, 26, amount, posts.length)}pt` }}
                key={i}>
                {"#"+ tag}
              </Link>
            ))}
          </CardContent>
        </Card>
<<<<<<< HEAD

      </div>
    </div>
  );
}
=======
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Rss size={20}/>
              订阅 RSS Feed
            </CardTitle>
            <CardDescription>
              欢迎订阅NBlog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ButtonGroup className="w-full [&>*]:flex-1 *:text-foreground *:hover:no-underline">
              <Button variant="outline" disabled>
                atom
              </Button>
              <Button variant="outline" asChild>
                <Link href="/rss/feed.json">json</Link>
              </Button>
            </ButtonGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
>>>>>>> 789d1358d11d428c54e9c8c63ffb5f01d973e0c8
