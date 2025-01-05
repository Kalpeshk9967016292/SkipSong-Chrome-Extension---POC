chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    skipEnabled: true,
    lastUpdate: null
  });
  console.log("Song Skipper Extension Installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "injectScript") {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      files: ["injected.js"]
    }).then(() => {
      sendResponse({ status: "Script Injected" });
    }).catch(error => {
      console.error('Script injection failed:', error);
      sendResponse({ status: "Injection Failed", error: error.message });
    });
    return true; 
  }
});