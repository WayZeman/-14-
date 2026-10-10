import type { Metadata } from "next";
import { JetBrains_Mono, Lora, Manrope } from "next/font/google";
import { SiteChrome } from "@/components/layout/site-chrome";
import { siteCopy } from "@/content/site-copy";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.fullName} — ${siteConfig.slogan}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteCopy.meta.defaultDescription,
  keywords: [
    "14 ОРБ",
    "14 окремий розвідувальний батальйон",
    "військова розвідка",
    "БПЛА",
    "рекрутинг ЗСУ",
  ],
  alternates: {
    canonical: "/",
    languages: { uk: "/", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.slogan}`,
    description: siteCopy.meta.defaultDescription,
    images: [{ url: "/images/sections/hero-home.jpg", width: 1600, height: 900 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.slogan}`,
    description: siteCopy.meta.defaultDescription,
    images: ["/images/sections/hero-home.jpg"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/favicon-96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/brand/favicon-96.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uk"
      className={`${manrope.variable} ${jetbrains.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[var(--graphite)] text-white">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-black"
        >
          Пропустити до контенту
        </a>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
