import Link from "next/link";
import { siteCopy } from "@/content/site-copy";
import { formatUaDate } from "@/lib/utils";
import type { NewsFeedItem } from "@/lib/news-feed";
import { Container } from "@/components/ui/container";
import { Section, Kicker, DisplayTitle } from "@/components/ui/section";
import { Reveal } from "@/components/shared/reveal";
import { NewsFeedFeatured } from "@/components/news/news-feed-list";
import { NewsSocialCta } from "@/components/news/news-social-cta";

export function NewsPreview({ items }: { items: NewsFeedItem[] }) {
  const siteItems = items.filter((i) => i.source === "site");
  const [featured, ...rest] = siteItems;

  return (
    <Section id="news" tone="paper">
      <Container>
        <div className="flex flex-col justify-between gap-6 border-b border-[var(--line)] pb-8 md:flex-row md:items-end">
          <Reveal>
            <Kicker index="05">Новини</Kicker>
            <DisplayTitle>{siteCopy.newsPreview.title}</DisplayTitle>
          </Reveal>
          <Reveal>
            <Link
              href="/news"
              className="text-meta text-[var(--olive)] underline-offset-4 hover:underline"
            >
              {siteCopy.newsPreview.cta}
            </Link>
          </Reveal>
        </div>

        <Reveal className="mt-10 max-w-xl">
          <NewsSocialCta />
        </Reveal>

        {siteItems.length > 0 ? (
          <div className="mt-12 grid gap-8 border-t border-[var(--line)] pt-10 lg:grid-cols-12">
            {featured ? (
              <Reveal className="lg:col-span-7">
                <NewsFeedFeatured item={featured} />
              </Reveal>
            ) : null}
            <ul className="flex flex-col gap-6 lg:col-span-5 lg:border-l lg:border-[var(--line)] lg:pl-8">
              {rest.slice(0, 4).map((item, i) => (
                <Reveal key={item.id} delay={0.05 * i}>
                  <li className="border-t border-[var(--line)] pt-6 first:border-0 first:pt-0 lg:first:border-t lg:first:pt-6">
                    <FeedSideItem item={item} />
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}

function FeedSideItem({ item }: { item: NewsFeedItem }) {
  const title = (
    <h3 className="mt-2 font-display text-lg font-semibold text-[var(--graphite)] hover:text-[var(--olive-ink)]">
      {item.title}
    </h3>
  );

  return (
    <>
      <time className="text-meta text-[var(--muted)]">{formatUaDate(item.publishedAt)}</time>
      {item.isExternal ? (
        <a href={item.href} target="_blank" rel="noopener noreferrer" className="block">
          {title}
        </a>
      ) : (
        <Link href={item.href} className="block">
          {title}
        </Link>
      )}
    </>
  );
}
