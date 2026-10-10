import Link from "next/link";
import { siteCopy } from "@/content/site-copy";
import { formatUaDate } from "@/lib/utils";
import type { NewsFeedItem, NewsFeedSource } from "@/lib/news-feed";
import { PageList, pageListLinkClassName } from "@/components/layout/page-frame";

function sourceLabel(source: NewsFeedSource): string {
  switch (source) {
    case "facebook":
      return siteCopy.newsPage.sourceFacebook;
    case "instagram":
      return siteCopy.newsPage.sourceInstagram;
    default:
      return siteCopy.newsPage.sourceSite;
  }
}

function NewsRow({ item }: { item: NewsFeedItem }) {
  const meta = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <time className="text-meta text-[var(--muted)]">{formatUaDate(item.publishedAt)}</time>
      <span className="text-meta rounded-sm bg-[var(--olive)]/10 px-2 py-0.5 text-[var(--olive-deep)]">
        {sourceLabel(item.source)}
      </span>
    </div>
  );

  const titleClass =
    "mt-2 font-editorial text-2xl text-[var(--graphite)] group-hover:text-[var(--olive-ink)] md:text-3xl";

  if (item.isExternal) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={pageListLinkClassName("block")}
      >
        {meta}
        <h2 className={titleClass}>{item.title}</h2>
        {item.excerpt ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)] md:text-base">
            {item.excerpt}
          </p>
        ) : null}
        <span className="text-meta mt-4 inline-block text-[var(--olive)]">Читати в {sourceLabel(item.source)} →</span>
      </a>
    );
  }

  return (
    <Link href={item.href} className={pageListLinkClassName("block")}>
      {meta}
      <h2 className={titleClass}>{item.title}</h2>
      {item.excerpt ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)] md:text-base">
          {item.excerpt}
        </p>
      ) : null}
    </Link>
  );
}

export function NewsFeedList({
  items,
  className,
}: {
  items: NewsFeedItem[];
  className?: string;
}) {
  return (
    <PageList className={className}>
      {items.map((item) => (
        <li key={item.id}>
          <NewsRow item={item} />
        </li>
      ))}
    </PageList>
  );
}

export function NewsFeedFeatured({ item }: { item: NewsFeedItem }) {
  const titleClass =
    "mt-3 font-editorial text-3xl leading-tight text-[var(--graphite)] group-hover:text-[var(--olive-ink)] md:text-4xl";

  const inner = (
    <>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <time className="text-meta text-[var(--muted)]">{formatUaDate(item.publishedAt)}</time>
        <span className="text-meta rounded-sm bg-[var(--olive)]/10 px-2 py-0.5 text-[var(--olive-deep)]">
          {sourceLabel(item.source)}
        </span>
      </div>
      <h3 className={titleClass}>{item.title}</h3>
      {item.excerpt ? <p className="mt-4 text-lead">{item.excerpt}</p> : null}
    </>
  );

  return (
    <article className="group">
      {item.isExternal ? (
        <a href={item.href} target="_blank" rel="noopener noreferrer" className="block">
          {inner}
        </a>
      ) : (
        <Link href={item.href} className="block">
          {inner}
        </Link>
      )}
    </article>
  );
}
