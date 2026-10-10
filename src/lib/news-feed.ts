import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { newsArticles } from "@/db/schema";
import {
  facebookPostToExcerpt,
  facebookPostToTitle,
  getFacebookPosts,
} from "@/lib/facebook-feed";
import {
  getInstagramPosts,
  instagramCaptionToExcerpt,
  instagramCaptionToTitle,
} from "@/lib/instagram-feed";

export type NewsFeedSource = "site" | "facebook" | "instagram";

export type NewsFeedItem = {
  id: string;
  title: string;
  excerpt: string | null;
  publishedAt: Date | null;
  href: string;
  source: NewsFeedSource;
  isExternal: boolean;
  imageUrl?: string | null;
};

function sortByDate(items: NewsFeedItem[]): NewsFeedItem[] {
  return [...items].sort((a, b) => {
    const ta = a.publishedAt?.getTime() ?? 0;
    const tb = b.publishedAt?.getTime() ?? 0;
    return tb - ta;
  });
}

async function getSiteNews(limit: number): Promise<NewsFeedItem[]> {
  try {
    const rows = await db
      .select({
        id: newsArticles.id,
        title: newsArticles.title,
        slug: newsArticles.slug,
        excerpt: newsArticles.excerpt,
        publishedAt: newsArticles.publishedAt,
        coverImage: newsArticles.coverImage,
      })
      .from(newsArticles)
      .where(eq(newsArticles.status, "published"))
      .orderBy(desc(newsArticles.publishedAt))
      .limit(limit);

    return rows.map((row) => ({
      id: `site-${row.id}`,
      title: row.title,
      excerpt: row.excerpt,
      publishedAt: row.publishedAt,
      href: `/news/${row.slug}`,
      source: "site" as const,
      isExternal: false,
      imageUrl: row.coverImage,
    }));
  } catch {
    return [];
  }
}

export async function getNewsFeed(options?: { limit?: number }): Promise<NewsFeedItem[]> {
  const limit = options?.limit ?? 20;
  const perSource = Math.max(limit, 12);

  const [siteItems, fbPosts, igMedia] = await Promise.all([
    getSiteNews(perSource),
    getFacebookPosts(perSource),
    getInstagramPosts(perSource),
  ]);

  const fbItems: NewsFeedItem[] = fbPosts.map((post) => {
    const title = facebookPostToTitle(post.message);
    return {
      id: `fb-${post.id}`,
      title,
      excerpt: facebookPostToExcerpt(post.message, title),
      publishedAt: post.created_time ? new Date(post.created_time) : null,
      href: post.permalink_url,
      source: "facebook" as const,
      isExternal: true,
      imageUrl: post.full_picture ?? null,
    };
  });

  const igItems: NewsFeedItem[] = igMedia.map((item) => {
    const title = instagramCaptionToTitle(item.caption);
    return {
      id: `ig-${item.id}`,
      title,
      excerpt: instagramCaptionToExcerpt(item.caption, title),
      publishedAt: item.timestamp ? new Date(item.timestamp) : null,
      href: item.permalink,
      source: "instagram" as const,
      isExternal: true,
      imageUrl: item.thumbnail_url ?? item.media_url ?? null,
    };
  });

  return sortByDate([...siteItems, ...fbItems, ...igItems]).slice(0, limit);
}
