import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { newsArticles } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/shell";
import { createNewsAction } from "./actions";
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
        <input
          name="title"
          required
          placeholder="Заголовок"
          className="w-full border px-3 py-2 text-sm"
        />
        <input
          name="excerpt"
          placeholder="Короткий опис"
          className="w-full border px-3 py-2 text-sm"
        />
        <textarea
          name="body"
          required
          rows={6}
          placeholder="Текст"
          className="w-full border px-3 py-2 text-sm"
        />
        <select name="status" className="border px-3 py-2 text-sm" defaultValue="draft">
          <option value="draft">Чернетка</option>
          <option value="published">Опубліковано</option>
        </select>
        <button type="submit" className="bg-[var(--accent)] px-4 py-2 text-sm font-semibold">
          Зберегти
        </button>
      </form>

      <ul className="mt-8 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="border bg-white p-4 text-sm">
            <div className="font-semibold">{item.title}</div>
            <div className="mt-1 text-[var(--muted)]">
              {item.status} · {formatUaDate(item.publishedAt || item.createdAt)} · /news/
              {item.slug}
            </div>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
