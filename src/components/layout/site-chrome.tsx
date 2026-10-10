"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { ScrollReset } from "@/components/layout/scroll-reset";

export function SiteChrome({
  children,
  footer,
}: {
  children: React.ReactNode;
  /** Server-rendered footer slot (must not be imported into this client file). */
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollReset />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      {footer}
    </>
  );
}
