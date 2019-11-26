const UAParser = require("ua-parser-js");

const parser = new UAParser();

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
  const delay = 5000;
  const timer = setTimeout(callback, delay);
  window.addEventListener("blur", function() {
    clearTimeout(timer);
  });
}

const methods = {
  universal(uri, callback) {
    /**
     * Chrome and others technique
     */
    blurFallbackTimer(callback);
    window.location.replace(uri);
  },
  frame(uri, callback) {
    /**
     * Safari technique
     *
     * Safari needs to be tricked with an iframe
     */
    blurFallbackTimer(callback);
    const frame = createHiddenFrame();
    frame.src = uri;
    document.body.appendChild(frame);
  },
  frameWCatch(uri, callback) {
    /**
     * Firefox technique
     */
    const frame = createHiddenFrame();
    document.body.appendChild(frame);
    try {
      frame.contentWindow.location.href = uri;
    } catch (err) {
      console.error(err);
      callback();
    }
  },
  frameWCORS(uri, callback) {
    /**
     * Opera technique
     */
    const frame = createHiddenFrame();
    frame.src = uri;
    document.body.appendChild(frame);
    setTimeout(function() {
      try {
        console.log(frame.contentWindow.location);
      } catch (err) {
        console.error(err);
        callback();
      }
    }, 0);
  },
  msLaunch(uri, callback) {
    /**
     * Microsoft Windows technique
     */
    window.navigator.msLaunchUri(uri, function() {}, callback);
  }
};

export function openNativeLink(uri, fallback) {
  if (typeof uri !== "string") {
    throw new TypeError("uri must be of type string");
  }
  if (typeof fallback !== "function") {
    throw new TypeError("fallback must be of type function");
  }
  switch (parser.getBrowser().name) {
    case "Safari": {
      methods.useFrame(uri, fallback);
      break;
    }
    case "Firefox": {
      methods.useFrameWCatch(uri, fallback);
      break;
    }
    case "Opera": {
      methods.useFrameWCORS(uri, fallback);
      break;
    }
    default: {
      if (typeof window.navigator.msLaunchUri === "function") {
        methods.msLaunch(uri, fallback);
      } else {
        methods.universal(uri, fallback);
      }
      break;
    }
  }
}

export default {
  openNativeLink
};
