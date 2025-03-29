// List of keywords to detect AI-related websites
const AI_KEYWORDS = ['chatgpt', 'deepseek'];


// Logs AI website access to chrome.storage.local
//  @param {string} url - The URL of the accessed AI website
//  @param {string} timestamp - The time of access in ISO string format
 
async function logAIAccess(url, timestamp) {
  const { aiAccessLogs = [] } = await chrome.storage.local.get('aiAccessLogs');
  await chrome.storage.local.set({ 
    aiAccessLogs: [...aiAccessLogs, { url, timestamp, type: 'ai_site_access' }] 
  });
  console.log('AI Site Access:', { url, timestamp });
}

// Event listener that runs whenever a tab is updated
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  // Only track when the page is fully loaded
  if (info.status !== 'complete' || !tab.url) return;
  
  const url = new URL(tab.url);
  if (AI_KEYWORDS.some(keyword => url.origin.includes(keyword))) {
    await logAIAccess(url.toString(), new Date().toISOString());
  }
});
