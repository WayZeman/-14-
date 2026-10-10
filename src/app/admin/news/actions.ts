"use server";

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
