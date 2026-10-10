import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
  narrow,
}: {
  className?: string;
  children: React.ReactNode;
  narrow?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--container-max)] px-5 md:px-8",
        narrow && "max-w-3xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** @deprecated Prefer Kicker from section.tsx */
export function SectionLabel({
  index,
  children,
}: {
  index?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-3 text-meta text-[var(--muted)]">
      {index ? <span className="font-mono text-[var(--olive)]">{index}</span> : null}
      <span>{children}</span>
    </div>
  );
}
