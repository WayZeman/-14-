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

export function SupportCta({
  monobankUrl = siteConfig.monobankUrl,
  cardNumber = siteConfig.cardNumber,
}: {
  monobankUrl?: string;
  cardNumber?: string;
} = {}) {
  const [copied, setCopied] = useState(false);
  const masked = maskCardNumber(cardNumber);

  async function copyCard() {
    try {
      await navigator.clipboard.writeText(cardNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <Section
      id="support"
      tone="ink"
      className="relative overflow-hidden !py-12 md:!py-16 lg:!py-[4.5rem]"
    >
      <SectionBackdrop src={siteImages.illustrative.backgroundMist.src} opacity={0.32} />

      <Container className="relative">
        <div className="grid overflow-hidden border border-white/10 bg-[var(--graphite-soft)]/90 lg:grid-cols-12 lg:items-stretch">
          <Reveal className="flex flex-col justify-center border-b border-white/10 px-5 py-8 sm:px-8 md:py-10 lg:col-span-5 lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
            <Kicker index="06" dark className="mb-3">
              Підтримка
            </Kicker>
            <DisplayTitle dark className="text-[clamp(1.85rem,3.8vw,3rem)]">
              {siteCopy.supportHome.title}
            </DisplayTitle>
            <Lead dark className="mt-4 max-w-md text-base md:mt-5 md:text-[1.05rem]">
              {siteCopy.supportHome.body}
            </Lead>
          </Reveal>

          <Reveal delay={0.06} className="px-5 py-8 sm:px-8 lg:col-span-7 lg:flex lg:flex-col lg:justify-center lg:px-10 lg:py-10">
            <div className="mx-auto w-full max-w-md lg:max-w-none">
              <button
                type="button"
                onClick={copyCard}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#1a2332] via-[#243044] to-[#1a2332] p-5 text-left shadow-[0_16px_36px_-22px_rgba(0,0,0,0.85)] ring-1 ring-white/10 transition-transform hover:scale-[1.008] focus-ring sm:p-6"
                aria-label={copied ? "Номер картки скопійовано" : "Скопіювати номер картки"}
              >
                <div
                  className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/5"
                  aria-hidden
                />
                <div className="relative flex items-center justify-between gap-3">
                  <p className="text-meta text-white/45">Картка · Monobank</p>
                  <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/55">
                    {copied ? "OK" : "Copy"}
                  </span>
                </div>
                <p className="relative mt-6 font-mono text-base tracking-[0.16em] text-white/92 sm:text-lg">
                  {masked}
                </p>
                <p className="relative mt-3 text-[11px] leading-snug text-white/40 sm:text-xs">
                  Натисніть, щоб скопіювати повний номер
                </p>
              </button>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <a
                  href={monobankUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 flex-1 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-3 text-center text-sm font-semibold tracking-wide text-[var(--ink-inverse)] transition-colors hover:bg-[var(--accent-hover)] focus-ring"
                >
                  {siteCopy.supportHome.ctaMono}
                </a>
                <LinkButton
                  href="/support"
                  variant="outlineOnDark"
                  className="min-h-12 w-full flex-1 py-3"
                >
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
