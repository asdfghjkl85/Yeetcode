import { getGameProblems } from "../api/mongo_api.js";
import { sendGameProblems } from "../api/mongo_api.js";
// Get selected options from localStorage

const player1Name = localStorage.getItem("Player1");
const player2Name = localStorage.getItem("Player2");
const gameId = localStorage.getItem("gameId");


// Track selected problems for submission checking
let selectedProblems = [];

// Get game settings from storage
let selectedProblemCount;

async function getGameSettings() {
    try {
        const { gameState } = await new Promise((resolve) => {
            chrome.storage.local.get(["gameState"], (data) => resolve(data));
        });

        if (gameState && gameState.settings) {
            selectedProblemCount = gameState.settings.problemCount;
            console.log("Selected problem count:", selectedProblemCount);
        } else {
            console.error("No game settings found");
            selectedProblemCount = 3; // Default value
        }
    } catch (error) {
        console.error("Error getting game settings:", error);
        selectedProblemCount = 3; // Default value
    }
}

// Generate URL from problem ID
function generateProblemUrl(problemId) {
    return `https://leetcode.com/problems/${problemId}/description/`;
}

// Format problem title from ID
function formatProblemTitle(problemId) {
    return problemId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Load problems from database
async function loadProblems() {
    try {
        // Get gameId from storage
        const { gameId } = await new Promise((resolve) => {
            chrome.storage.local.get(["gameId"], (data) => resolve(data));
        });

        if (!gameId) {
            console.error('No game ID found');
            return [];
        }

        // Fetch problems from database
        const response = getGameProblems(gameId);
        
        if (response) {
            console.log("Problems found in database, problems:", response);
            return response;
        } else {
            console.log("No problems found in database");
            return [];
        }
    } catch (error) {
        console.error('Error loading problems:', error);
        return [];
    }
}

// Create problem row HTML
function createProblemRow(problemId, index) {
    return `
        <tr>
            <td>
                <a href="${generateProblemUrl(problemId)}" target="_blank" class="problem-link">
                    ${formatProblemTitle(problemId)}
                </a>
            </td>
            <td id="player1Box${index + 1}" class="player1">🟡</td>
            <td id="player2Box${index + 1}" class="player2">🟡</td>
        </tr>
    `;
}

// Initialize game table
async function initializeGameTable() {
    let problems = await loadProblems();
    const tableBody = document.querySelector('.game-table tbody');
    
    console.log(`Selected problem count: ${problems.length}`);

    const { isPlayer1Api, isPlayer2Api } = await new Promise((resolve) => {
        chrome.storage.local.get(["isPlayer1Api", "isPlayer2Api"], (data) => resolve(data));
      });

    if(isPlayer1Api){
        selectedProblems = problems
        .sort(() => Math.random() - 0.5)
        .slice(0, selectedProblemCount);
        console.log('HEREE IS THE GAME ID::', gameId);
        console.log(`Selected ${selectedProblems.length} problems out of ${problems.length} available`);
        await sendGameProblems(selectedProblems, gameId)
    } else {
        selectedProblems = problems; 
    }
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add new rows
    selectedProblems.forEach((problemId, index) => {
        tableBody.innerHTML += createProblemRow(problemId, index);
    });
    
    // Update player names in the table header
    document.getElementById("gamePlayer1").textContent = player1Name;
    document.getElementById("gamePlayer2").textContent = player2Name;

    // Initialize submission tracking array
    window.currentCorrectSubmissions = Array(2).fill().map(() => Array(selectedProblemCount).fill(false));
    
    // Store selected problem IDs for submission checking
    window.PROBLEM_LIST = selectedProblems;
    
    // Update global player variables for timer.js
    window.PLAYER1 = player1Name;
    window.PLAYER2 = player2Name;
    
    // Update number of problems for timer.js
    window.NUM_PROBLEMS = selectedProblemCount;

    // Store game start time in milliseconds
    window.GAME_START_TIME = Date.now();
    console.log("Game start time set to:", new Date(window.GAME_START_TIME).toISOString());
}

// Update UI with submission status
function updateSubmissionUI(submissions) {
    console.log("Updating UI with submissions:", submissions);
    submissions.forEach((playerSubmissions, playerIndex) => {
        playerSubmissions.forEach((isCorrect, problemIndex) => {
            const boxId = `player${playerIndex + 1}Box${problemIndex + 1}`;
            const box = document.getElementById(boxId);
            if (box) {
                box.textContent = isCorrect ? '🟢' : '🟡';
            }
        });
        
        // Update the score display for each player
        const scoreElement = document.getElementById(`player${playerIndex + 1}-score`);
        if (scoreElement) {
            const totalSolved = playerSubmissions.filter(Boolean).length;
            console.log(`Player ${playerIndex + 1} solved ${totalSolved} problems`);
            scoreElement.textContent = totalSolved;
        }
    });
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', async () => {
    await getGameSettings();
    console.log(`Starting game with ${selectedProblemCount} problems`);
    initializeGameTable();
    
    // Listen for submission updates from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'submissionUpdate') {
            console.log("Received submission update:", message.submissions);
            updateSubmissionUI(message.submissions);
        }
    });
}); 