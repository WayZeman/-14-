import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { vacancies } from "@/db/schema";
import { getNewsFeed } from "@/lib/news-feed";
import {
  getContactsSettings,
  getHeroSettings,
  getHomeAboutSettings,
  getSupportSettings,
} from "@/lib/cms";
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
    const [vacancyRows, newsRows, hero, homeAbout, support, contacts] = await Promise.all([
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
      getHeroSettings(),
      getHomeAboutSettings(),
      getSupportSettings(),
      getContactsSettings(),
    ]);
    return { vacancyRows, newsRows, hero, homeAbout, support, contacts };
  } catch {
    return {
      vacancyRows: [],
      newsRows: [],
      hero: await getHeroSettings(),
      homeAbout: await getHomeAboutSettings(),
      support: await getSupportSettings(),
      contacts: await getContactsSettings(),
    };
  }
}

export default async function HomePage() {
  const { vacancyRows, newsRows, hero, homeAbout, support, contacts } = await getHomeData();

  return (
    <>
      <Hero headline={hero.headline} sub={hero.sub} />
      <AboutSection content={homeAbout} />
      <DirectionsSection />
      <RecruitingSection vacancies={vacancyRows} />
      <JoinStepsSection />
      <NewsPreview items={newsRows} />
      <SupportCta monobankUrl={support.monobankUrl} cardNumber={support.cardNumber} />
      <FinalCta phone={contacts.phone} workingHours={contacts.workingHours} />
    </>
  );
}
