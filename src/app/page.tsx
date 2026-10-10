import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { vacancies } from "@/db/schema";
import { getNewsFeed } from "@/lib/news-feed";
import { Hero } from "@/components/home/hero";
import { AboutSection } from "@/components/home/about";
import { DirectionsSection } from "@/components/home/directions";
import { RecruitingSection } from "@/components/home/recruiting";
import { JoinStepsSection } from "@/components/home/join-steps";
import { NewsPreview } from "@/components/home/news-preview";
import { SupportCta } from "@/components/home/support-cta";
import { FinalCta } from "@/components/home/final-cta";
import { siteCopy } from "@/content/site-copy";
import { defaultSeoTitle } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: defaultSeoTitle },
  description: siteCopy.meta.defaultDescription,
  alternates: { canonical: "/" },
};

async function getHomeData() {
  try {
    const [vacancyRows, newsRows] = await Promise.all([
      db
        .select({
          id: vacancies.id,
          title: vacancies.title,
          slug: vacancies.slug,
          shortDescription: vacancies.shortDescription,
          direction: vacancies.direction,
        })
        .from(vacancies)
        .where(eq(vacancies.status, "open"))
        .orderBy(vacancies.sortOrder)
        .limit(6),
      getNewsFeed({ limit: 5 }),
    ]);
    return { vacancyRows, newsRows };
  } catch {
    return { vacancyRows: [], newsRows: [] };
  }
}

export default async function HomePage() {
  const { vacancyRows, newsRows } = await getHomeData();

  return (
    <>
      <Hero />
      <AboutSection />
      <DirectionsSection />
      <RecruitingSection vacancies={vacancyRows} />
      <JoinStepsSection />
      <NewsPreview items={newsRows} />
      <SupportCta />
      <FinalCta />
    </>
  );
}
