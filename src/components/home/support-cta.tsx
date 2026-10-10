"use client";

import { useState } from "react";
import { siteCopy } from "@/content/site-copy";
import { siteConfig } from "@/lib/site-config";
import { siteImages } from "@/content/image-catalog";
import { Container } from "@/components/ui/container";
import { Section, Kicker, DisplayTitle, Lead } from "@/components/ui/section";
import { Reveal } from "@/components/shared/reveal";
import { LinkButton } from "@/components/ui/link-button";
import { SectionBackdrop } from "@/components/ui/themed-image";
import { maskCardNumber } from "@/lib/mask-card";

export function SupportCta() {
  const [copied, setCopied] = useState(false);
  const masked = maskCardNumber(siteConfig.cardNumber);

  async function copyCard() {
    try {
      await navigator.clipboard.writeText(siteConfig.cardNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <Section id="support" tone="ink" className="relative overflow-hidden">
      <SectionBackdrop src={siteImages.illustrative.backgroundMist.src} opacity={0.4} />

      <Container className="relative">
        <div className="editorial-grid items-end">
          <Reveal className="lg:col-span-7">
            <Kicker index="06" dark>
              Підтримка
            </Kicker>
            <DisplayTitle dark>{siteCopy.supportHome.title}</DisplayTitle>
            <Lead dark className="mt-5">
              {siteCopy.supportHome.body}
            </Lead>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-5">
            <div className="mt-8 md:mt-0">
              <button
                type="button"
                onClick={copyCard}
                className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a2332] via-[#243044] to-[#1a2332] p-6 text-left shadow-[0_20px_40px_-24px_rgba(0,0,0,0.8)] ring-1 ring-white/10 transition-transform hover:scale-[1.01] focus-ring md:p-7"
                aria-label={copied ? "Номер картки скопійовано" : "Скопіювати номер картки"}
              >
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -bottom-10 left-1/3 h-28 w-28 rounded-full bg-[var(--accent)]/10"
                  aria-hidden
                />
                <div className="relative flex items-start justify-between gap-4">
                  <p className="text-meta text-white/45">Картка · Monobank</p>
                  <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/55">
                    {copied ? "OK" : "Copy"}
                  </span>
                </div>
                <p className="relative mt-10 font-mono text-lg tracking-[0.18em] text-white/90 md:text-xl">
                  {masked}
                </p>
                <p className="relative mt-6 text-xs text-white/40">
                  Натисніть, щоб скопіювати повний номер
                </p>
              </button>

              <div className="mt-5 flex flex-col gap-3">
                <a
                  href={siteConfig.monobankUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent)] px-5 py-3.5 text-center text-sm font-semibold tracking-wide text-[var(--ink-inverse)] transition-colors hover:bg-[var(--accent-hover)] focus-ring"
                >
                  {siteCopy.supportHome.ctaMono}
                </a>
                <LinkButton href="/support" variant="outlineOnDark" className="w-full py-3.5">
                  {siteCopy.supportHome.ctaAll}
                </LinkButton>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
