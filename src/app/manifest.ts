import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { siteCopy } from "@/content/site-copy";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.fullName}`,
    short_name: siteConfig.name,
    description: siteCopy.meta.defaultDescription,
    start_url: "/",
    display: "standalone",
    lang: "uk",
    background_color: "#0b0d0c",
    theme_color: "#0b0d0c",
    icons: [
      {
        src: "/brand/favicon-96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/brand/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
