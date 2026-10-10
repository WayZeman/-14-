import type { Metadata } from "next";
import { JetBrains_Mono, Lora, Manrope } from "next/font/google";
import { SiteChrome } from "@/components/layout/site-chrome";
import { SiteJsonLd } from "@/components/seo/json-ld";
import { siteCopy } from "@/content/site-copy";
import { siteConfig } from "@/lib/site-config";
import { defaultSeoTitle, googleSiteVerification, seoKeywords } from "@/lib/seo";
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
    default: defaultSeoTitle,
    template: `%s — ${siteConfig.name} | ${siteConfig.fullName}`,
  },
  description: siteCopy.meta.defaultDescription,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.fullName, url: siteConfig.url }],
  creator: siteConfig.fullName,
  publisher: siteConfig.fullName,
  category: "military",
  keywords: [...seoKeywords],
  alternates: {
    canonical: "/",
    languages: { uk: "/", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: siteConfig.url,
    siteName: `${siteConfig.name} — ${siteConfig.fullName}`,
    title: defaultSeoTitle,
    description: siteCopy.meta.defaultDescription,
    images: [
      {
        url: "/images/sections/hero-home.jpg",
        width: 1600,
        height: 900,
        alt: `${siteConfig.name} — ${siteConfig.fullName}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSeoTitle,
    description: siteCopy.meta.defaultDescription,
    images: ["/images/sections/hero-home.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: googleSiteVerification,
  },
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
        <SiteJsonLd />
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
