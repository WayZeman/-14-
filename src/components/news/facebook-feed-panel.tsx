import { siteConfig } from "@/lib/site-config";
import { siteCopy } from "@/content/site-copy";
import { FacebookPageEmbed } from "@/components/news/facebook-page-embed";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  compact?: boolean;
  className?: string;
  showHint?: boolean;
};

/** Прев’ю стрічки Facebook + кнопка відкрити сторінку */
export function FacebookFeedPanel({ compact = false, className, showHint = true }: Props) {
  const pageUrl = siteConfig.facebookUrl.split("?")[0];

  return (
    <div className={cn("w-full", className)}>
      {showHint ? (
        <p className="mb-4 text-sm text-[var(--ink-soft)] md:text-base">
          {siteCopy.newsPage.facebookFeedLead}
        </p>
      ) : null}

      <div className={cn("mx-auto", compact ? "max-w-sm" : "max-w-xl")}>
        <FacebookPageEmbed compact={compact} height={compact ? 420 : 780} />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href={pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "dark", size: "default" }), "w-full sm:w-auto")}
        >
          {siteCopy.newsPage.ctaOpenFacebook}
        </a>
        <a
          href={siteConfig.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "default" }), "w-full sm:w-auto")}
        >
          {siteCopy.newsPage.ctaOpenInstagram}
        </a>
      </div>
    </div>
  );
}
