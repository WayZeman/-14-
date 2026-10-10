import type { Metadata } from "next";
import { siteCopy } from "@/content/site-copy";
import { PageFrame, PageHeader, ContentPanel, PageCard } from "@/components/layout/page-frame";

export const metadata: Metadata = {
  title: "Люди",
  description: siteCopy.peoplePage.body.slice(0, 155),
};

export default function PeoplePage() {
  return (
    <PageFrame>
      <PageHeader kicker="Редакція" title={siteCopy.peoplePage.title} lead={siteCopy.peoplePage.body} />
      <ContentPanel width="narrow">
        <PageCard tone="soft">
          <p className="text-sm leading-relaxed text-[var(--ink-soft)] md:text-base">{siteCopy.peoplePage.note}</p>
        </PageCard>
      </ContentPanel>
    </PageFrame>
  );
}
