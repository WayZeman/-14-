import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Kicker, DisplayTitle, Lead } from "@/components/ui/section";
import { ThemedImage } from "@/components/ui/themed-image";
import { buttonVariants } from "@/components/ui/button";

/** Ліва колонка як у PageHeader — контент не «з’їжджає» вправо на широких екранах */
export const pageEditorialColumnClass = "max-w-3xl w-full";

export function PageFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("surface-paper min-h-[60vh] pt-[var(--header-h)] pb-14 md:pb-20", className)}>
      {children}
    </div>
  );
}

function PageHeaderIntro({
  kicker,
  title,
  lead,
  children,
  onHero,
}: {
  kicker?: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
  onHero?: boolean;
}) {
  return (
    <div className={pageEditorialColumnClass}>
      {kicker ? (
        <Kicker dark={onHero} className={onHero ? "mb-3 text-white/55" : "mb-3 md:mb-4"}>
          {kicker}
        </Kicker>
      ) : null}
      <DisplayTitle as="h1">{title}</DisplayTitle>
      {lead ? <Lead className="mt-4 md:mt-5">{lead}</Lead> : null}
      {children ? <div className="mt-6 md:mt-8">{children}</div> : null}
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  lead,
  children,
  media,
}: {
  kicker?: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
  media?: { src: string; alt: string };
}) {
  if (media) {
    return (
      <div className="border-b border-[var(--line)]">
        <div className="relative min-h-[11rem] w-full overflow-hidden sm:min-h-[13rem] md:max-h-[min(34vh,240px)] md:min-h-[14rem]">
          <ThemedImage src={media.src} alt={media.alt} sizes="100vw" grade="olive" priority={false} />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[var(--paper)] via-[var(--paper)]/55 to-black/25"
            aria-hidden
          />
          <Container className="relative z-10 flex min-h-[11rem] flex-col justify-end pb-7 pt-2 sm:min-h-[13rem] md:min-h-[14rem] md:pb-9">
            <PageHeaderIntro kicker={kicker} title={title} lead={lead} onHero>
              {children}
            </PageHeaderIntro>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <Container className="border-b border-[var(--line)] pb-7 pt-4 md:pb-9 md:pt-5">
      <PageHeaderIntro kicker={kicker} title={title} lead={lead}>
        {children}
      </PageHeaderIntro>
    </Container>
  );
}

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-meta inline-flex items-center gap-2 text-[var(--olive)] transition-colors hover:text-[var(--graphite)]"
    >
      <span aria-hidden>←</span>
      {children}
    </Link>
  );
}

export function ContentPanel({
  children,
  className,
  width = "default",
}: {
  children: React.ReactNode;
  className?: string;
  /** `narrow` — довгі тексти в тій самій колонці, що й заголовок */
  width?: "default" | "narrow";
}) {
  return (
    <Container className={cn("py-8 md:py-10", className)}>
      <div className={cn(width === "narrow" && pageEditorialColumnClass)}>{children}</div>
    </Container>
  );
}

export function PageCard({
  children,
  className,
  tone = "white",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "white" | "soft";
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col border border-[var(--line)] p-6 md:p-8",
        tone === "white" && "bg-white",
        tone === "soft" && "bg-[var(--milk-soft)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageGrid({
  children,
  className,
  columns = 2,
}: {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2;
}) {
  return (
    <div
      className={cn(
        "grid gap-6",
        columns === 2 && "md:grid-cols-2 md:items-stretch",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Одна картка по центру (напр. один збір) */
export function PageCentered({
  children,
  className,
  maxWidth = "lg",
}: {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "md" | "lg" | "xl";
}) {
  const maxClass =
    maxWidth === "md" ? "max-w-md" : maxWidth === "xl" ? "max-w-xl" : "max-w-lg";
  return <div className={cn("mx-auto w-full", maxClass, className)}>{children}</div>;
}

export function PageSplit({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-12", className)}>
      {children}
    </div>
  );
}

export function PageSplitAside({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <aside className={cn("space-y-6 lg:col-span-5 lg:space-y-8", className)}>{children}</aside>;
}

export function PageSplitMain({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("lg:col-span-7", className)}>{children}</div>;
}

export function PageList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ul className={cn("divide-y divide-[var(--line)] border-y border-[var(--line)]", className)}>
      {children}
    </ul>
  );
}

export function pageListLinkClassName(className?: string) {
  return cn("group block py-6 transition-colors md:py-8", className);
}

export function PagePhoneLink({
  phone,
  children,
  className,
}: {
  phone: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={`tel:${phone}`}
      className={cn(buttonVariants({ variant: "dark", size: "default" }), "w-full sm:w-auto", className)}
    >
      {children}
    </a>
  );
}

export function PageActionLink({
  href,
  children,
  className,
  variant = "outline",
  ...props
}: React.ComponentProps<"a"> & {
  variant?: "primary" | "dark" | "outline";
}) {
  return (
    <a
      href={href}
      className={cn(buttonVariants({ variant, size: "default" }), "w-full sm:w-auto", className)}
      {...props}
    >
      {children}
    </a>
  );
}
