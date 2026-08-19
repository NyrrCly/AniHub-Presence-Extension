import { extractPageData } from "./pageParser";

export class EpisodeObserver {
  private observer: MutationObserver | null = null;
  private lastEpisode: string = "";

  start(onEpisodeChange: (animeId: string, episode: string) => void) {
    this.stop();

    const initial = extractPageData();
    this.lastEpisode = initial.episode;

    this.observer = new MutationObserver(() => {
      const { animeId, episode } = extractPageData();

      if (animeId && episode && episode !== this.lastEpisode) {
        console.log(
          `[AniHub Presence] Серія змінилася: ${this.lastEpisode} -> ${episode}`,
        );
        this.lastEpisode = episode;
        onEpisodeChange(animeId, episode);
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  stop() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
