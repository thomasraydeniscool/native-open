function createHiddenFrame() {
  const frame = document.createElement("iframe");
  frame.style =
    "position: fixed;top: 0;left: 0;right: 0;bottom: 0;visibility: hidden;";
  return frame;
}

function blurFallbackTimer(callback) {
  /**
   * If the window hasn't lost focus in 5000ms
   * we know that the deep link has failed and we can call the fallback
   */
  const delay = 3000;
  const timer = setTimeout(callback, delay);
  window.addEventListener("blur", function() {
    clearTimeout(timer);
  });
}

const methods = {
  universal(uri, fallback) {
    blurFallbackTimer(fallback);
    const frame = createHiddenFrame();
    frame.src = uri;
    document.body.appendChild(frame);
  },
  msLaunch(uri, fallback) {
    window.navigator.msLaunchUri(
      uri,
      function() {},
      function() {
        fallback();
      }
    );
  }
};

export function openNativeLink(uri, fallback) {
  if (typeof uri !== "string") {
    throw new TypeError("uri must be of type string");
  }
  if (typeof fallback !== "function") {
    throw new TypeError("fallback must be of type function");
  }
  if (typeof window.navigator.msLaunchUri === "function") {
    methods.msLaunch(uri, fallback);
  } else {
    methods.universal(uri, fallback);
  }
}

export default {
  openNativeLink
};
