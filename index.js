import bowser from "bowser";

function armFallbackTimer(callback) {
  /**
   * If the window hasn't lost focus in 5000ms
   * we know that the deep link has failed and we can call the fallback
   */
  const delay = 5000;
  const timer = setTimeout(callback, delay);
  window.addEventListener("blur", function() {
    clearTimeout(timer);
  });
}

const methods = {
  universal(uri, callback) {
    armFallbackTimer(callback);
    window.location.replace(uri);
  },
  iframe(uri, callback) {
    armFallbackTimer(callback);
    /**
     * Safari needs to be tricked with an iframe
     */
    const trick = document.createElement("iframe");
    trick.style =
      "position: fixed;top: 0;left: 0;right: 0;bottom: 0;visibility: hidden;";
    trick.src = uri;
    document.body.appendChild(trick);
  },
  msLaunch(uri, callback) {
    window.navigator.msLaunchUri(uri, function() {}, callback);
  }
};

function openNativeLink(uri, fallback) {
  if (typeof uri !== "string") {
    throw new TypeError("uri must be of type string");
  }
  if (typeof fallback !== "function") {
    throw new TypeError("fallback must be of type function");
  }
  const browser = bowser.getParser(window.navigator.userAgent);
  const useFrame = browser.satisfies({
    macos: {
      safari: ">11"
    },
    firefox: "*"
  });
  const useMsLaunch =
    browser.satisfies({
      windows: {
        ie: "*",
        edge: "*"
      }
    }) &&
    typeof window.navigator.msLaunchUri === "function" &&
    uri.indexOf("://") !== -1;
  if (useFrame) {
    methods.iframe(uri, fallback);
  } else if (useMsLaunch) {
    methods.msLaunch(uri, fallback);
  } else {
    methods.universal(uri, fallback);
  }
}

export default {
  openNativeLink
};
