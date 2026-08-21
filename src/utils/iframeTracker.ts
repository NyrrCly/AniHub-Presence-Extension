export async function initIframeVideoTracker() {
  let video: HTMLVideoElement | null = null;
  while (!video || Number.isNaN(video.duration)) {
    video = document.querySelector<HTMLVideoElement>("video");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  setupListeners(video);
}

function setupListeners(video: HTMLVideoElement) {
  let seekTimeout: ReturnType<typeof setTimeout>;

  const sendVideoState = () => {
    browser.runtime.sendMessage({
      type: "video_state_update",
      payload: {
        isPaused: video.paused,
        currentTime: video.currentTime,
        duration: video.duration,
      },
    });
  };

  video.addEventListener("play", sendVideoState);
  video.addEventListener("pause", sendVideoState);

  video.addEventListener("seeked", () => {
    clearTimeout(seekTimeout);

    seekTimeout = setTimeout(() => {
      sendVideoState();
    }, 700);
  });

  video.addEventListener("timeupdate", () => {
    if (video.paused) {
      clearTimeout(seekTimeout);
      seekTimeout = setTimeout(() => {
        sendVideoState();
      }, 1500);
    }
  });

  if (!video.paused) {
    sendVideoState();
  }
}
