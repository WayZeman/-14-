import { siteCopy } from "@/content/site-copy";
import { SocialLinks } from "@/components/layout/social-links";
import { cn } from "@/lib/utils";

export function NewsSocialCta({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border border-[var(--line)] bg-white px-5 py-8 md:px-8 md:py-10",
        className,
      )}
    >
      <p className="max-w-2xl text-base leading-relaxed text-[var(--ink-soft)] md:text-lg">
        {siteCopy.newsPage.socialMessage}
      </p>
      <SocialLinks className="mt-6" stacked />
    </div>
  );
}
