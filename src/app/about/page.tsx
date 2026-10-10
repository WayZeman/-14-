import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { sitePages } from "@/db/schema";
import { siteCopy } from "@/content/site-copy";
import { siteConfig } from "@/lib/site-config";
import { PageFrame, PageHeader, ContentPanel } from "@/components/layout/page-frame";

export const metadata: Metadata = {
  title: "Хто ми",
  description: siteCopy.meta.aboutDescription,
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  let body: string = siteConfig.aboutOfficial;
  let title: string = siteCopy.aboutPage.title;

  try {
    const [page] = await db
      .select()
      .from(sitePages)
      .where(eq(sitePages.key, "about"))
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
      <PageHeader kicker="Про батальйон" title={title} />
      <ContentPanel width="narrow">
        <div className="prose-orb whitespace-pre-line">{body}</div>
      </ContentPanel>
    </PageFrame>
  );
}
