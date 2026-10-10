"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { supportCampaigns } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function createCampaignAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const title = String(formData.get("title") || "").trim();
  if (!title) return;

  const goalRaw = String(formData.get("goalAmount") || "").trim();
  const raisedRaw = String(formData.get("raisedAmount") || "").trim();

  await db.insert(supportCampaigns).values({
    title,
    slug: `${slugify(title) || "zbir"}-${Date.now().toString(36)}`,
    description: String(formData.get("description") || "").trim() || null,
    monobankUrl: String(formData.get("monobankUrl") || "").trim() || null,
    cardNumber: String(formData.get("cardNumber") || "").trim() || null,
    goalAmount: goalRaw ? Number(goalRaw) : null,
    raisedAmount: raisedRaw ? Number(raisedRaw) : null,
    status: String(formData.get("status") || "active") as
      | "active"
      | "completed"
      | "paused",
  });

  redirect("/admin/campaigns");
}
