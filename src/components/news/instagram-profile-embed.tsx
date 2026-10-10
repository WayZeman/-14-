import { siteConfig } from "@/lib/site-config";

/** Вбудована стрічка профілю (без Graph API token на сервері) */
export function InstagramProfileEmbed() {
  const handle = siteConfig.instagramHandle;
  const src = `https://www.instagram.com/${handle}/embed`;

  return (
    <div className="overflow-hidden border border-[var(--line)] bg-white">
      <iframe
        title={`Instagram @${handle}`}
        src={src}
        className="min-h-[28rem] w-full border-0 sm:min-h-[32rem]"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}
