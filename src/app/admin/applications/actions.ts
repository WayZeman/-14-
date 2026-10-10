"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";

export async function deleteApplicationAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  if (user.role !== "admin" && user.role !== "recruiter") redirect("/admin");

  const id = String(formData.get("id") || "");
  if (!id) return;

  await db.delete(applications).where(eq(applications.id, id));
  redirect("/admin/applications");
}
