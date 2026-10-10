import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { newsArticles } from "@/db/schema";
import { formatUaDate } from "@/lib/utils";
import { siteCopy } from "@/content/site-copy";
import {
  PageFrame,
  PageHeader,
  ContentPanel,
  PageList,
  pageListLinkClassName,
} from "@/components/layout/page-frame";

export const metadata: Metadata = {
  title: "Новини",
  description: siteCopy.meta.newsDescription,
};

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  let items: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    publishedAt: Date | null;
  }[] = [];

  try {
    items = await db
      .select({
        id: newsArticles.id,
        title: newsArticles.title,
        slug: newsArticles.slug,
        excerpt: newsArticles.excerpt,
        publishedAt: newsArticles.publishedAt,
      })
      .from(newsArticles)
      .where(eq(newsArticles.status, "published"))
      .orderBy(desc(newsArticles.publishedAt));
  } catch {
    items = [];
  }

  return (
    <PageFrame>
      <PageHeader kicker="Медіа" title={siteCopy.newsPage.title} />
      <ContentPanel>
        {items.length === 0 ? (
          <p className="max-w-2xl text-[var(--ink-soft)]">{siteCopy.newsPage.empty}</p>
        ) : (
          <PageList>
            {items.map((item) => (
              <li key={item.id}>
                <Link href={`/news/${item.slug}`} className={pageListLinkClassName()}>
                  <time className="text-meta text-[var(--muted)]">{formatUaDate(item.publishedAt)}</time>
                  <h2 className="mt-2 font-editorial text-2xl text-[var(--graphite)] group-hover:text-[var(--olive-ink)] md:text-3xl">
                    {item.title}
                  </h2>
                  {item.excerpt ? (
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)] md:text-base">
                      {item.excerpt}
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </PageList>
        )}
      </ContentPanel>
    </PageFrame>
  );
}
