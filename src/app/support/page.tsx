"use client";

import { useEffect, useState } from "react";
import { siteCopy } from "@/content/site-copy";
import { siteConfig } from "@/lib/site-config";
import { maskCardNumber } from "@/lib/mask-card";
import { PageFrame, PageHeader, ContentPanel } from "@/components/layout/page-frame";

type Campaign = {
  id: string;
  title: string;
  description: string | null;
  monobankUrl: string | null;
  cardNumber: string | null;
  status: string;
  goalAmount: number | null;
  raisedAmount: number | null;
};

export default function SupportPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/campaigns")
      .then((r) => r.json())
      .then((d) => setCampaigns(d.campaigns || []))
      .catch(() => setCampaigns([]));
  }, []);

  async function copyCard(number: string) {
    try {
      await navigator.clipboard.writeText(number.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  const fallbackCard = siteConfig.cardNumber;
  const fallbackMono = siteConfig.monobankUrl;

  const list =
    campaigns.length > 0
      ? campaigns
      : [
          {
            id: "fallback",
            title: siteCopy.supportPage.fallbackTitle,
            description: siteCopy.supportPage.fallbackDescription,
            monobankUrl: fallbackMono,
            cardNumber: fallbackCard,
            status: "active",
            goalAmount: null,
            raisedAmount: null,
          },
        ];

  return (
    <PageFrame>
      <PageHeader
        kicker="Підтримка"
        title={siteCopy.supportPage.title}
        lead={siteCopy.supportPage.intro}
      />
      <ContentPanel className="!max-w-none">
        <div className="mx-auto grid max-w-[var(--container-max)] gap-6 px-5 md:grid-cols-2 md:px-8">
          {list.map((c) => (
            <article
              key={c.id}
              className="flex flex-col border border-[var(--line)] bg-white p-6 md:p-8"
            >
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-editorial text-2xl text-[var(--graphite)]">{c.title}</h2>
                <span className="text-meta rounded-sm bg-[var(--olive)]/10 px-2 py-1 text-[var(--olive-deep)]">
                  {c.status === "completed" ? "Завершено" : "Активний"}
                </span>
              </div>
              {c.description ? (
                <p className="mt-4 text-sm leading-relaxed text-[var(--ink-soft)]">{c.description}</p>
              ) : null}

              {c.goalAmount != null && c.raisedAmount != null ? (
                <p className="mt-6 font-mono text-sm text-[var(--muted)]">
                  Зібрано {c.raisedAmount.toLocaleString("uk-UA")} /{" "}
                  {c.goalAmount.toLocaleString("uk-UA")} грн
                </p>
              ) : (
                <p className="mt-6 text-xs text-[var(--muted)]">{siteCopy.supportPage.noProgress}</p>
              )}

              <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
                {c.monobankUrl ? (
                  <a
                    href={c.monobankUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 flex-1 items-center justify-center bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--ink-inverse)]"
                  >
                    {siteCopy.supportPage.ctaSupport}
                  </a>
                ) : null}
                {c.cardNumber ? (
                  <button
                    type="button"
                    onClick={() => copyCard(c.cardNumber!)}
                    className="flex flex-1 flex-col items-start justify-center rounded-xl bg-[var(--graphite)] px-4 py-3 text-left"
                  >
                    <span className="text-[10px] uppercase tracking-wider text-white/40">
                      {copied ? "Скопійовано" : "Картка"}
                    </span>
                    <span className="mt-1 font-mono text-sm tracking-wider text-white/90">
                      {maskCardNumber(c.cardNumber)}
                    </span>
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </ContentPanel>
    </PageFrame>
  );
}
