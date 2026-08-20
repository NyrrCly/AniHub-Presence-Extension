import { mainPresence, watchPresence } from "@/utils/presence.js";
import { extractPageData, extractUserData } from "@/utils/pageParser.js";
import { fetchAnimeDetails } from "@/utils/api.js";
import { initUrlObserver } from "@/utils/urlObserver.js";
import { EpisodeObserver } from "@/utils/episodeObserver.js";
import { initIframeVideoTracker } from "@/utils/iframeTracker.js";
import type { AnimeInfo, AnimePageData, VideoState } from "@/types/types";

export default defineContentScript({
  matches: [
    "*://anihub.in.ua/*",
    "*://*.ashdi.vip/*",
    "*://*.fenixplay.xyz/*",
    "*://*.moonanime.art/*",
  ],
  allFrames: true,
  main() {
    console.log("[AniHub Presence] Content Script Initialized");

    const episodeObserver = new EpisodeObserver();

    window.addEventListener("beforeunload", () => {
      clearPresence();
    });

    if (window.location.hostname.includes("ashdi.vip")) {
      initIframeVideoTracker();
      return;
    }

    const handleRoute = async () => {
      const pathname = window.location.pathname;
      const userData = extractUserData();
      let animeData: AnimeInfo;
      let pageInfo: AnimePageData;

      if (!pathname.includes("/anime/")) {
        clearPresence();
      }

      pageInfo = await extractPageData();
      if (!pageInfo.animeId) {
        episodeObserver.stop();
        return;
      }

      animeData = await fetchAnimeDetails(pageInfo.animeId);
      if (animeData) {
        watchPresence(userData, animeData, pageInfo.episode);
      }

      browser.runtime.onMessage.addListener((message) => {
        const videoState: VideoState = message.payload;
        if (videoState.isPaused) {
          clearPresence();
          return;
        }

        watchPresence(userData, animeData, pageInfo.episode, videoState);
      });

      episodeObserver.start(async (newAnimeId, newEpisode) => {
        clearPresence();
        pageInfo = {
          animeId: newAnimeId,
          episode: newEpisode,
        };
        animeData = await fetchAnimeDetails(newAnimeId);
        if (animeData) {
          watchPresence(userData, animeData, newEpisode);
        }
      });
    };

    initUrlObserver(() => {
      handleRoute();
    });
  },
});
