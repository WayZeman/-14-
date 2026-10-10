import { siteConfig } from "@/lib/site-config";
import { siteCopy } from "@/content/site-copy";

/** Пошукові формулювання, за якими люди шукають підрозділ. */
export const seoKeywords = [
  "14 ОРБ",
  "14 орб",
  "14ОРБ",
  "14орб",
  "14-й окремий розвідувальний батальйон",
  "14 окремий розвідувальний батальйон",
  "14-й окремий розвідувальний батальйон ЗСУ",
  "14 орб рекрутинг",
  "14 орб вакансії",
  "14 орб контакти",
  "розвідувальний батальйон",
  "військова розвідка ЗСУ",
  "рекрутинг ЗСУ",
  "БПЛА ЗСУ",
] as const;

export const defaultSeoTitle = `${siteConfig.name} — ${siteConfig.fullName} | Офіційний сайт`;

export const defaultSeoDescription = siteCopy.meta.defaultDescription;

/** Google Search Console (HTML tag + file). Override via GOOGLE_SITE_VERIFICATION on Vercel. */
export const googleSiteVerification =
  process.env.GOOGLE_SITE_VERIFICATION || "DmPtAUJVRB0CisE_l4bZDQYqkq8Sna9ryAeU1aDAut4";

export function absoluteUrl(path = "/") {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** JSON-LD для Google: організація + сайт + контакти. */
export function buildSiteJsonLd() {
  const url = absoluteUrl("/");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: siteConfig.name,
        alternateName: [
          siteConfig.fullName,
          "14 орб",
          "14 окремий розвідувальний батальйон",
        ],
        description: defaultSeoDescription,
        inLanguage: "uk-UA",
        publisher: { "@id": `${url}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${url}/#organization`,
        name: siteConfig.fullName,
        alternateName: [siteConfig.name, "14 орб", "14ОРБ"],
        legalName: siteConfig.fullName,
        url,
        description: siteConfig.aboutOfficial,
        telephone: siteConfig.phone,
        sameAs: [siteConfig.facebookUrl],
        logo: absoluteUrl("/brand/favicon-96.png"),
        image: absoluteUrl("/images/sections/hero-home.jpg"),
        areaServed: {
          "@type": "Country",
          name: "Ukraine",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: siteConfig.phone,
            contactType: "recruiting",
            availableLanguage: ["Ukrainian", "uk"],
            hoursAvailable: {
              "@type": "OpeningHoursSpecification",
              description: siteConfig.workingHours,
            },
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${url}/#webpage`,
        url,
        name: defaultSeoTitle,
        isPartOf: { "@id": `${url}/#website` },
        about: { "@id": `${url}/#organization` },
        description: defaultSeoDescription,
        inLanguage: "uk-UA",
      },
    ],
  };
}
