import { isFacebookFeedConfigured } from "@/lib/facebook-feed";
import { isInstagramGraphConfigured } from "@/lib/instagram-feed";

export function isAnySocialGraphConfigured(): boolean {
  return isFacebookFeedConfigured() || isInstagramGraphConfigured();
}
