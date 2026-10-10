import { redirect } from "next/navigation";
import { db } from "@/db";
import { supportCampaigns } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/shell";
import { createCampaignAction } from "./actions";

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
        <input name="title" required placeholder="Назва" className="w-full border px-3 py-2 text-sm" />
        <textarea name="description" rows={3} placeholder="Опис" className="w-full border px-3 py-2 text-sm" />
        <input name="monobankUrl" placeholder="Monobank URL" className="w-full border px-3 py-2 text-sm" />
        <input name="cardNumber" placeholder="Номер картки" className="w-full border px-3 py-2 text-sm" />
        <input name="goalAmount" type="number" placeholder="Ціль (грн, опційно)" className="w-full border px-3 py-2 text-sm" />
        <input name="raisedAmount" type="number" placeholder="Зібрано (грн, опційно)" className="w-full border px-3 py-2 text-sm" />
        <select name="status" defaultValue="active" className="border px-3 py-2 text-sm">
          <option value="active">Активний</option>
          <option value="completed">Завершено</option>
          <option value="paused">Пауза</option>
        </select>
        <button type="submit" className="bg-[var(--accent)] px-4 py-2 text-sm font-semibold">
          Зберегти
        </button>
      </form>

      <ul className="mt-8 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="border bg-white p-4 text-sm">
            <div className="font-semibold">{item.title}</div>
            <div className="text-[var(--muted)]">{item.status}</div>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
