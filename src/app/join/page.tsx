import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { vacancies } from "@/db/schema";
import { siteCopy } from "@/content/site-copy";
import { siteImages } from "@/content/image-catalog";
import { siteConfig } from "@/lib/site-config";
import { getContactsSettings, getSitePage, pageDefaults } from "@/lib/cms";
import {
  PageFrame,
  PageHeader,
  ContentPanel,
  PageCard,
  PageSplit,
  PageSplitAside,
  PageSplitMain,
  PagePhoneLink,
} from "@/components/layout/page-frame";
import { SocialLinks } from "@/components/layout/social-links";
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

  const [contacts, page] = await Promise.all([getContactsSettings(), getSitePage("join")]);
  const defaults = pageDefaults("join");
  const title = page?.title ?? defaults.title;
  const intro = page?.body || defaults.body;
  const social = [
    { label: "Facebook", href: contacts.facebookUrl },
    { label: "Instagram", href: contacts.instagramUrl },
  ] as const;

  return (
    <PageFrame>
      <PageHeader
        kicker="Рекрутинг"
        title={title}
        lead={intro}
        media={siteImages.illustrative.heroAtmosphere}
      />

      <ContentPanel>
        <PageSplit>
          <PageSplitAside>
            <PageCard>
              <h2 className="font-display text-lg font-semibold text-[var(--graphite)]">
                {siteCopy.joinPage.contactTitle}
              </h2>
              <p className="mt-2 text-sm text-[var(--ink-soft)] md:text-base">{contacts.workingHours}</p>
              <PagePhoneLink phone={contacts.phone} className="mt-5">
                {siteCopy.finalCta.ctaPhone}
              </PagePhoneLink>
              <div className="mt-6 flex flex-col gap-3">
                <LinkButton href="/vacancies" variant="outline" className="w-full">
                  {siteCopy.joinPage.ctaVacancies}
                </LinkButton>
                <SocialLinks stacked links={social} />
              </div>
            </PageCard>

            <PageCard tone="soft">
              <h2 className="font-display text-lg font-semibold text-[var(--graphite)]">
                Переваги служби
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--ink-soft)] md:text-base">
                {siteConfig.benefitsOfficial}
              </p>
            </PageCard>

            <div>
              <h2 className="font-display text-lg font-semibold text-[var(--graphite)]">
                {siteCopy.joinPage.faqTitle}
              </h2>
              <dl className="mt-4 space-y-4">
                {siteCopy.joinFaq.map((item) => (
                  <div key={item.q} className="border-t border-[var(--line)] pt-4">
                    <dt className="font-semibold text-[var(--graphite)]">{item.q}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)] md:text-base">
                      {item.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </PageSplitAside>

          <PageSplitMain>
            <ApplicationForm directions={directions} />
          </PageSplitMain>
        </PageSplit>
      </ContentPanel>
    </PageFrame>
  );
}
