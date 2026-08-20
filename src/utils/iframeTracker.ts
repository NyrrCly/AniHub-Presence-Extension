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
  let seekTimeout: any;

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

  video.addEventListener("seeked", () => {
    clearTimeout(seekTimeout);

    seekTimeout = setTimeout(() => {
      sendVideoState();
    }, 300);
  });

  video.addEventListener("timeupdate", () => {
    if (video.paused) {
      clearTimeout(seekTimeout);
      seekTimeout = setTimeout(() => {
        sendVideoState();
      }, 300);
    }
  });

  if (!video.paused) {
    sendVideoState();
  }
}
