import Link from "next/link";
import { destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";

async function logoutAction() {
  "use server";
  await destroySession();
  redirect("/admin/login");
}

export function AdminShell({
  user,
  children,
}: {
  user: { name: string; role: string };
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--milk-soft)] text-[var(--graphite)]">
      <header className="border-b border-[var(--graphite)]/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="font-display text-lg font-semibold">14 ОРБ · Адмін</div>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link href="/admin">Огляд</Link>
            <Link href="/admin/content">Тексти</Link>
            <Link href="/admin/news">Новини</Link>
            <Link href="/admin/vacancies">Вакансії</Link>
            <Link href="/admin/campaigns">Збори</Link>
            <Link href="/admin/applications">Звернення</Link>
            <Link href="/" className="text-[var(--olive)]">
              На сайт
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="text-[var(--muted)]">
                Вийти
              </button>
            </form>
          </nav>
          <div className="text-xs text-[var(--muted)]">
            {user.name} · {user.role}
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8">{children}</div>
    </div>
  );
}
