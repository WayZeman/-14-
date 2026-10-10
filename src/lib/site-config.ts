/**
 * Перевірені публічні дані з архіву 14orb.co.ua (грудень 2025).
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
  applicationFormUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSdKavNYkm683sjqsMYvwBnV4TMqXqyw71uCifxSf6OVcXdWWw/viewform?usp=header",
  monobankUrl: "https://send.monobank.ua/jar/6eFKaDCcuv",
  cardNumber: "4441111126857253",
  /** Офіційна формулювання з сайту — використовувати один раз (about / SEO). */
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
