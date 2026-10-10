"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { newsArticles } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function createNewsAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const title = String(formData.get("title") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const status = String(formData.get("status") || "draft") as "draft" | "published";

  if (!title || !body) return;

  const baseSlug = slugify(title) || `novyna-${Date.now()}`;
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  await db.insert(newsArticles).values({
    title,
    slug,
    excerpt: excerpt || null,
    body,
    status,
    publishedAt: status === "published" ? new Date() : null,
    seoTitle: title,
    seoDescription: excerpt || null,
  });

  redirect("/admin/news");
}

export async function updateNewsAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const id = String(formData.get("id") || "");
  if (!id) return;

  const title = String(formData.get("title") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const status = String(formData.get("status") || "draft") as "draft" | "published" | "archived";

  if (!title || !body) return;

  const [existing] = await db.select().from(newsArticles).where(eq(newsArticles.id, id)).limit(1);

  await db
    .update(newsArticles)
    .set({
      title,
      excerpt: excerpt || null,
      body,
      status,
      publishedAt:
        status === "published"
          ? existing?.publishedAt || new Date()
          : existing?.publishedAt || null,
      seoTitle: title,
      seoDescription: excerpt || null,
      updatedAt: new Date(),
    })
    .where(eq(newsArticles.id, id));

  redirect("/admin/news");
}

export async function deleteNewsAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const id = String(formData.get("id") || "");
  if (!id) return;

  await db.delete(newsArticles).where(eq(newsArticles.id, id));
  redirect("/admin/news");
}
