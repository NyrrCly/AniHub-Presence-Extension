import {
  extractDubbingStudio,
  extractEpisodeData,
} from "@/utils/pageParser.js";
import { fetchAnimeDetails } from "@/utils/services/api.js";
import { initUrlObserver } from "@/utils/urlObserver.js";
import { initIframeVideoTracker } from "@/utils/iframeTracker.js";
import { watchPresence } from "@/utils/presence";
import type { AnimeData, VideoState } from "@/types/types.js";
import { hosts } from "@/constants/host.js";

export default defineContentScript({
  matches: [
    "*://anihub.in.ua/*",
    "*://*.ashdi.vip/*",
    "*://*.fenixplay.xyz/*",
    "*://*.moonanime.art/*",
  ],
  excludeMatches: [
    "*://anihub.in.ua/oauth/*"
  ],
  allFrames: true,
  main() {
    if (hosts.some((host) => window.location.hostname.includes(host))) {
      initIframeVideoTracker();
      return;
    }

    console.log("[AniHub Presence] Content Script Initialized");

    const episodeObserver = new EpisodeObserver();

    window.addEventListener("beforeunload", () => {
      clearPresence();
    });

    initUrlObserver(() => {
      handlePresence();
    });

    async function handlePresence() {
      let animeData: AnimeData;
      let episode: string | undefined;
      let dubbingStudio: string | undefined;

      if (!window.location.pathname.includes("/anime/")) {
        clearPresence();
        return;
      }

      const animeId = window.location.pathname.match(/\w+$/)?.[0]!;
      animeData = await fetchAnimeDetails(animeId);
      episode = animeData.dubbing_studios.length
        ? await extractEpisodeData()
        : undefined;
      dubbingStudio = episode ? await extractDubbingStudio() : undefined;

      browser.runtime.onMessage.addListener((message) => {
        const videoState: VideoState = {
          ...message.payload,
          currentDate: Date.now(),
        }
        if (videoState.isPaused) {
          clearPresence();
          return;
        }
        watchPresence(animeData, episode, dubbingStudio, videoState);
      });

      if (episode !== "-1" && dubbingStudio !== "Unknown") {
        watchPresence(animeData, episode, dubbingStudio);
      }

      episodeObserver.start(async (newEpisode, newDubbingStudio) => {
        episode = newEpisode;
        dubbingStudio = newDubbingStudio;
        animeData = await fetchAnimeDetails(
          window.location.pathname.match(/\w+$/)?.[0]!,
        );
        watchPresence(animeData, episode, dubbingStudio);
      });
    }
  },
});
