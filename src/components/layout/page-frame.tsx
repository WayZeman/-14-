import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Kicker, DisplayTitle, Lead } from "@/components/ui/section";
import { ThemedImage } from "@/components/ui/themed-image";

export function PageFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("surface-paper min-h-[60vh] pt-[var(--header-h)] pb-16 md:pb-24", className)}>
      {children}
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
  return (
    <>
      {media ? (
        <div className="relative h-[min(42vh,280px)] min-h-[160px] w-full overflow-hidden">
          <ThemedImage src={media.src} alt={media.alt} sizes="100vw" grade="olive" priority={false} />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--paper)] via-[var(--paper)]/40 to-transparent" />
        </div>
      ) : null}
      <Container className="border-b border-[var(--line)] pb-10 pt-10 md:pb-14 md:pt-14">
        {kicker ? <Kicker>{kicker}</Kicker> : null}
        <DisplayTitle as="h1">{title}</DisplayTitle>
        {lead ? <Lead className="mt-5">{lead}</Lead> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </>
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
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Container narrow className={cn("py-10 md:py-12", className)}>
      {children}
    </Container>
  );
}
