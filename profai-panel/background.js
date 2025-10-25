// Runs in the background and controls when to show the side panel
chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.open({ windowId: tab.windowId });
  await chrome.sidePanel.setOptions({
    windowId: tab.windowId,
    path: "panel.html"
  });
});
