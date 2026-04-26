// content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_HTML") {
    const html = document.documentElement.outerHTML;

    chrome.runtime.sendMessage({
      type: "OPEN_TAB_WITH_HTML",
      html
    });

    sendResponse({ ok: true });
  }
});