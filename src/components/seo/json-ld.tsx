import { buildSiteJsonLd } from "@/lib/seo";

/** Server-rendered JSON-LD for Google rich results / Knowledge Graph. */
export function SiteJsonLd() {
  const data = buildSiteJsonLd();
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
