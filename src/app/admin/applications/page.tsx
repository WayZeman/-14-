import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/shell";
import { formatUaDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  if (user.role !== "admin" && user.role !== "recruiter") {
    return (
      <AdminShell user={user}>
        <p>Доступ до звернень лише для ролей admin / recruiter.</p>
      </AdminShell>
    );
  }

  const items = await db
    .select()
    .from(applications)
    .orderBy(desc(applications.createdAt))
    .limit(100);

  return (
    <AdminShell user={user}>
      <h1 className="font-display text-3xl font-semibold">Звернення кандидатів</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Персональні дані. Не експортуйте без потреби.
      </p>
      <ul className="mt-8 space-y-3">
        {items.length === 0 ? (
          <li className="border bg-white p-4 text-sm">Поки немає звернень.</li>
        ) : (
          items.map((item) => (
            <li key={item.id} className="border bg-white p-4 text-sm">
              <div className="flex flex-wrap justify-between gap-2">
                <strong>{item.name}</strong>
                <span className="text-[var(--muted)]">
                  {formatUaDate(item.createdAt)} · {item.status}
                </span>
              </div>
              <div className="mt-2">{item.contact}</div>
              {item.direction ? (
                <div className="mt-1 text-[var(--muted)]">Напрям: {item.direction}</div>
              ) : null}
              {item.message ? (
                <p className="mt-2 whitespace-pre-line text-[var(--ink-soft)]">{item.message}</p>
              ) : null}
            </li>
          ))
        )}
      </ul>
    </AdminShell>
  );
}
