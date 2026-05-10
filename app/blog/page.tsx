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
import { getRelativeNumber } from "@/lib/utils";
import { getAllNotes } from "@/lib/notes";
import { BlogTabs } from "./blog-tabs";

export default function BlogOverview() {
  const posts = getAllArticles(false);
  const notes = getAllNotes(false);

  return (
    <div className="page-padding flex gap-10">
      <BlogTabs posts={posts} notes={notes}/>

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
                className="text-nowrap text-secondary-foreground"
                style={{ fontSize: `${getRelativeNumber(9, 26, amount, posts.length)}pt` }}
                key={i}>
                {"#"+ tag}
              </Link>
            ))}
          </CardContent>
        </Card>
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
