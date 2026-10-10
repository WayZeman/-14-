import type { Metadata } from "next";
import { siteCopy } from "@/content/site-copy";
import { getNewsFeed } from "@/lib/news-feed";
import { getContactsSettings, getSitePage, pageDefaults } from "@/lib/cms";
import { PageFrame, PageHeader, ContentPanel } from "@/components/layout/page-frame";
import { NewsFeedList } from "@/components/news/news-feed-list";
import { NewsSocialCta } from "@/components/news/news-social-cta";

export const metadata: Metadata = {
  title: "Новини",
  description: siteCopy.meta.newsDescription,
};

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const [items, page, contacts] = await Promise.all([
    getNewsFeed({ limit: 30 }),
    getSitePage("news"),
    getContactsSettings(),
  ]);
  const defaults = pageDefaults("news");
  const title = page?.title ?? defaults.title;
  const message = page?.body || defaults.body;
  const siteItems = items.filter((i) => i.source === "site");
  const social = [
    { label: "Facebook", href: contacts.facebookUrl },
    { label: "Instagram", href: contacts.instagramUrl },
  ] as const;

  return (
    <PageFrame>
      <PageHeader kicker="Медіа" title={title} lead={siteCopy.newsPage.intro} />
      <ContentPanel>
        <NewsSocialCta className="max-w-xl" message={message} links={social} />

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
