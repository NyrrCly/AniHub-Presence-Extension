export function initUrlObserver(onUrlChange: () => void) {
  let lastUrl = location.href;

  const check = () => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      onUrlChange();
    }
  };

  window.addEventListener("popstate", check);
  setInterval(check, 500);
}
