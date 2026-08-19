import type { AnimeInfo, UserData, VideoState } from "@/types/types.js";
import { sendPresenceUpdate } from "./api.js";

export function clearPresence() {
  sendPresenceUpdate(null);
}

export function mainPresence(userData: UserData) {
  sendPresenceUpdate({
    details: "Використовує AniHub для перегляду аніме",
    state: "Переглядає список аніме",
    type: 3,
    largeImageKey: "logo",
    largeImageText: "AniHub Logo",
    smallImageKey: userData.avatar || "logo",
    smallImageText: userData.username || "Anonymous",
    buttons: [
      {
        label: "My Profile",
        url: `https://anihub.in.ua/profile/${userData.username}`,
      },
    ],
  });
}

export function watchPresence(
  userData: UserData,
  animeInfo: AnimeInfo,
  currentEpisode: string,
  videoState?: VideoState,
) {
  const now = Date.now();
  let startTimestamp;
  let endTimestamp;
  if (videoState) {
    startTimestamp = Math.floor(now - (videoState.currentTime * 1000));
    endTimestamp = Math.floor(startTimestamp + (videoState.duration * 1000));
  }

  sendPresenceUpdate({
    details: animeInfo.title_ukrainian,
    state: `Епізоди: ${currentEpisode}/${animeInfo.episodes_count}`,
    type: 3,
    largeImageKey: animeInfo.poster_url,
    largeImageText: animeInfo.title_ukrainian,
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
        url: `https://anihub.in.ua/anime/${animeInfo.slug}-${animeInfo.id}`,
      },
    ],
  });
}
