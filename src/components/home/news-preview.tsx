import Link from "next/link";
import { siteCopy } from "@/content/site-copy";
import { formatUaDate } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Section, Kicker, DisplayTitle } from "@/components/ui/section";
import { Reveal } from "@/components/shared/reveal";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: Date | null;
};

export function NewsPreview({ items }: { items: NewsItem[] }) {
  const [featured, ...rest] = items;

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

        {items.length === 0 ? (
          <Reveal>
            <p className="mt-10 max-w-xl text-[var(--ink-soft)]">{siteCopy.newsPreview.empty}</p>
          </Reveal>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            {featured ? (
              <Reveal className="lg:col-span-7">
                <article className="group">
                  <time className="text-meta text-[var(--muted)]">
                    {formatUaDate(featured.publishedAt)}
                  </time>
                  <h3 className="mt-3 font-editorial text-3xl leading-tight text-[var(--graphite)] group-hover:text-[var(--olive-ink)] md:text-4xl">
                    <Link href={`/news/${featured.slug}`}>{featured.title}</Link>
                  </h3>
                  {featured.excerpt ? (
                    <p className="mt-4 text-lead">{featured.excerpt}</p>
                  ) : null}
                </article>
              </Reveal>
            ) : null}
            <ul className="flex flex-col gap-6 lg:col-span-5 lg:border-l lg:border-[var(--line)] lg:pl-8">
              {rest.map((item, i) => (
                <Reveal key={item.id} delay={0.05 * i}>
                  <li className="border-t border-[var(--line)] pt-6 first:border-0 first:pt-0 lg:first:border-t lg:first:pt-6">
                    <time className="text-meta text-[var(--muted)]">
                      {formatUaDate(item.publishedAt)}
                    </time>
                    <h3 className="mt-2 font-display text-lg font-semibold text-[var(--graphite)] hover:text-[var(--olive-ink)]">
                      <Link href={`/news/${item.slug}`}>{item.title}</Link>
                    </h3>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </Section>
  );
}
