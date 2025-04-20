import updateSubmission from "../../../Backend/utils/gameLoop.js";
import { userRecentSubmissions } from "../api/graphql_apis.js";
import { getNextTime, timeFormated, titleToSlug } from "./utils.js";

const NUM_USERS = 2;

const gameOverPage = "assets/yeet_motion_html_files/yeet_motion.html";
const gameOverPage2 = "assets/yeet_motion_html_files/rip_motion.html";

// Function to count completed problems for a player
function countCompletedProblems(playerIndex) {
    return window.currentCorrectSubmissions[playerIndex].filter(Boolean).length;
}

// Function to determine winner and handle game over
function handleGameOver() {
    const player1Completed = countCompletedProblems(0);
    const player2Completed = countCompletedProblems(1);
    
    console.log(`Player 1 completed: ${player1Completed}, Player 2 completed: ${player2Completed}`);
    
    // Determine winner
    let winner, loser;
    if (player1Completed > player2Completed) {
        winner = localStorage.getItem('Player1');
        loser = localStorage.getItem('Player2');
    } else if (player2Completed > player1Completed) {
        winner = localStorage.getItem('Player2');
        loser = localStorage.getItem('Player1');
    } else {
        // Tie - use time as tiebreaker
        winner = localStorage.getItem('Player1');
        loser = localStorage.getItem('Player2');
    }
    
    // Store loser's name for the animation
    console.log(`Setting loser name to: ${loser}`);
    localStorage.setItem("loserName", loser);
    
    // Add a small delay to ensure localStorage is updated
    setTimeout(() => {
        window.location.href = gameOverPage;
    }, 100);
}


async function startTimer(numMinutes, numSeconds) {
    document.getElementById("timerText").innerText = timeFormated(numMinutes, numSeconds);
    // Initialize time from localStorage or default to 10 minutes
    var intervalTimer = setInterval(async function() {
        const nextTime = getNextTime(numMinutes, numSeconds);
        numMinutes = nextTime[0];
        numSeconds = nextTime[1];
    
        chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
            if (message.action === "triggerUserSubmissionAPICall") {
                console.log("Clicked on submit button");
                const problemList = window.PROBLEM_LIST;
                const NUM_PROBLEMS = problemList.length;
                let userList = [localStorage.getItem('Player1'), localStorage.getItem('Player2')];
                console.log("Checking submissions for users:", userList);
                let userToHash = new Map();  //assign each user a number
                let problemToHash = new Map();  //assign each problem a number 
                
                for (var i = 0; i < NUM_USERS; i++) {
                    userToHash.set(userList[i], i);
                }
                for (var i = 0; i < NUM_PROBLEMS; i++) {
                    problemToHash.set(problemList[i], i);
                }
    
                // Check if submission has changed
                for (const PLAYER of userList) {
                    try {
                        const recentSubmissions = await userRecentSubmissions(PLAYER, 1);
                        if (recentSubmissions && recentSubmissions.length > 0) {
                            const title = titleToSlug(recentSubmissions[0].title);
                            const timestamp = recentSubmissions[0].timestamp;
                            const status = recentSubmissions[0].status;
                            
                            const playerIdx = userToHash.get(PLAYER);
                            let titleIdx = null;
                            if (problemToHash.has(title)) {
                                titleIdx = problemToHash.get(title);
                            }
                            else {
                                //edge case: current player solved a problem not on the sheet
                                continue;
                            }
    
                            const boxId = `player${playerIdx + 1}Box${titleIdx + 1}`;
                            const box = document.getElementById(boxId);
                            if (box) {
                                if (status == "Accepted") {
                                    window.currentCorrectSubmissions[playerIdx][titleIdx] = true;
                                    box.innerHTML = '<img src="assets/images/checkmark.png" alt="✓" style="width: 30px; height: 30px;">';
                                }
                                else {
                                    box.innerHTML = '<img src="assets/images/xmark.png" alt="x" style="width: 30px; height: 30px;">';
                                }
                                console.log(`Updated UI for ${PLAYER}:`, window.currentCorrectSubmissions[playerIdx]);
                            }
                        }
                    } catch (error) {
                        console.error(`Error checking submissions for ${PLAYER}:`, error);
                    }
                }
    
                // Check if any player has completed all problems
                for (var i = 0; i < NUM_USERS; i++) {
                    if (window.currentCorrectSubmissions[i].every(Boolean)) {
                        handleGameOver();
                        return;
                    }
                }
            }
        });
        
        if (numMinutes === 0 && numSeconds === 0) {
            // Time's up - determine winner
            handleGameOver();
        } else {
            //update timer display
            document.getElementById("timerText").innerText = timeFormated(numMinutes, numSeconds);
        }
    }, 1000);       
}

export { startTimer };
