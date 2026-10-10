import type { Metadata } from "next";
import { siteCopy } from "@/content/site-copy";
import { getSitePage, pageDefaults } from "@/lib/cms";
import { PageFrame, PageHeader, ContentPanel } from "@/components/layout/page-frame";

export const metadata: Metadata = {
  title: "Хто ми",
  description: siteCopy.meta.aboutDescription,
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const page = await getSitePage("about");
  const defaults = pageDefaults("about");
  const title = page?.title ?? defaults.title;
  const body = page?.body ?? defaults.body;

  return (
    <PageFrame>
      <PageHeader kicker="Про батальйон" title={title} />
      <ContentPanel width="narrow">
        <div className="prose-orb whitespace-pre-line">{body}</div>
      </ContentPanel>
    </PageFrame>
  );
}
