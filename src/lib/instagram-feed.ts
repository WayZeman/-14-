import { unstable_cache } from "next/cache";
import { siteConfig } from "@/lib/site-config";

const GRAPH_VERSION = "v21.0";

export type InstagramGraphMedia = {
  id: string;
  caption?: string;
  timestamp: string;
  permalink: string;
  media_type?: string;
  thumbnail_url?: string;
  media_url?: string;
};

function pageIdFromEnv(): string {
  return process.env.FACEBOOK_PAGE_ID?.trim() || siteConfig.facebookPageUsername;
}

function accessToken(): string | null {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim();
  return token || null;
}

function firstLine(text: string, max = 140): string {
  const line = text.split(/\n+/).find((l) => l.trim())?.trim() ?? text.trim();
  if (line.length <= max) return line;
  return `${line.slice(0, max - 1).trim()}…`;
}

export function instagramCaptionToTitle(caption: string | undefined): string {
  if (!caption?.trim()) return "Публікація в Instagram";
  return firstLine(caption, 160);
}

export function instagramCaptionToExcerpt(caption: string | undefined, title: string): string | null {
  if (!caption?.trim()) return null;
  const rest = caption.replace(title, "").trim();
  if (rest.length < 24) return null;
  return rest.length > 280 ? `${rest.slice(0, 277).trim()}…` : rest;
}

async function resolveInstagramBusinessId(pageId: string, token: string): Promise<string | null> {
  const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${pageId}`);
  url.searchParams.set("fields", "instagram_business_account");
  url.searchParams.set("access_token", token);

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
  if (!res.ok) return null;

  const json = (await res.json()) as {
    instagram_business_account?: { id?: string };
  };
  return json.instagram_business_account?.id ?? null;
}

async function fetchInstagramMediaUncached(limit: number): Promise<InstagramGraphMedia[]> {
  const token = accessToken();
  if (!token) return [];

  const pageId = pageIdFromEnv();
  const igUserId = await resolveInstagramBusinessId(pageId, token);
  if (!igUserId) return [];

  const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${igUserId}/media`);
  url.searchParams.set(
    "fields",
    "id,caption,timestamp,permalink,media_type,thumbnail_url,media_url",
  );
  url.searchParams.set("limit", String(Math.min(limit, 25)));
  url.searchParams.set("access_token", token);

  const res = await fetch(url.toString(), { next: { revalidate: 900 } });
  if (!res.ok) {
    console.error("[instagram-feed] Graph API error", res.status, await res.text().catch(() => ""));
    return [];
  }

  const json = (await res.json()) as { data?: InstagramGraphMedia[] };
  return (json.data ?? []).filter((m) => m.permalink);
}

export async function getInstagramPosts(limit = 12): Promise<InstagramGraphMedia[]> {
  const token = accessToken();
  if (!token) return [];

  const cached = unstable_cache(
    () => fetchInstagramMediaUncached(limit),
    ["instagram-posts", pageIdFromEnv(), String(limit)],
    { revalidate: 900, tags: ["instagram-posts"] },
  );

  return cached();
}
