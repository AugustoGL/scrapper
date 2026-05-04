// content.js

// Responde mensajes del popup (chrome.tabs.sendMessage)
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === "GET_HTML") {
        sendResponse({ html: document.documentElement.outerHTML });
    }
    return true; // mantener el canal abierto para respuestas async
});

// Responde mensajes de la página web (window.postMessage)
window.addEventListener("message", function (event) {
    if (event.source !== window) return;
    if (event.data?.type === "SAVE_TOKEN") {
        chrome.storage.local.set({ access_token: event.data.token });
    }
    if (event.data?.type === "CLEAR_TOKEN") {
        chrome.storage.local.remove("access_token");
    }
});