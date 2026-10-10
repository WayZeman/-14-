import type { Metadata } from "next";
import { siteCopy } from "@/content/site-copy";
import { getSitePage, getSupportSettings, pageDefaults } from "@/lib/cms";
import { PageFrame, PageHeader } from "@/components/layout/page-frame";
import { SupportPageClient } from "@/components/support/support-page-client";

export const metadata: Metadata = {
  title: "Підтримка",
  description: siteCopy.meta.supportDescription,
};

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const [page, support] = await Promise.all([getSitePage("support"), getSupportSettings()]);
  const defaults = pageDefaults("support");
  const title = page?.title ?? defaults.title;
  const intro = page?.body || defaults.body;

  return (
    <PageFrame>
      <PageHeader kicker="Підтримка" title={title} lead={intro} />
      <SupportPageClient
        fallbackMonobankUrl={support.monobankUrl}
        fallbackCardNumber={support.cardNumber}
      />
    </PageFrame>
  );
}
