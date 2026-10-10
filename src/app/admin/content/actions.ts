"use server";

import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import {
  CMS_PAGES,
  CMS_SETTINGS,
  type CmsPageKey,
  type CmsSettingKey,
  upsertSitePage,
  upsertSiteSetting,
} from "@/lib/cms";

export async function savePageAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const key = String(formData.get("key") || "") as CmsPageKey;
  if (!CMS_PAGES.some((p) => p.key === key)) return;

  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  if (!title) return;

  await upsertSitePage({
    key,
    title,
    body,
    seoTitle: String(formData.get("seoTitle") || "").trim() || null,
    seoDescription: String(formData.get("seoDescription") || "").trim() || null,
  });

  redirect(`/admin/content?saved=${key}`);
}

export async function saveSettingAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const key = String(formData.get("key") || "") as CmsSettingKey;
  const meta = CMS_SETTINGS.find((s) => s.key === key);
  if (!meta) return;

  const value: Record<string, string> = {};
  for (const field of meta.fields) {
    value[field.name] = String(formData.get(field.name) || "").trim();
  }

  await upsertSiteSetting(key, value);
  redirect(`/admin/content?saved=${key}`);
}
