export function initIframeVideoTracker() {
  const checkVideo = setInterval(() => {
    const video = document.querySelector("video");

    if (video) {
      clearInterval(checkVideo);
      setupListeners(video);
    }
  }, 500);
}

function setupListeners(video: HTMLVideoElement) {
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
  video.addEventListener("seeked", sendVideoState);

  if (!video.paused) {
    sendVideoState();
  }
}
