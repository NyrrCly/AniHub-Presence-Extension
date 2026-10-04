import {
  extractDubbingStudio,
  extractEpisodeData,
  extractUserData,
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
      let episode: string;
      let dubbingStudio: string;

      if (!window.location.pathname.includes("/anime/")) {
        clearPresence();
        return;
      }

      const animeId = window.location.pathname.match(/\w+$/)?.[0]!;
      const userData = extractUserData();
      animeData = await fetchAnimeDetails(animeId);
      episode = animeData.dubbing_studios.length
        ? await extractEpisodeData()
        : "?";
      dubbingStudio = await extractDubbingStudio();

      browser.runtime.onMessage.addListener((message) => {
        const videoState: VideoState = message.payload;
        if (videoState.isPaused) {
          clearPresence();
          return;
        }
        watchPresence(userData, animeData, episode, dubbingStudio, videoState);
      });

      if (episode !== "-1" && dubbingStudio !== "Unknown") {
        watchPresence(userData, animeData, episode, dubbingStudio);
      }

      episodeObserver.start(async (newEpisode, newDubbingStudio) => {
        episode = newEpisode;
        dubbingStudio = newDubbingStudio;
        animeData = await fetchAnimeDetails(
          window.location.pathname.match(/\w+$/)?.[0]!,
        );
        watchPresence(userData, animeData, episode, dubbingStudio);
      });
    }
  },
});
