"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { vacancies } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function createVacancyAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const title = String(formData.get("title") || "").trim();
  if (!title) return;

  const slug = `${slugify(title) || "vacancy"}-${Date.now().toString(36)}`;

  await db.insert(vacancies).values({
    title,
    slug,
    direction: String(formData.get("direction") || "").trim() || null,
    shortDescription: String(formData.get("shortDescription") || "").trim() || null,
    description: String(formData.get("description") || "").trim() || null,
    requirements: String(formData.get("requirements") || "").trim() || null,
    status: (String(formData.get("status") || "open") as "open" | "closed" | "paused"),
  });

  redirect("/admin/vacancies");
}
