import { mainPresence, watchPresence } from "@/utils/presence.js";
import { extractPageData, extractUserData } from "@/utils/pageParser.js";
import { fetchAnimeDetails } from "@/utils/api.js";
import { initUrlObserver } from "@/utils/urlObserver.js";
import { EpisodeObserver } from "@/utils/episodeObserver.js";
import { initIframeVideoTracker } from "@/utils/iframeTracker.js"
import type { VideoState } from "@/types/types";

export default defineContentScript({
  matches: ["*://anihub.in.ua/*", "*://*.ashdi.vip/*"],
  allFrames: true,
  main() {
    console.log("[AniHub Presence] Content Script Initialized");

    const episodeObserver = new EpisodeObserver();

    window.addEventListener("beforeunload", () => {
      clearPresence();
    });

    if (window.location.hostname.includes('ashdi.vip')) {
      initIframeVideoTracker();
      return;
    }

    const handleRoute = async () => {
      const pathname = window.location.pathname;
      const userData = extractUserData();

      if (!pathname.includes("/anime/")) {
        clearPresence();
      }

      const { animeId, episode } = extractPageData();
      if (!animeId) {
        episodeObserver.stop();
        return;
      }

      const animeData = await fetchAnimeDetails(animeId);
      if (animeData) {
        watchPresence(userData, animeData, episode);
      }

      browser.runtime.onMessage.addListener((message) => {
        const videoState: VideoState = message.payload;
        if (videoState.isPaused) {
          clearPresence();
          return
        }

        watchPresence(userData, animeData, episode, videoState)
      });

      episodeObserver.start(async (newAnimeId, newEpisode) => {
        const updatedData = await fetchAnimeDetails(newAnimeId);
        if (updatedData) {
          watchPresence(userData, updatedData, newEpisode);
        }
      });
    };

    initUrlObserver(() => {
      setTimeout(() => {
        handleRoute();
      }, 1000);
    });
  },
});
