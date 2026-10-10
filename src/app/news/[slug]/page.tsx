import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { newsArticles } from "@/db/schema";
import { formatUaDate } from "@/lib/utils";
import { PageFrame, BackLink, ContentPanel } from "@/components/layout/page-frame";
import { DisplayTitle } from "@/components/ui/section";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

async function getArticle(slug: string) {
  const [row] = await db
    .select()
    .from(newsArticles)
    .where(and(eq(newsArticles.slug, slug), eq(newsArticles.status, "published")))
    .limit(1);
  return row;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await getArticle(slug);
    if (!article) return { title: "Новина" };
    return {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt || undefined,
      openGraph: {
        title: article.seoTitle || article.title,
        description: article.seoDescription || article.excerpt || undefined,
        images: article.coverImage ? [article.coverImage] : undefined,
      },
    };
  } catch {
    return { title: "Новина" };
  }
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  let article;
  try {
    article = await getArticle(slug);
  } catch {
    notFound();
  }
  if (!article) notFound();

  return (
    <PageFrame>
      <ContentPanel width="narrow">
        <BackLink href="/news">Усі новини</BackLink>
        <time className="mt-8 block text-meta text-[var(--muted)]">{formatUaDate(article.publishedAt)}</time>
        <DisplayTitle as="h1" className="mt-3">
          {article.title}
        </DisplayTitle>
        {article.excerpt ? <p className="text-lead mt-5">{article.excerpt}</p> : null}
        <div className="prose-orb mt-10 whitespace-pre-line">{article.body}</div>
        {article.youtubeId ? (
          <div className="mt-12 aspect-video overflow-hidden rounded-[var(--radius-sm)] bg-[var(--graphite)]">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${article.youtubeId}`}
              title={article.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : null}
      </ContentPanel>
    </PageFrame>
  );
}
