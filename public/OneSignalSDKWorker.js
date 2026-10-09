// The site's service worker: OneSignal push notifications plus the offline cache (sw.js).
// If OneSignal can't be loaded (blocked or offline on first visit), the site still installs
// and works offline; only notifications are missing.
try {
  importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
} catch (e) {
  // ignore
}
importScripts("sw.js");
