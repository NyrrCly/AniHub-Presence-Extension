import { extractPageData } from "./pageParser";

export class EpisodeObserver {
  private observer: MutationObserver | null = null;
  private lastEpisode: string = "";

  async start(onEpisodeChange: (animeId: string, episode: string) => void) {
    this.stop();

    const initial = await extractPageData();
    this.lastEpisode = initial.episode;

    this.observer = new MutationObserver(async () => {
      const { animeId, episode } = await extractPageData();

      if (animeId && episode && episode !== this.lastEpisode) {
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
