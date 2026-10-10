"use client";

import { useEffect } from "react";

/**
 * Refresh should land at the top of the page, not at a previous hash/scroll
 * position (e.g. /#about → «01 Хто ми»).
 */
export function ScrollReset() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;

    if (nav?.type !== "reload") return;

    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
  }, []);

  return null;
}
