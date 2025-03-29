// List of keywords to detect AI-related websites
const AI_KEYWORDS = ['chatgpt', 'deepseek'];

// Game state management
let gameState = {
    isGameActive: false,
    startTime: null,
    endTime: null,
    player1: null,
    player2: null,
    problems: [],
    currentCorrectSubmissions: [[], []]
};

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

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'START_GAME') {
        gameState = {
            ...gameState,
            isGameActive: true,
            startTime: new Date().toISOString(),
            player1: message.player1,
            player2: message.player2,
            problems: message.problems,
            currentCorrectSubmissions: [new Array(message.problems.length).fill(false), new Array(message.problems.length).fill(false)]
        };
        console.log('Game started:', gameState);
        sendResponse({ success: true });
    } else if (message.type === 'END_GAME') {
        gameState = {
            ...gameState,
            isGameActive: false,
            endTime: new Date().toISOString()
        };
        console.log('Game ended:', gameState);
        sendResponse({ success: true });
    } else if (message.type === 'UPDATE_SUBMISSIONS') {
        if (gameState.isGameActive) {
            gameState.currentCorrectSubmissions = message.submissions;
            console.log('Submissions updated:', gameState.currentCorrectSubmissions);
            sendResponse({ success: true });
        } else {
            sendResponse({ success: false, error: 'Game not active' });
        }
    } else if (message.type === 'GET_GAME_STATE') {
        sendResponse({ gameState });
    }
    return true; // Keep the message channel open for async responses
});
