import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { vacancies } from "@/db/schema";
import { siteCopy } from "@/content/site-copy";
import { PageFrame, PageHeader, ContentPanel } from "@/components/layout/page-frame";

export const metadata: Metadata = {
  title: "Вакансії",
  description: siteCopy.meta.vacanciesDescription,
};

export const dynamic = "force-dynamic";

export default async function VacanciesPage() {
  let rows: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string | null;
    direction: string | null;
    status: "open" | "closed" | "paused";
  }[] = [];

  try {
    rows = await db
      .select({
        id: vacancies.id,
        title: vacancies.title,
        slug: vacancies.slug,
        shortDescription: vacancies.shortDescription,
        direction: vacancies.direction,
        status: vacancies.status,
      })
      .from(vacancies)
      .where(eq(vacancies.status, "open"))
      .orderBy(vacancies.sortOrder);
  } catch {
    rows = [];
  }

  return (
    <PageFrame>
      <PageHeader
        kicker="Рекрутинг"
        title={siteCopy.vacanciesPage.title}
        lead={siteCopy.vacanciesPage.intro}
      />
      <ContentPanel className="!max-w-none">
        <div className="mx-auto max-w-[var(--container-max)] px-5 md:px-8">
          {rows.length === 0 ? (
            <p className="text-[var(--ink-soft)]">
              {siteCopy.vacanciesPage.empty}{" "}
              <Link href="/join" className="font-semibold text-[var(--graphite)] underline">
                {siteCopy.vacanciesPage.emptyLink}
              </Link>
              .
            </p>
          ) : (
            <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {rows.map((v) => (
                <li key={v.id}>
                  <Link
                    href={`/vacancies/${v.slug}`}
                    className="group flex flex-col gap-3 py-8 md:flex-row md:items-start md:justify-between"
                  >
                    <div>
                      {v.direction ? (
                        <span className="text-meta text-[var(--muted)]">{v.direction}</span>
                      ) : null}
                      <h2 className="mt-1 font-editorial text-2xl text-[var(--graphite)] group-hover:text-[var(--olive-ink)] md:text-3xl">
                        {v.title}
                      </h2>
                      {v.shortDescription ? (
                        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-soft)]">
                          {v.shortDescription}
                        </p>
                      ) : null}
                    </div>
                    <span className="text-meta shrink-0 text-[var(--olive)]">Деталі →</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </ContentPanel>
    </PageFrame>
  );
}
