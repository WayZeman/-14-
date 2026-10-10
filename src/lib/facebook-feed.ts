import { unstable_cache } from "next/cache";
import { siteConfig } from "@/lib/site-config";

const GRAPH_VERSION = "v21.0";

export type FacebookGraphPost = {
  id: string;
  message?: string;
  created_time: string;
  permalink_url: string;
  full_picture?: string;
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

export function facebookPostToTitle(message: string | undefined): string {
  if (!message?.trim()) return "Публікація у Facebook";
  return firstLine(message, 160);
}

export function facebookPostToExcerpt(message: string | undefined, title: string): string | null {
  if (!message?.trim()) return null;
  const rest = message.replace(title, "").trim();
  if (rest.length < 24) return null;
  return rest.length > 280 ? `${rest.slice(0, 277).trim()}…` : rest;
}

async function fetchFacebookPostsUncached(limit: number): Promise<FacebookGraphPost[]> {
  const token = accessToken();
  if (!token) return [];

  const pageId = pageIdFromEnv();
  const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${pageId}/posts`);
  url.searchParams.set(
    "fields",
    "id,message,created_time,permalink_url,full_picture",
  );
  url.searchParams.set("limit", String(Math.min(limit, 25)));
  url.searchParams.set("access_token", token);

  const res = await fetch(url.toString(), {
    next: { revalidate: 900 },
  });

  if (!res.ok) {
    console.error("[facebook-feed] Graph API error", res.status, await res.text().catch(() => ""));
    return [];
  }

  const json = (await res.json()) as { data?: FacebookGraphPost[] };
  return (json.data ?? []).filter((p) => p.permalink_url);
}

export async function getFacebookPosts(limit = 12): Promise<FacebookGraphPost[]> {
  const token = accessToken();
  if (!token) return [];

  const cached = unstable_cache(
    () => fetchFacebookPostsUncached(limit),
    ["facebook-posts", pageIdFromEnv(), String(limit)],
    { revalidate: 900, tags: ["facebook-posts"] },
  );

  return cached();
}

export function isFacebookFeedConfigured(): boolean {
  return Boolean(accessToken());
}
