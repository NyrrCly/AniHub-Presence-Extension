import type { AnimePageData, UserData } from "@/types/types.js";

export async function extractPageData(): Promise<AnimePageData> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const animeId = window.location.pathname.match(/\w+$/)?.[0];
  const episodeEl = document.querySelector(
    "span.text-xs.lg\\:text-sm.font-medium",
  );
  const episode = episodeEl?.textContent?.trim().match(/\d+/)?.[0] ?? "-1";

  return { animeId, episode };
}

export function extractUserData(): UserData {
  const userCacheRaw = localStorage.getItem("user_cache");
  if (userCacheRaw) {
    return JSON.parse(userCacheRaw) as UserData;
  }
  throw new Error("User data not found in cache");
}
