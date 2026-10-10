"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    FB?: { XFBML: { parse: (node?: HTMLElement) => void } };
    fbAsyncInit?: () => void;
  }
}

type Props = {
  /** Висота стрічки в px */
  height?: number;
  className?: string;
  /** Компактний варіант для головної */
  compact?: boolean;
};

/** Жива стрічка Facebook (прев’ю). Клік по допису відкриває Facebook. */
export function FacebookPageEmbed({ height = 720, className, compact = false }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const pageUrl = siteConfig.facebookUrl.split("?")[0];

  useEffect(() => {
    let cancelled = false;

    const parse = () => {
      if (cancelled || !rootRef.current || !window.FB) return;
      window.FB.XFBML.parse(rootRef.current);
      setReady(true);
    };

    if (document.getElementById("facebook-jssdk")) {
      if (window.FB) parse();
      else window.fbAsyncInit = parse;
      return () => {
        cancelled = true;
      };
    }

    window.fbAsyncInit = parse;

    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.src = "https://connect.facebook.net/uk_UA/sdk.js#xfbml=1&version=v21.0";
    document.body.appendChild(script);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={cn("overflow-hidden border border-[var(--line)] bg-white", className)}>
      {!ready ? (
        <div
          className="flex items-center justify-center bg-[var(--milk-soft)] text-sm text-[var(--muted)]"
          style={{ minHeight: compact ? 360 : Math.min(height, 480) }}
        >
          Завантаження стрічки Facebook…
        </div>
      ) : null}
      <div ref={rootRef} className={cn(!ready && "sr-only")}>
        <div
          className="fb-page"
          data-href={pageUrl}
          data-tabs="timeline"
          data-width={compact ? "340" : "500"}
          data-height={String(compact ? 420 : height)}
          data-small-header="true"
          data-adapt-container-width="true"
          data-hide-cover={compact ? "true" : "false"}
          data-show-facepile="false"
        />
      </div>
    </div>
  );
}
