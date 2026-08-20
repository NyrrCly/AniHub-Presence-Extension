import type { PresenceData } from "@/types/types.js";

export async function fetchAnimeDetails(animeId: string): Promise<any> {
  try {
    const response = await fetch(`https://api.anihub.in.ua/anime/${animeId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    throw new Error(`Fetch error: ${error}`);
  }
}

export async function sendPresenceUpdate(presence: PresenceData | null) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  browser.runtime.sendMessage({
    type: "presence_update",
    payload: presence,
  });
}
