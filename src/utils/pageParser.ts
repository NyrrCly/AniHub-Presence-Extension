import type { UserData } from "@/types/types.js";

export async function extractEpisodeData(): Promise<string> {
  let episode = "-1";
  while (episode === "-1") {
    const episodeEl = document.querySelector(
      "span.text-xs.lg\\:text-sm.font-medium",
    );
    episode = episodeEl?.textContent?.trim().match(/\d+/)?.[0] || "-1";
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return episode;
}

export function extractUserData(): UserData {
  const userCacheRaw = localStorage.getItem("user_cache");
  if (userCacheRaw) {
    return JSON.parse(userCacheRaw) as UserData;
  }
  throw new Error("User data not found in cache");
}
