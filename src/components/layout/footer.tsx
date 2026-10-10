import Link from "next/link";
import { siteCopy } from "@/content/site-copy";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="surface-ink border-t border-[var(--line-on-dark)]">
      <Container className="py-10 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-lg text-white">{siteConfig.name}</p>
            <p className="mt-1 text-sm text-white/55">{siteConfig.fullName}</p>
            <p className="mt-2 max-w-sm text-sm text-white/50">{siteCopy.footer.blurb}</p>
          </div>
          <nav
            aria-label="Підвал"
            className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/60"
          >
            {siteConfig.nav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ))}
            <Link href="/privacy" className="hover:text-white">
              Конфіденційність
            </Link>
          </nav>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex items-center justify-between py-4 text-[11px] text-white/35">
          <span>© {new Date().getFullYear()} {siteConfig.name}</span>
          <a href={`tel:${siteConfig.phone}`} className="hover:text-white/55">
            {siteCopy.finalCta.ctaPhone}
          </a>
        </Container>
      </div>
    </footer>
  );
}
