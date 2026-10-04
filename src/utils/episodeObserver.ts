import { extractDubbingStudio, extractEpisodeData } from "./pageParser";

export class EpisodeObserver {
  private observer: MutationObserver | null = null;
  private lastEpisode: string = "";
  private lastDubbingStudio: string = "";

  async start(
    onEpisodeChange: (episode: string, dubbingStudio: string) => void,
  ) {
    this.stop();

    const episode = await extractEpisodeData();
    const dubbingStudio = await extractDubbingStudio();
    this.lastEpisode = episode;
    this.lastDubbingStudio = dubbingStudio;

    this.observer = new MutationObserver(async () => {
      const episode = await extractEpisodeData();
      const dubbingStudio = await extractDubbingStudio();

      if (
        (episode && episode !== this.lastEpisode) ||
        (dubbingStudio && dubbingStudio !== this.lastDubbingStudio)
      ) {
        this.lastEpisode = episode;
        this.lastDubbingStudio = dubbingStudio;
        onEpisodeChange(episode, dubbingStudio);
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
