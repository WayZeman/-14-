import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { vacancies } from "@/db/schema";
import { siteCopy } from "@/content/site-copy";
import { siteImages } from "@/content/image-catalog";
import { siteConfig } from "@/lib/site-config";
import { PageFrame, PageHeader, ContentPanel } from "@/components/layout/page-frame";
import { LinkButton } from "@/components/ui/link-button";
import { ApplicationForm } from "@/components/join/application-form";

export const metadata: Metadata = {
  title: "Приєднатися",
  description: siteCopy.meta.joinDescription,
};

export const dynamic = "force-dynamic";

export default async function JoinPage() {
  let directions: string[] = [];
  try {
    const rows = await db
      .select({ direction: vacancies.direction, title: vacancies.title })
      .from(vacancies)
      .where(eq(vacancies.status, "open"));
    directions = Array.from(
      new Set(
        rows
          .flatMap((r) => [r.direction, r.title])
          .filter((v): v is string => Boolean(v)),
      ),
    );
  } catch {
    directions = ["Оператор БпЛА", "Розвідник", "Водій", "Медик"];
  }

  return (
    <PageFrame>
      <PageHeader
        kicker="Рекрутинг"
        title={siteCopy.joinPage.title}
        lead={siteCopy.joinPage.intro}
        media={siteImages.illustrative.heroAtmosphere}
      />

      <ContentPanel className="!max-w-none">
        <div className="mx-auto grid max-w-[var(--container-max)] gap-12 lg:grid-cols-12 lg:px-8">
          <aside className="space-y-8 lg:col-span-5">
            <div className="border border-[var(--line)] bg-white p-6 md:p-8">
              <h2 className="font-display text-lg font-semibold text-[var(--graphite)]">
                {siteCopy.joinPage.contactTitle}
              </h2>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">{siteConfig.workingHours}</p>
              <a
                href={`tel:${siteConfig.phone}`}
                className="mt-4 inline-flex h-12 w-full items-center justify-center bg-[var(--graphite)] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                {siteCopy.finalCta.ctaPhone}
              </a>
              <div className="mt-6 flex flex-col gap-3">
                <LinkButton href="/vacancies" variant="outline" className="w-full">
                  {siteCopy.joinPage.ctaVacancies}
                </LinkButton>
                <a
                  href={siteConfig.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center border border-[var(--line)] text-sm font-semibold text-[var(--graphite)]"
                >
                  Facebook
                </a>
              </div>
            </div>

            <div className="border border-[var(--line)] bg-[var(--milk-soft)] p-6 md:p-8">
              <h2 className="font-display text-lg font-semibold text-[var(--graphite)]">
                Переваги служби
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--ink-soft)]">
                {siteConfig.benefitsOfficial}
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-[var(--graphite)]">
                {siteCopy.joinPage.faqTitle}
              </h2>
              <dl className="mt-4 space-y-4">
                {siteCopy.joinFaq.map((item) => (
                  <div key={item.q} className="border-t border-[var(--line)] pt-4">
                    <dt className="font-semibold text-[var(--graphite)]">{item.q}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>

          <div className="lg:col-span-7">
            <ApplicationForm directions={directions} />
          </div>
        </div>
      </ContentPanel>
    </PageFrame>
  );
}
