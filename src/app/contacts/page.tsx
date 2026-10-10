import type { Metadata } from "next";
import { siteCopy } from "@/content/site-copy";
import { getContactsSettings, getSitePage, pageDefaults } from "@/lib/cms";
import {
  PageFrame,
  PageHeader,
  ContentPanel,
  PageGrid,
  PageCard,
  PagePhoneLink,
} from "@/components/layout/page-frame";
import { SocialLinks } from "@/components/layout/social-links";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = {
  title: "Контакти",
  description: siteCopy.meta.contactsDescription,
};

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const [contacts, page] = await Promise.all([getContactsSettings(), getSitePage("contacts")]);
  const defaults = pageDefaults("contacts");
  const title = page?.title ?? defaults.title;
  const lead = page?.body || undefined;
  const social = [
    { label: "Facebook", href: contacts.facebookUrl },
    { label: "Instagram", href: contacts.instagramUrl },
  ] as const;

  return (
    <PageFrame>
      <PageHeader kicker="Зв'язок" title={title} lead={lead} />
      <ContentPanel>
        <PageGrid className="max-w-4xl">
          <PageCard>
            <h2 className="font-display text-lg font-semibold text-[var(--graphite)]">
              {siteCopy.contactsPage.recruitingTitle}
            </h2>
            <PagePhoneLink phone={contacts.phone} className="mt-5">
              {siteCopy.finalCta.ctaPhone}
            </PagePhoneLink>
            <p className="mt-4 text-sm text-[var(--ink-soft)] md:text-base">{contacts.workingHours}</p>
          </PageCard>
          <PageCard tone="soft">
            <h2 className="font-display text-lg font-semibold text-[var(--graphite)]">
              {siteCopy.contactsPage.socialTitle}
            </h2>
            <SocialLinks className="mt-5" stacked links={social} />
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
