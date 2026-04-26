// background.js
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "OPEN_TAB_WITH_HTML") {
    const html = message.html;

    const url = "data:text/html;charset=utf-8," + encodeURIComponent(html);

chrome.tabs.create({ url: "viewer.html" });  }
});