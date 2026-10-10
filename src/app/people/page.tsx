import type { Metadata } from "next";
import { siteCopy } from "@/content/site-copy";
import { PageFrame, PageHeader, ContentPanel } from "@/components/layout/page-frame";

export const metadata: Metadata = {
  title: "Люди",
  description: siteCopy.peoplePage.body.slice(0, 155),
};

export default function PeoplePage() {
  return (
    <PageFrame>
      <PageHeader kicker="Редакція" title={siteCopy.peoplePage.title} lead={siteCopy.peoplePage.body} />
      <ContentPanel>
        <p className="text-sm text-[var(--muted)]">{siteCopy.peoplePage.note}</p>
      </ContentPanel>
    </PageFrame>
  );
}
