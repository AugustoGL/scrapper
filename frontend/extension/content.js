// content.js
window.addEventListener("message", function (event) {
    if (event.source !== window) return;
    if (event.data?.type === "SAVE_TOKEN") {
        chrome.storage.local.set({ access_token: event.data.token });
    }
    if (event.data?.type === "CLEAR_TOKEN") {
        chrome.storage.local.remove("access_token");
    }
});