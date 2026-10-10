import type { Metadata } from "next";
import { siteCopy } from "@/content/site-copy";
import { getSitePage, pageDefaults } from "@/lib/cms";
import { PageFrame, PageHeader, ContentPanel, PageCard } from "@/components/layout/page-frame";

export const metadata: Metadata = {
  title: "Люди",
  description: siteCopy.peoplePage.body.slice(0, 155),
};

export const dynamic = "force-dynamic";

export default async function PeoplePage() {
  const page = await getSitePage("people");
  const defaults = pageDefaults("people");
  const title = page?.title ?? defaults.title;
  const body = page?.body ?? defaults.body;
  const [lead, ...rest] = body.split(/\n\n+/);
  const note = rest.join("\n\n");

  return (
    <PageFrame>
      <PageHeader kicker="Редакція" title={title} lead={lead} />
      <ContentPanel width="narrow">
        {note ? (
          <PageCard tone="soft">
            <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--ink-soft)] md:text-base">
              {note}
            </p>
          </PageCard>
        ) : null}
      </ContentPanel>
    </PageFrame>
  );
}
