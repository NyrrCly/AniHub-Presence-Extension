export default defineBackground(() => {
  let currentVideoState = null;

  console.log("[AniHub RPC] Background Service Worker Started");
  browser.runtime.onMessage.addListener(async (message, sender) => {
    switch (message.type) {
      case "presence_update": {
        try {
          const response = await fetch("http://localhost:3000/presence", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify(message.payload),
          });

          console.log("[AniHub RPC] Request status:", response.status);
        } catch (error) {
          console.error("[AniHub RPC] Send error:", error);
        }
        break;
      }
      case "video_state_update": {
        const tabId = sender.tab?.id;

        if (tabId) {
          browser.tabs.sendMessage(tabId, {
            type: "video_state_from_bg",
            payload: message.payload
          }).catch(() => {});
        }
        break;
      }
    }
  });
});
