import type { AnimeData, UserData, VideoState } from "@/types/types.js";
import { sendPresenceUpdate } from "./services/api.js";

export function clearPresence() {
  sendPresenceUpdate(null);
}

export function watchPresence(
  userData: UserData,
  animeData: AnimeData,
  currentEpisode: string,
  dubbingStudio: string,
  videoState?: VideoState,
) {
  sendPresenceUpdate({
    userData,
    animeData,
    currentEpisode,
    dubbingStudio,
    videoState
  });
}
