import { cn } from "@/lib/utils";

export function Section({
  id,
  tone = "paper",
  className,
  children,
}: {
  id?: string;
  tone?: "paper" | "ink" | "olive";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "section-pad",
        tone === "paper" && "surface-paper",
        tone === "ink" && "surface-ink",
        tone === "olive" && "bg-[var(--olive-deep)] text-white",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Kicker({
  index,
  children,
  dark,
  className,
}: {
  index?: string;
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-5 flex items-center gap-3 text-meta",
        dark ? "text-white/50" : "text-[var(--muted)]",
        className,
      )}
    >
      {index ? (
        <span className={cn("font-mono", dark ? "text-[var(--accent)]" : "text-[var(--olive)]")}>
          {index}
        </span>
      ) : null}
      <span>{children}</span>
    </div>
  );
}

export function DisplayTitle({
  className,
  children,
  as: Tag = "h2",
  dark,
}: {
  className?: string;
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  dark?: boolean;
}) {
  return (
    <Tag
      className={cn(
        "font-editorial text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.05] tracking-[-0.02em]",
        dark ? "text-white" : "text-[var(--graphite)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Lead({ className, children, dark }: { className?: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={cn(
        "text-lead max-w-2xl",
        dark ? "text-white/70" : undefined,
        className,
      )}
    >
      {children}
    </p>
  );
}
