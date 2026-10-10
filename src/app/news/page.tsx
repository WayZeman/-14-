import type { Metadata } from "next";
import { siteCopy } from "@/content/site-copy";
import { getNewsFeed } from "@/lib/news-feed";
import { PageFrame, PageHeader, ContentPanel } from "@/components/layout/page-frame";
import { NewsFeedList } from "@/components/news/news-feed-list";
import { NewsSocialCta } from "@/components/news/news-social-cta";

export const metadata: Metadata = {
  title: "Новини",
  description: siteCopy.meta.newsDescription,
};

export const revalidate = 900;

export default async function NewsPage() {
  const items = await getNewsFeed({ limit: 30 });
  const siteItems = items.filter((i) => i.source === "site");

  return (
    <PageFrame>
      <PageHeader kicker="Медіа" title={siteCopy.newsPage.title} lead={siteCopy.newsPage.intro} />
      <ContentPanel>
        <NewsSocialCta className="max-w-xl" />

        {siteItems.length > 0 ? (
          <div className="mt-12 border-t border-[var(--line)] pt-10">
            <h2 className="font-display text-lg font-semibold text-[var(--graphite)]">
              {siteCopy.newsPage.siteFeedTitle}
            </h2>
            <div className="mt-6">
              <NewsFeedList items={siteItems} />
            </div>
          </div>
        ) : null}
      </ContentPanel>
    </PageFrame>
  );
}
