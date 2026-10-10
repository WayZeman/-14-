"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { LinkButton } from "@/components/ui/link-button";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  const paperNav = !isHome || scrolled || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter,color] duration-300",
        paperNav
          ? isHome
            ? "border-b border-[var(--line-on-dark)] bg-[var(--graphite)]/92 text-white backdrop-blur-xl"
            : "border-b border-[var(--line)] bg-[var(--paper)]/95 text-[var(--ink)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent text-white",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[var(--container-max)] items-center justify-between px-5 md:h-[var(--header-h)] md:px-8">
        <Link
          href="/"
          className="font-display text-lg tracking-wide focus-ring"
          onClick={() => setOpen(false)}
        >
          {siteConfig.name}
        </Link>

        <nav
          className="hidden max-w-[min(46rem,52vw)] flex-wrap items-center justify-end gap-x-4 gap-y-1 lg:flex xl:gap-x-5"
          aria-label="Основна навігація"
        >
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "nav-link focus-ring text-[13px] transition-colors xl:text-sm",
                paperNav && !isHome
                  ? "text-[var(--ink-soft)] hover:text-[var(--graphite)]"
                  : "text-white/75 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LinkButton href="/join" variant="primary" size="sm" className="hidden sm:inline-flex">
            Приєднатися
          </LinkButton>
          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border transition-colors focus-ring lg:hidden",
              paperNav && !isHome
                ? "border-[var(--line)] hover:bg-[var(--milk)]"
                : "border-white/15 hover:bg-white/5",
            )}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
            <span className="sr-only">Меню</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduce ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "max-h-[min(70vh,calc(100dvh-var(--header-h)))] overflow-y-auto border-t lg:hidden",
              paperNav && !isHome
                ? "border-[var(--line)] bg-[var(--paper)]"
                : "border-[var(--line-on-dark)] bg-[var(--graphite)]/98 backdrop-blur-xl",
            )}
          >
            <nav
              className="mx-auto flex max-w-[var(--container-max)] flex-col px-5 py-4"
              aria-label="Мобільна навігація"
            >
              {siteConfig.nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block border-b py-3.5 text-base last:border-0",
                      paperNav && !isHome
                        ? "border-[var(--line)] text-[var(--graphite)]"
                        : "border-white/10 text-white/90",
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <LinkButton
                href="/join"
                onClick={() => setOpen(false)}
                className="mt-4 w-full"
              >
                Приєднатися
              </LinkButton>
              <Link
                href="/support"
                onClick={() => setOpen(false)}
                className={cn(
                  "mt-2 py-3 text-center text-sm font-semibold",
                  paperNav && !isHome ? "text-[var(--olive)]" : "text-[var(--accent)]",
                )}
              >
                Збори та реквізити
              </Link>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
