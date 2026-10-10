import type { Metadata } from "next";
import { siteCopy } from "@/content/site-copy";
import { getNewsFeed } from "@/lib/news-feed";
import { isFacebookFeedConfigured } from "@/lib/facebook-feed";
import { PageFrame, PageHeader, ContentPanel } from "@/components/layout/page-frame";
import { SocialLinks } from "@/components/layout/social-links";
import { NewsFeedList } from "@/components/news/news-feed-list";
import { FacebookPageEmbed } from "@/components/news/facebook-page-embed";

export const metadata: Metadata = {
  title: "Новини",
  description: siteCopy.meta.newsDescription,
};

export const revalidate = 900;

export default async function NewsPage() {
  const items = await getNewsFeed({ limit: 30 });
  const hasGraphFeed = isFacebookFeedConfigured();
  const hasSocialInFeed = items.some((i) => i.source === "facebook" || i.source === "instagram");
  const showFacebookEmbed = !hasGraphFeed && !hasSocialInFeed;

  return (
    <PageFrame>
      <PageHeader kicker="Медіа" title={siteCopy.newsPage.title} lead={siteCopy.newsPage.intro} />
      <ContentPanel>
        {items.length === 0 ? (
          <p className="max-w-2xl text-[var(--ink-soft)]">{siteCopy.newsPage.empty}</p>
        ) : (
          <NewsFeedList items={items} />
        )}

        <div className="mt-12 border-t border-[var(--line)] pt-10">
          <h2 className="font-display text-lg font-semibold text-[var(--graphite)]">
            {siteCopy.newsPage.socialTitle}
          </h2>
          <SocialLinks className="mt-5" stacked />
        </div>

        {showFacebookEmbed ? (
          <div className="mt-10 max-w-xl">
            <p className="mb-4 text-sm text-[var(--muted)]">{siteCopy.newsPage.facebookEmbedHint}</p>
            <FacebookPageEmbed />
          </div>
        ) : null}
      </ContentPanel>
    </PageFrame>
  );
}
