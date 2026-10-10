import { redirect } from "next/navigation";
import { db } from "@/db";
import { supportCampaigns } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/shell";
import { AdminField, AdminSelect, AdminSubmit } from "@/components/admin/field";
import { createCampaignAction, updateCampaignAction, deleteCampaignAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminCampaignsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const items = await db.select().from(supportCampaigns);

  return (
    <AdminShell user={user}>
      <h1 className="font-display text-3xl font-semibold">Збори</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Не вказуйте ціль/прогрес без підтверджених даних.
      </p>

      <form action={createCampaignAction} className="mt-8 space-y-3 border bg-white p-6">
        <h2 className="font-semibold">Новий збір</h2>
        <AdminField label="Назва" name="title" required />
        <AdminField label="Опис" name="description" type="textarea" rows={3} />
        <AdminField label="Monobank URL" name="monobankUrl" />
        <AdminField label="Номер картки" name="cardNumber" />
        <AdminField label="Ціль (грн, опційно)" name="goalAmount" type="number" />
        <AdminField label="Зібрано (грн, опційно)" name="raisedAmount" type="number" />
        <AdminSelect
          label="Статус"
          name="status"
          defaultValue="active"
          options={[
            { value: "active", label: "Активний" },
            { value: "completed", label: "Завершено" },
            { value: "paused", label: "Пауза" },
          ]}
        />
        <AdminSubmit>Створити</AdminSubmit>
      </form>

      <ul className="mt-8 space-y-6">
        {items.map((item) => (
          <li key={item.id} className="border bg-white p-5">
            <form action={updateCampaignAction} className="space-y-3">
              <input type="hidden" name="id" value={item.id} />
              <AdminField label="Назва" name="title" required defaultValue={item.title} />
              <AdminField
                label="Опис"
                name="description"
                type="textarea"
                rows={3}
                defaultValue={item.description}
              />
              <AdminField label="Monobank URL" name="monobankUrl" defaultValue={item.monobankUrl} />
              <AdminField label="Номер картки" name="cardNumber" defaultValue={item.cardNumber} />
              <AdminField
                label="Ціль (грн)"
                name="goalAmount"
                type="number"
                defaultValue={item.goalAmount}
              />
              <AdminField
                label="Зібрано (грн)"
                name="raisedAmount"
                type="number"
                defaultValue={item.raisedAmount}
              />
              <AdminSelect
                label="Статус"
                name="status"
                defaultValue={item.status}
                options={[
                  { value: "active", label: "Активний" },
                  { value: "completed", label: "Завершено" },
                  { value: "paused", label: "Пауза" },
                ]}
              />
              <AdminSubmit>Оновити</AdminSubmit>
            </form>
            <form action={deleteCampaignAction} className="mt-3">
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
