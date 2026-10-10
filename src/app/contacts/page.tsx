import type { Metadata } from "next";
import { siteCopy } from "@/content/site-copy";
import { siteConfig } from "@/lib/site-config";
import {
  PageFrame,
  PageHeader,
  ContentPanel,
  PageGrid,
  PageCard,
  PagePhoneLink,
  PageActionLink,
} from "@/components/layout/page-frame";
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
        <PageGrid className="max-w-4xl">
          <PageCard>
            <h2 className="font-display text-lg font-semibold text-[var(--graphite)]">
              {siteCopy.contactsPage.recruitingTitle}
            </h2>
            <PagePhoneLink phone={siteConfig.phone} className="mt-5">
              {siteCopy.finalCta.ctaPhone}
            </PagePhoneLink>
            <p className="mt-4 text-sm text-[var(--ink-soft)] md:text-base">{siteConfig.workingHours}</p>
          </PageCard>
          <PageCard tone="soft">
            <h2 className="font-display text-lg font-semibold text-[var(--graphite)]">
              {siteCopy.contactsPage.socialTitle}
            </h2>
            <PageActionLink
              href={siteConfig.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              className="mt-5"
            >
              Facebook
            </PageActionLink>
            <div className="mt-auto flex flex-col gap-3 pt-8">
              <LinkButton href="/join#form" className="w-full">
                {siteCopy.contactsPage.ctaForm}
              </LinkButton>
              <LinkButton href="/support" variant="outline" className="w-full">
                {siteCopy.contactsPage.ctaSupport}
              </LinkButton>
            </div>
          </PageCard>
        </PageGrid>
      </ContentPanel>
    </PageFrame>
  );
}
