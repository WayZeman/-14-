import "server-only";

import { eq } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db";
import { sitePages, siteSettings } from "@/db/schema";
import { siteConfig } from "@/lib/site-config";
import { siteCopy } from "@/content/site-copy";
import type {
  ContactsSettings,
  HeroSettings,
  HomeAboutSettings,
  SupportSettings,
} from "@/lib/cms-types";

export type {
  ContactsSettings,
  HeroSettings,
  HomeAboutSettings,
  SupportSettings,
} from "@/lib/cms-types";

export const CMS_PAGES = [
  {
    key: "about",
    label: "Хто ми",
    hint: "Текст сторінки /about і короткий цитат на головній (перший абзац).",
  },
  {
    key: "history",
    label: "Історія",
    hint: "Сторінка /history",
  },
  {
    key: "people",
    label: "Люди",
    hint: "Сторінка /people",
  },
  {
    key: "privacy",
    label: "Політика конфіденційності",
    hint: "Сторінка /privacy",
  },
  {
    key: "join",
    label: "Приєднатися",
    hint: "Вступний текст на /join",
  },
  {
    key: "support",
    label: "Підтримка",
    hint: "Вступний текст на /support",
  },
  {
    key: "contacts",
    label: "Контакти",
    hint: "Заголовок / вступ на /contacts",
  },
  {
    key: "news",
    label: "Новини",
    hint: "Повідомлення про соцмережі на /news",
  },
] as const;

export type CmsPageKey = (typeof CMS_PAGES)[number]["key"];

const defaultContacts = (): ContactsSettings => ({
  phone: siteConfig.phone,
  phoneDisplay: siteConfig.phoneDisplay,
  workingHours: siteConfig.workingHours,
  facebookUrl: siteConfig.facebookUrl,
  instagramUrl: siteConfig.instagramUrl,
});

const defaultSupport = (): SupportSettings => ({
  monobankUrl: siteConfig.monobankUrl,
  cardNumber: siteConfig.cardNumber,
});

const defaultHero = (): HeroSettings => ({
  headline: siteConfig.heroHeadline,
  sub: siteCopy.hero.subExperimental,
});

const defaultHomeAbout = (): HomeAboutSettings => ({
  title: siteCopy.homeAbout.title,
  quote: siteConfig.aboutOfficial,
  paragraph2: siteCopy.homeAbout.paragraph2,
  paragraph3: siteCopy.homeAbout.paragraph3,
});

export const CMS_SETTINGS = [
  {
    key: "contacts",
    label: "Контакти та соцмережі",
    fields: [
      { name: "phone", label: "Телефон (tel:)", type: "text" as const },
      { name: "phoneDisplay", label: "Телефон (відображення)", type: "text" as const },
      { name: "workingHours", label: "Години роботи", type: "text" as const },
      { name: "facebookUrl", label: "Facebook URL", type: "text" as const },
      { name: "instagramUrl", label: "Instagram URL", type: "text" as const },
    ],
    defaults: defaultContacts,
  },
  {
    key: "support",
    label: "Реквізити підтримки",
    fields: [
      { name: "monobankUrl", label: "Monobank jar URL", type: "text" as const },
      { name: "cardNumber", label: "Номер картки", type: "text" as const },
    ],
    defaults: defaultSupport,
  },
  {
    key: "hero",
    label: "Головний екран",
    fields: [
      { name: "headline", label: "Заголовок (рядки через \\n)", type: "textarea" as const },
      { name: "sub", label: "Підзаголовок", type: "textarea" as const },
    ],
    defaults: defaultHero,
  },
  {
    key: "home_about",
    label: "Блок «Хто ми» на головній",
    fields: [
      { name: "title", label: "Заголовок", type: "text" as const },
      { name: "quote", label: "Цитата / офіційне формулювання", type: "textarea" as const },
      { name: "paragraph2", label: "Абзац 2", type: "textarea" as const },
      { name: "paragraph3", label: "Абзац 3", type: "textarea" as const },
    ],
    defaults: defaultHomeAbout,
  },
] as const;

export type CmsSettingKey = (typeof CMS_SETTINGS)[number]["key"];

export const getSitePage = cache(async (key: string) => {
  try {
    const [row] = await db.select().from(sitePages).where(eq(sitePages.key, key)).limit(1);
    return row ?? null;
  } catch {
    return null;
  }
});

export const getAllSitePages = cache(async () => {
  try {
    return await db.select().from(sitePages);
  } catch {
    return [];
  }
});

export async function upsertSitePage(input: {
  key: string;
  title: string;
  body: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
}) {
  const existing = await getSitePage(input.key);
  if (existing) {
    await db
      .update(sitePages)
      .set({
        title: input.title,
        body: input.body,
        seoTitle: input.seoTitle || null,
        seoDescription: input.seoDescription || null,
        updatedAt: new Date(),
      })
      .where(eq(sitePages.key, input.key));
    return;
  }
  await db.insert(sitePages).values({
    key: input.key,
    title: input.title,
    body: input.body,
    seoTitle: input.seoTitle || null,
    seoDescription: input.seoDescription || null,
    status: "published",
  });
}

async function getSettingRaw(key: string) {
  try {
    const [row] = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
    return row?.value ?? null;
  } catch {
    return null;
  }
}

export const getContactsSettings = cache(async (): Promise<ContactsSettings> => {
  const value = await getSettingRaw("contacts");
  return { ...defaultContacts(), ...(value as Partial<ContactsSettings> | null) };
});

export const getSupportSettings = cache(async (): Promise<SupportSettings> => {
  const value = await getSettingRaw("support");
  return { ...defaultSupport(), ...(value as Partial<SupportSettings> | null) };
});

export const getHeroSettings = cache(async (): Promise<HeroSettings> => {
  const value = await getSettingRaw("hero");
  return { ...defaultHero(), ...(value as Partial<HeroSettings> | null) };
});

export const getHomeAboutSettings = cache(async (): Promise<HomeAboutSettings> => {
  const value = await getSettingRaw("home_about");
  return { ...defaultHomeAbout(), ...(value as Partial<HomeAboutSettings> | null) };
});

export async function getSettingForAdmin(key: CmsSettingKey): Promise<Record<string, string>> {
  const meta = CMS_SETTINGS.find((s) => s.key === key)!;
  const defaults = meta.defaults() as Record<string, string>;
  const value = (await getSettingRaw(key)) as Record<string, string> | null;
  return { ...defaults, ...(value || {}) };
}

export async function upsertSiteSetting(key: string, value: Record<string, string>) {
  const existing = await getSettingRaw(key);
  if (existing !== null) {
    await db
      .update(siteSettings)
      .set({ value, updatedAt: new Date() })
      .where(eq(siteSettings.key, key));
    return;
  }
  await db.insert(siteSettings).values({ key, value });
}

export function pageDefaults(key: CmsPageKey): { title: string; body: string } {
  switch (key) {
    case "about":
      return { title: siteCopy.aboutPage.title, body: siteConfig.aboutOfficial };
    case "history":
      return { title: siteCopy.historyPage.title, body: siteCopy.historyPage.fallback };
    case "people":
      return {
        title: siteCopy.peoplePage.title,
        body: `${siteCopy.peoplePage.body}\n\n${siteCopy.peoplePage.note}`,
      };
    case "privacy":
      return {
        title: "Політика конфіденційності",
        body: "Редагуйте повний текст політики конфіденційності тут.",
      };
    case "join":
      return { title: siteCopy.joinPage.title, body: siteCopy.joinPage.intro };
    case "support":
      return { title: siteCopy.supportPage.title, body: siteCopy.supportPage.intro };
    case "contacts":
      return { title: siteCopy.contactsPage.title, body: "" };
    case "news":
      return { title: siteCopy.newsPage.title, body: siteCopy.newsPage.socialMessage };
    default:
      return { title: key, body: "" };
  }
}
