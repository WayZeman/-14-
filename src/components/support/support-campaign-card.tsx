"use client";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { maskCardNumber } from "@/lib/mask-card";
import { siteCopy } from "@/content/site-copy";

type Props = {
  title: string;
  description: string | null;
  monobankUrl: string | null;
  cardNumber: string | null;
  status: string;
  goalAmount: number | null;
  raisedAmount: number | null;
  copied: boolean;
  onCopyCard: (number: string) => void;
};

export function SupportCampaignCard({
  title,
  description,
  monobankUrl,
  cardNumber,
  status,
  goalAmount,
  raisedAmount,
  copied,
  onCopyCard,
}: Props) {
  return (
    <article className="flex flex-col border border-[var(--line)] bg-white p-6 md:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-editorial text-2xl text-[var(--graphite)] md:text-[1.65rem]">{title}</h2>
        <span className="text-meta rounded-sm bg-[var(--olive)]/10 px-2 py-1 text-[var(--olive-deep)]">
          {status === "completed" ? "Завершено" : "Активний"}
        </span>
      </div>
      {description ? (
        <p className="mt-4 text-sm leading-relaxed text-[var(--ink-soft)] md:text-base">{description}</p>
      ) : null}

      {goalAmount != null && raisedAmount != null ? (
        <p className="mt-6 font-mono text-sm text-[var(--muted)]">
          Зібрано {raisedAmount.toLocaleString("uk-UA")} / {goalAmount.toLocaleString("uk-UA")} грн
        </p>
      ) : (
        <p className="mt-6 text-xs text-[var(--muted)] md:text-sm">{siteCopy.supportPage.noProgress}</p>
      )}

      <div className="mt-auto flex flex-col gap-3 pt-8">
        {monobankUrl ? (
          <a
            href={monobankUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "primary", size: "default" }), "w-full")}
          >
            {siteCopy.supportPage.ctaSupport}
          </a>
        ) : null}
        {cardNumber ? (
          <button
            type="button"
            onClick={() => onCopyCard(cardNumber)}
            className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a2332] via-[#243044] to-[#1a2332] p-5 text-left shadow-[0_16px_32px_-20px_rgba(0,0,0,0.65)] ring-1 ring-white/10 transition-transform hover:scale-[1.01] focus-ring md:p-6"
            aria-label={copied ? "Номер картки скопійовано" : "Скопіювати номер картки"}
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-meta text-white/45">Картка · Monobank</p>
              <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/55">
                {copied ? "OK" : "Copy"}
              </span>
            </div>
            <p className="mt-8 font-mono text-base tracking-[0.14em] text-white/90 md:text-lg">
              {maskCardNumber(cardNumber)}
            </p>
            <p className="mt-4 text-xs text-white/40">Натисніть, щоб скопіювати повний номер</p>
          </button>
        ) : null}
      </div>
    </article>
  );
}
