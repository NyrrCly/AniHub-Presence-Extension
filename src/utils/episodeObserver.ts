import { extractEpisodeData } from "./pageParser";

export class EpisodeObserver {
  private observer: MutationObserver | null = null;
  private lastEpisode: string = "";

  async start(onEpisodeChange: (episode: string) => void) {
    this.stop();

    const episode = await extractEpisodeData();
    this.lastEpisode = episode;

    this.observer = new MutationObserver(async () => {
      const episode = await extractEpisodeData();

      if (episode && episode !== this.lastEpisode) {
        this.lastEpisode = episode;
        onEpisodeChange(episode);
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
