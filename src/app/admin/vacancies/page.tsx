import { redirect } from "next/navigation";
import { db } from "@/db";
import { vacancies } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/shell";
import { createVacancyAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminVacanciesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const items = await db.select().from(vacancies).orderBy(vacancies.sortOrder);

  return (
    <AdminShell user={user}>
      <h1 className="font-display text-3xl font-semibold">Вакансії</h1>

      <form action={createVacancyAction} className="mt-8 space-y-3 border bg-white p-6">
        <h2 className="font-semibold">Нова вакансія</h2>
        <input name="title" required placeholder="Назва посади" className="w-full border px-3 py-2 text-sm" />
        <input name="direction" placeholder="Напрям" className="w-full border px-3 py-2 text-sm" />
        <textarea name="shortDescription" rows={2} placeholder="Короткий опис" className="w-full border px-3 py-2 text-sm" />
        <textarea name="description" rows={4} placeholder="Повний опис" className="w-full border px-3 py-2 text-sm" />
        <textarea name="requirements" rows={3} placeholder="Вимоги" className="w-full border px-3 py-2 text-sm" />
        <select name="status" defaultValue="open" className="border px-3 py-2 text-sm">
          <option value="open">Набір відкрито</option>
          <option value="paused">Пауза</option>
          <option value="closed">Закрито</option>
        </select>
        <button type="submit" className="bg-[var(--accent)] px-4 py-2 text-sm font-semibold">
          Зберегти
        </button>
      </form>

      <ul className="mt-8 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="border bg-white p-4 text-sm">
            <div className="font-semibold">{item.title}</div>
            <div className="text-[var(--muted)]">
              {item.status} · {item.direction || "—"} · /vacancies/{item.slug}
            </div>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
