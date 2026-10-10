import Link from "next/link";
import { redirect } from "next/navigation";
import { count } from "drizzle-orm";
import { db } from "@/db";
import {
  applications,
  newsArticles,
  supportCampaigns,
  vacancies,
} from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/shell";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  let stats = { news: 0, vacancies: 0, campaigns: 0, applications: 0 };
  try {
    const [n] = await db.select({ c: count() }).from(newsArticles);
    const [v] = await db.select({ c: count() }).from(vacancies);
    const [c] = await db.select({ c: count() }).from(supportCampaigns);
    const [a] = await db.select({ c: count() }).from(applications);
    stats = {
      news: n?.c ?? 0,
      vacancies: v?.c ?? 0,
      campaigns: c?.c ?? 0,
      applications: a?.c ?? 0,
    };
  } catch {
    /* empty */
  }

  const cards = [
    { href: "/admin/news", label: "Новини", value: stats.news },
    { href: "/admin/vacancies", label: "Вакансії", value: stats.vacancies },
    { href: "/admin/campaigns", label: "Збори", value: stats.campaigns },
    { href: "/admin/applications", label: "Звернення", value: stats.applications },
  ];

  return (
    <AdminShell user={user}>
      <h1 className="font-display text-3xl font-semibold">Огляд</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Керування контентом сайту 14 ОРБ (Neon Postgres).
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="border border-[var(--graphite)]/10 bg-white p-5"
          >
            <div className="text-sm text-[var(--muted)]">{card.label}</div>
            <div className="mt-2 font-display text-3xl font-semibold">{card.value}</div>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
