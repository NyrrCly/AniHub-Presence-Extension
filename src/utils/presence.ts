import type { AnimeData, UserData, VideoState } from "@/types/types.js";
import { sendPresenceUpdate } from "./services/api.js";

export function clearPresence() {
  sendPresenceUpdate(null);
}

export function watchPresence(
  userData: UserData,
  animeData: AnimeData,
  currentEpisode: string,
  videoState?: VideoState,
) {
  const now = Date.now();
  let startTimestamp;
  let endTimestamp;
  if (videoState) {
    startTimestamp = Math.floor(now - videoState.currentTime * 1000);
    endTimestamp = Math.floor(startTimestamp + videoState.duration * 1000);
  }

  sendPresenceUpdate({
    details: animeData.title_ukrainian,
    state: `Епізоди: ${currentEpisode}/${animeData.episodes_count ?? "∞"}`,
    type: 3,
    largeImageKey: animeData.poster_url,
    largeImageText: animeData.title_ukrainian,
    smallImageKey: userData?.avatar || "logo",
    smallImageText: userData?.username || "Anonymous",
    startTimestamp: startTimestamp || 0,
    endTimestamp: endTimestamp || 0,
    buttons: [
      {
        label: "My Profile",
        url: `https://anihub.in.ua/profile/${userData.username}`,
      },
      {
        label: "Anime Link",
        url: `https://anihub.in.ua/anime/${animeData.slug}-${animeData.id}`,
      },
    ],
  });
}
