import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { newsArticles, vacancies } from "@/db/schema";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const staticRoutes = [
    "",
    "/about",
    "/join",
    "/guide/apply",
    "/vacancies",
    "/news",
    "/support",
    "/history",
    "/people",
    "/contacts",
    "/privacy",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: (path === "" ? "daily" : "weekly") as "daily" | "weekly",
    priority: path === "" ? 1 : path === "/join" || path === "/vacancies" ? 0.9 : 0.7,
  }));

  try {
    const [news, vacs] = await Promise.all([
      db
        .select({ slug: newsArticles.slug, updatedAt: newsArticles.updatedAt })
        .from(newsArticles)
        .where(eq(newsArticles.status, "published")),
      db
        .select({ slug: vacancies.slug, updatedAt: vacancies.updatedAt })
        .from(vacancies)
        .where(eq(vacancies.status, "open")),
    ]);

    return [
      ...staticRoutes,
      ...news.map((n) => ({
        url: `${base}/news/${n.slug}`,
        lastModified: n.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
      ...vacs.map((v) => ({
        url: `${base}/vacancies/${v.slug}`,
        lastModified: v.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
