"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/lib/site-config";

declare global {
  interface Window {
    FB?: { XFBML: { parse: (node?: HTMLElement) => void } };
    fbAsyncInit?: () => void;
  }
}

/** Вбудована стрічка Facebook, якщо Graph API токен ще не налаштований на сервері */
export function FacebookPageEmbed() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parse = () => {
      if (rootRef.current && window.FB) {
        window.FB.XFBML.parse(rootRef.current);
      }
    };

    if (document.getElementById("facebook-jssdk")) {
      parse();
      return;
    }

    window.fbAsyncInit = () => parse();

    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.src = "https://connect.facebook.net/uk_UA/sdk.js#xfbml=1&version=v21.0";
    document.body.appendChild(script);
  }, []);

  return (
    <div ref={rootRef} className="overflow-hidden border border-[var(--line)] bg-white">
      <div
        className="fb-page"
        data-href={siteConfig.facebookUrl.split("?")[0]}
        data-tabs="timeline"
        data-width="500"
        data-height="600"
        data-small-header="true"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="false"
      />
    </div>
  );
}
