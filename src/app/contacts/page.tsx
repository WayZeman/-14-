import type { Metadata } from "next";
import { siteCopy } from "@/content/site-copy";
import { siteConfig } from "@/lib/site-config";
import { PageFrame, PageHeader, ContentPanel } from "@/components/layout/page-frame";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = {
  title: "Контакти",
  description: siteCopy.meta.contactsDescription,
};

export default function ContactsPage() {
  return (
    <PageFrame>
      <PageHeader kicker="Зв'язок" title={siteCopy.contactsPage.title} />
      <ContentPanel>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="border border-[var(--line)] bg-white p-6 md:p-8">
            <h2 className="font-display text-lg font-semibold text-[var(--graphite)]">
              {siteCopy.contactsPage.recruitingTitle}
            </h2>
            <a
              href={`tel:${siteConfig.phone}`}
              className="mt-4 inline-flex h-12 items-center justify-center bg-[var(--graphite)] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {siteCopy.finalCta.ctaPhone}
            </a>
            <p className="mt-3 text-sm text-[var(--ink-soft)]">{siteConfig.workingHours}</p>
          </div>
          <div className="border border-[var(--line)] bg-[var(--milk-soft)] p-6 md:p-8">
            <h2 className="font-display text-lg font-semibold text-[var(--graphite)]">
              {siteCopy.contactsPage.socialTitle}
            </h2>
            <a
              href={siteConfig.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-semibold text-[var(--graphite)] underline underline-offset-2"
            >
              Facebook
            </a>
            <div className="mt-8 flex flex-col gap-3">
              <LinkButton href="/join#form" className="w-full sm:w-auto">
                {siteCopy.contactsPage.ctaForm}
              </LinkButton>
              <LinkButton href="/support" variant="outline" className="w-full sm:w-auto">
                {siteCopy.contactsPage.ctaSupport}
              </LinkButton>
            </div>
          </div>
        </div>
      </ContentPanel>
    </PageFrame>
  );
}
