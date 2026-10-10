import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { PageActionLink } from "@/components/layout/page-frame";

export function SocialLinks({
  className,
  stacked = false,
}: {
  className?: string;
  /** Повна ширина кнопок (контакти / join) */
  stacked?: boolean;
}) {
  return (
    <div className={cn(stacked ? "flex flex-col gap-3" : "flex flex-wrap gap-3", className)}>
      {siteConfig.social.map((item) => (
        <PageActionLink
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          className={stacked ? "w-full" : undefined}
        >
          {item.label}
        </PageActionLink>
      ))}
    </div>
  );
}
