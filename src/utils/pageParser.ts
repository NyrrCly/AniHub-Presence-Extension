export async function extractEpisodeData(): Promise<string> {
  let episode = "-1";
  while (episode === "-1") {
    const episodeEl = document.querySelector(
      "span.text-xs.lg\\:text-sm.font-medium",
    );
    episode = episodeEl?.textContent?.trim().match(/\d+/)?.[0] || "-1";
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return episode;
}

export async function extractDubbingStudio(): Promise<string> {
  let studio = "Unknown";
  while (studio === "Unknown") {
    const studioEl = document.querySelector(
      "span.truncate.text-xs.lg\\:text-sm.font-medium",
    );
    studio = studioEl?.textContent?.trim() || "Unknown";
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return studio;
}
