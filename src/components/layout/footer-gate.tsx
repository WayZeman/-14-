"use client";

import { usePathname } from "next/navigation";

/** Hides the server-rendered footer on /admin without importing it into the client bundle. */
export function FooterGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
