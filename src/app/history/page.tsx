import type { Metadata } from "next";
import { siteCopy } from "@/content/site-copy";
import { siteImages } from "@/content/image-catalog";
import { getSitePage, pageDefaults } from "@/lib/cms";
import { PageFrame, PageHeader, ContentPanel } from "@/components/layout/page-frame";

export const metadata: Metadata = {
  title: "Історія",
  description: siteCopy.meta.historyDescription,
};

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const page = await getSitePage("history");
  const defaults = pageDefaults("history");
  const title = page?.title ?? defaults.title;
  const body = page?.body ?? defaults.body;

  return (
    <PageFrame>
      <PageHeader kicker="Хронологія" title={title} media={siteImages.illustrative.historyArchive} />
      <ContentPanel width="narrow">
        <div className="prose-orb whitespace-pre-line">{body}</div>
      </ContentPanel>
    </PageFrame>
  );
}
