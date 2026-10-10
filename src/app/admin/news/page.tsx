import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { newsArticles } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/shell";
import { AdminField, AdminSelect, AdminSubmit } from "@/components/admin/field";
import { createNewsAction, updateNewsAction, deleteNewsAction } from "./actions";
import { formatUaDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const items = await db
    .select()
    .from(newsArticles)
    .orderBy(desc(newsArticles.createdAt))
    .limit(50);

  return (
    <AdminShell user={user}>
      <h1 className="font-display text-3xl font-semibold">Новини</h1>

      <form action={createNewsAction} className="mt-8 space-y-3 border bg-white p-6">
        <h2 className="font-semibold">Нова стаття</h2>
        <AdminField label="Заголовок" name="title" required />
        <AdminField label="Короткий опис" name="excerpt" />
        <AdminField label="Текст" name="body" type="textarea" rows={6} required />
        <AdminSelect
          label="Статус"
          name="status"
          defaultValue="draft"
          options={[
            { value: "draft", label: "Чернетка" },
            { value: "published", label: "Опубліковано" },
          ]}
        />
        <AdminSubmit>Створити</AdminSubmit>
      </form>

      <ul className="mt-8 space-y-6">
        {items.map((item) => (
          <li key={item.id} className="border bg-white p-5">
            <div className="mb-3 text-xs text-[var(--muted)]">
              /news/{item.slug} · {formatUaDate(item.publishedAt || item.createdAt)}
            </div>
            <form action={updateNewsAction} className="space-y-3">
              <input type="hidden" name="id" value={item.id} />
              <AdminField label="Заголовок" name="title" required defaultValue={item.title} />
              <AdminField label="Короткий опис" name="excerpt" defaultValue={item.excerpt} />
              <AdminField
                label="Текст"
                name="body"
                type="textarea"
                rows={6}
                required
                defaultValue={item.body}
              />
              <AdminSelect
                label="Статус"
                name="status"
                defaultValue={item.status}
                options={[
                  { value: "draft", label: "Чернетка" },
                  { value: "published", label: "Опубліковано" },
                  { value: "archived", label: "Архів" },
                ]}
              />
              <div className="flex flex-wrap gap-3">
                <AdminSubmit>Оновити</AdminSubmit>
              </div>
            </form>
            <form action={deleteNewsAction} className="mt-3">
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" className="text-sm text-red-700 underline">
                Видалити
              </button>
            </form>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
