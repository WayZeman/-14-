import { redirect } from "next/navigation";
import { db } from "@/db";
import { vacancies } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/shell";
import { AdminField, AdminSelect, AdminSubmit } from "@/components/admin/field";
import { createVacancyAction, updateVacancyAction, deleteVacancyAction } from "./actions";

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
        <AdminField label="Назва посади" name="title" required />
        <AdminField label="Напрям" name="direction" />
        <AdminField label="Короткий опис" name="shortDescription" type="textarea" rows={2} />
        <AdminField label="Повний опис" name="description" type="textarea" rows={4} />
        <AdminField label="Вимоги" name="requirements" type="textarea" rows={3} />
        <AdminSelect
          label="Статус"
          name="status"
          defaultValue="open"
          options={[
            { value: "open", label: "Набір відкрито" },
            { value: "paused", label: "Пауза" },
            { value: "closed", label: "Закрито" },
          ]}
        />
        <AdminSubmit>Створити</AdminSubmit>
      </form>

      <ul className="mt-8 space-y-6">
        {items.map((item) => (
          <li key={item.id} className="border bg-white p-5">
            <div className="mb-3 text-xs text-[var(--muted)]">/vacancies/{item.slug}</div>
            <form action={updateVacancyAction} className="space-y-3">
              <input type="hidden" name="id" value={item.id} />
              <AdminField label="Назва посади" name="title" required defaultValue={item.title} />
              <AdminField label="Напрям" name="direction" defaultValue={item.direction} />
              <AdminField
                label="Короткий опис"
                name="shortDescription"
                type="textarea"
                rows={2}
                defaultValue={item.shortDescription}
              />
              <AdminField
                label="Повний опис"
                name="description"
                type="textarea"
                rows={4}
                defaultValue={item.description}
              />
              <AdminField
                label="Вимоги"
                name="requirements"
                type="textarea"
                rows={3}
                defaultValue={item.requirements}
              />
              <AdminSelect
                label="Статус"
                name="status"
                defaultValue={item.status}
                options={[
                  { value: "open", label: "Набір відкрито" },
                  { value: "paused", label: "Пауза" },
                  { value: "closed", label: "Закрито" },
                ]}
              />
              <AdminSubmit>Оновити</AdminSubmit>
            </form>
            <form action={deleteVacancyAction} className="mt-3">
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
