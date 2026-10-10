"use client";

import { useEffect, useMemo, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type Props = {
  height?: number;
  className?: string;
  compact?: boolean;
};

function buildPluginSrc(pageUrl: string, width: number, height: number, hideCover: boolean) {
  const params = new URLSearchParams({
    href: pageUrl,
    tabs: "timeline",
    width: String(width),
    height: String(height),
    small_header: "true",
    adapt_container_width: "true",
    hide_cover: hideCover ? "true" : "false",
    show_facepile: "false",
  });
  return `https://www.facebook.com/plugins/page.php?${params.toString()}`;
}

/**
 * Прев’ю стрічки через офіційний iframe Page Plugin.
 * (XFBML SDK часто лишає порожній блок через cookies / блокувальники.)
 */
export function FacebookPageEmbed({ height = 720, className, compact = false }: Props) {
  const pageUrl = siteConfig.facebookUrl.split("?")[0] || "https://www.facebook.com/14osb";
  const width = compact ? 340 : 500;
  const frameHeight = compact ? 480 : height;
  const [mode, setMode] = useState<"iframe" | "fallback">("iframe");
  const [hint, setHint] = useState(false);

  const src = useMemo(
    () => buildPluginSrc(pageUrl, width, frameHeight, Boolean(compact)),
    [pageUrl, width, frameHeight, compact],
  );

  useEffect(() => {
    const t = window.setTimeout(() => setHint(true), 4500);
    return () => window.clearTimeout(t);
  }, []);

  if (mode === "fallback") {
    return (
      <a
        href={pageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group block border border-[var(--line)] bg-white p-6 transition-colors hover:border-[var(--olive)] md:p-8",
          className,
        )}
      >
        <p className="text-meta text-[var(--olive)]">Facebook · 14osb</p>
        <h3 className="mt-3 font-editorial text-2xl text-[var(--graphite)] group-hover:text-[var(--olive-ink)]">
          Стрічка батальйону
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
          Вбудований попередній перегляд у цьому браузері недоступний. Натисніть, щоб відкрити
          актуальні дописи на офіційній сторінці Facebook.
        </p>
        <p className="text-meta mt-6 text-[var(--olive)]">Відкрити стрічку →</p>
      </a>
    );
  }

  return (
    <div
      className={cn(
        "relative mx-auto w-full overflow-hidden border border-[var(--line)] bg-[var(--milk-soft)]",
        className,
      )}
      style={{ maxWidth: width, minHeight: frameHeight }}
    >
      <iframe
        title="Стрічка Facebook 14 ОРБ"
        src={src}
        width={width}
        height={frameHeight}
        className="block w-full border-0 bg-white"
        style={{ minHeight: frameHeight, height: frameHeight }}
        allow="encrypted-media; clipboard-write"
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
      />

      {hint ? (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent p-4 pt-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--muted)]">
              Порожньо? Вимкніть блокувальник або відкрийте Facebook.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setMode("fallback")}
                className="text-meta text-[var(--olive)] underline-offset-2 hover:underline"
              >
                Картка-посилання
              </button>
              <a
                href={pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-meta font-semibold text-[var(--graphite)] underline-offset-2 hover:underline"
              >
                Facebook →
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
