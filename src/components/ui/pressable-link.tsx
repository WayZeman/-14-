"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

/** Accessible link with CSS micro-interaction (no display:contents). */
export function PressableLink({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  const extra = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <Link
      href={href}
      className={cn(
        "transition-transform duration-200 ease-out hover:-translate-y-px active:scale-[0.985] focus-ring",
        className,
      )}
      {...extra}
    >
      {children}
    </Link>
  );
}
