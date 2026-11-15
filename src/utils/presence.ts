import type { AnimeData, VideoState } from "@/types/types.js";
import { sendPresenceUpdate } from "./services/api.js";

export function clearPresence() {
  sendPresenceUpdate(null);
}

export function watchPresence(
  animeData: AnimeData,
  currentEpisode: string | undefined,
  dubbingStudio: string | undefined,
  videoState?: VideoState,
) {
  sendPresenceUpdate({
    animeData,
    currentEpisode,
    dubbingStudio,
    videoState,
  });
}
