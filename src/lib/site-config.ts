/**
 * Публічні дані офіційного сайту 14orb.co.ua.
 * Маркетингові тексти секцій — у src/content/site-copy.ts
 */
export const siteConfig = {
  name: "14 ОРБ",
  fullName: "14-й окремий розвідувальний батальйон",
  slogan: "Дій першим",
  heroHeadline: "БАЧИМО БІЛЬШЕ.\nДІЄМО ПЕРШИМИ.",
  heroHeadlineFallback: "СТАНЬ ОДНИМ ІЗ НАС.\nДІЙ ПЕРШИМ",
  useExperimentalHeadline: true,
  tagline: ["БРАТЕРСТВО", "ТЕХНОЛОГІЇ", "ПЕРЕМОГА"],
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://14orb.co.ua",
  phone: "+380950786675",
  phoneDisplay: "+38 (095) 078 66 75",
  workingHours: "Щоденно з 09:00 до 20:00",
  facebookUrl: "https://www.facebook.com/14osb/?locale=uk_UA",
  /** Username сторінки для Graph API (якщо FACEBOOK_PAGE_ID не задано) */
  facebookPageUsername: "14osb",
  instagramUrl: "https://www.instagram.com/14_orb/",
  instagramHandle: "14_orb",
  social: [
    { label: "Facebook", href: "https://www.facebook.com/14osb/?locale=uk_UA" },
    { label: "Instagram", href: "https://www.instagram.com/14_orb/" },
  ] as const,
  monobankUrl: "https://send.monobank.ua/jar/6eFKaDCcuv",
  cardNumber: "4441111126857253",
  /** Офіційне формулювання — один раз (about / SEO). */
  aboutOfficial:
    "14 окремий розвідувальний батальйон — це очі і вуха Збройних сил. Завдяки досвіду та технологіям ми рятуємо життя та змінюємо хід бойових дій.",
  benefitsOfficial:
    "Розвиток, навчання, матеріальне та грошове забезпечення, сприятливих командирів які вислухають та допоможуть.",
  requirementsOfficial:
    "Вік 18–60 років, відсутність судимостей, придатність за станом здоров'я, мотивація до служби, дисциплінованість, базова фізпідготовка та наявність необхідних документів.",
  nav: [
    { href: "/#about", label: "Хто ми" },
    { href: "/#directions", label: "Напрямки" },
    { href: "/join", label: "Приєднатися" },
    { href: "/vacancies", label: "Вакансії" },
    { href: "/news", label: "Новини" },
    { href: "/support", label: "Підтримка" },
    { href: "/history", label: "Історія" },
    { href: "/contacts", label: "Контакти" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
