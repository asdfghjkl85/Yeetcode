chrome.runtime.onInstalled.addListener(() =>  {
    chrome.sidePanel.setOptions({ path: "Frontend/main-screen.html" })
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true});
});

chrome.tabs.onUpdated.addListener((tabId, tab) => {
    console.log("\n\nTesting: BACKGROUND LOGS!!!\n\n")
    chrome.tabs.sendMessage(tabId, {
        message: "connected"
    })
  })
