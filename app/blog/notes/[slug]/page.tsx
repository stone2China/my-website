import type { Metadata } from "next";
import { blogName, siteKeywords } from "@/lib/global";
import { getNote, getAllNotes } from "@/lib/notes";
import { formatDate } from "@/lib/utils";
import { Markdown } from "@/components/markdown";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const notes = getAllNotes(false);
  
  return notes.map((note) => ({
    slug: note.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);

  if (!note) return {};

  return {
    title: `${blogName} - ${note?.title}`,
    keywords: [...siteKeywords, ...note.tags],
  };
}

export default async function Note({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const note = getNote(slug);

  if (!note) {
    return (
      <div className="page-padding py-20 text-center">
        <h2 className="text-2xl font-semibold">文章不存在</h2>
      </div>
    );
  }

  return (
    <div className="page-padding flex flex-col gap-10">
      <div className="mt-6 flex flex-col gap-12">
        <h1 className="text-4xl font-bold tracking-tight">{note.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="text-muted-foreground underline underline-offset-4">
            By {note.author}
          </span>
          <span className="text-yellow-600 font-medium">
            {formatDate(note.date)}
          </span>
          <div className="flex gap-2">
            {note.tags.map((tag, i) => (
              <Badge variant="secondary" key={i}>
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <Markdown wrapper>
          {note.__content}
        </Markdown>
      </article>
    </div>
  );
}