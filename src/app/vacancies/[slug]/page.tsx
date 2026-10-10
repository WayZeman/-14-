import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { vacancies } from "@/db/schema";
import { PageFrame, BackLink, ContentPanel, PageCard } from "@/components/layout/page-frame";
import { DisplayTitle } from "@/components/ui/section";
import { LinkButton } from "@/components/ui/link-button";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

async function getVacancy(slug: string) {
  const [row] = await db
    .select()
    .from(vacancies)
    .where(and(eq(vacancies.slug, slug), eq(vacancies.status, "open")))
    .limit(1);
  return row;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const v = await getVacancy(slug);
    if (!v) return { title: "Вакансія" };
    return {
      title: v.seoTitle || v.title,
      description: v.seoDescription || v.shortDescription || undefined,
    };
  } catch {
    return { title: "Вакансія" };
  }
}

export default async function VacancyPage({ params }: Props) {
  const { slug } = await params;
  let vacancy;
  try {
    vacancy = await getVacancy(slug);
  } catch {
    notFound();
  }
  if (!vacancy) notFound();

  return (
    <PageFrame>
      <ContentPanel width="narrow">
        <BackLink href="/vacancies">Усі вакансії</BackLink>
        {vacancy.direction ? (
          <p className="mt-8 text-meta text-[var(--muted)]">{vacancy.direction}</p>
        ) : null}
        <DisplayTitle as="h1" className="mt-2">
          {vacancy.title}
        </DisplayTitle>
        {vacancy.shortDescription ? (
          <p className="text-lead mt-5">{vacancy.shortDescription}</p>
        ) : null}

        {vacancy.description ? (
          <div className="prose-orb mt-10 whitespace-pre-line">{vacancy.description}</div>
        ) : null}

        {vacancy.requirements ? (
          <PageCard tone="soft" className="mt-10">
            <h2 className="font-display text-lg font-semibold text-[var(--graphite)]">Вимоги</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[var(--ink-soft)] md:text-base">
              {vacancy.requirements}
            </p>
          </PageCard>
        ) : null}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <LinkButton href="/join#form" className="w-full sm:w-auto">
            Подати звернення
          </LinkButton>
          <LinkButton href="/join" variant="outline" className="w-full sm:w-auto">
            Зв&apos;язатися з рекрутером
          </LinkButton>
        </div>
      </ContentPanel>
    </PageFrame>
  );
}
