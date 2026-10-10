import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { sitePages } from "@/db/schema";
import { siteCopy } from "@/content/site-copy";
import { siteImages } from "@/content/image-catalog";
import { PageFrame, PageHeader, ContentPanel } from "@/components/layout/page-frame";

export const metadata: Metadata = {
  title: "Історія",
  description: siteCopy.meta.historyDescription,
};

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  let body: string = siteCopy.historyPage.fallback;
  let title: string = siteCopy.historyPage.title;

  try {
    const [page] = await db
      .select()
      .from(sitePages)
      .where(eq(sitePages.key, "history"))
      .limit(1);
    if (page) {
      body = page.body;
      title = page.title;
    }
  } catch {
    /* fallback */
  }

  return (
    <PageFrame>
      <PageHeader kicker="Хронологія" title={title} media={siteImages.illustrative.historyArchive} />
      <ContentPanel>
        <div className="prose-orb whitespace-pre-line">{body}</div>
      </ContentPanel>
    </PageFrame>
  );
}
