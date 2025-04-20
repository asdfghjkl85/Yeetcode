import updateSubmission from "../../../Backend/utils/gameLoop.js";
import { userRecentSubmissions } from "../api/graphql_apis.js";
import { getNextTime, timeFormated, titleToSlug } from "./utils.js";

const NUM_USERS = 2;
let gameState = JSON.parse(localStorage.getItem("gameState"));

// Initialize time from localStorage or default to 10 minutes
var numMinutes = gameState.timeLimit|| 10;
var numSeconds = 0;

const gameOverPage = "assets/yeet_motion_html_files/yeet_motion.html";
const gameOverPage2 = "assets/yeet_motion_html_files/rip_motion.html";

// Function to count completed problems for a player
function countCompletedProblems(playerIndex) {
    return window.currentCorrectSubmissions[playerIndex].filter(Boolean).length;
}

// Function to update the UI with submission status
// function updateSubmissionUI(submissions) {
//     console.log("Updating UI with submissions:", submissions);
//     submissions.forEach((playerSubmissions, playerIndex) => {
//         playerSubmissions.forEach((isCorrect, problemIndex) => {
//             const boxId = `player${playerIndex + 1}Box${problemIndex + 1}`;
//             const box = document.getElementById(boxId);
//             if (box) {
//                 // Only update if the problem is newly solved (wasn't solved before)
//                 if (isCorrect && !window.currentCorrectSubmissions[playerIndex][problemIndex]) {
//                     box.innerHTML = '<img src="assets/images/checkmark.png" alt="✓" style="width: 30px; height: 30px;">';
//                 } else if (!isCorrect && !window.currentCorrectSubmissions[playerIndex][problemIndex]) {
//                     box.textContent = '🟡';
//                 }
//             }
//         });

//         // Update the score display for each player
//         const scoreElement = document.getElementById(`player${playerIndex + 1}-score`);
//         if (scoreElement) {
//             const totalSolved = playerSubmissions.filter(Boolean).length;
//             scoreElement.textContent = totalSolved;
//         }
//     });
// }

// Function to determine winner and handle game over
function handleGameOver() {
    const player1Completed = countCompletedProblems(0);
    const player2Completed = countCompletedProblems(1);
    
    console.log(`Player 1 completed: ${player1Completed}, Player 2 completed: ${player2Completed}`);
    
    // Determine winner
    let winner, loser;
    if (player1Completed > player2Completed) {
        winner = window.PLAYER1;
        loser = window.PLAYER2;
    } else if (player2Completed > player1Completed) {
        winner = window.PLAYER2;
        loser = window.PLAYER1;
    } else {
        // Tie - use time as tiebreaker
        winner = window.PLAYER1;
        loser = window.PLAYER2;
    }
    
    // Store loser's name for the animation
    console.log(`Setting loser name to: ${loser}`);
    localStorage.setItem("loserName", loser);
    
    // Add a small delay to ensure localStorage is updated
    setTimeout(() => {
        window.location.href = gameOverPage;
    }, 100);
}

document.addEventListener("DOMContentLoaded", function () {
    // Initialize timer display with selected time
    document.getElementById("timerText").innerText = timeFormated(numMinutes, numSeconds);
});

var intervalTimer = setInterval(async function() {
    const nextTime = getNextTime(numMinutes, numSeconds);
    numMinutes = nextTime[0];
    numSeconds = nextTime[1];

    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        if (message.action === "triggerUserSubmissionAPICall") {
            console.log("Clicked on submit button");
            const problemList = window.PROBLEM_LIST;
            const NUM_PROBLEMS = problemList.length;
            let userList = [window.PLAYER1, window.PLAYER2];
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
                const recentSubmissions = await userRecentSubmissions(PLAYER, 1);
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
                        currentCorrectSubmissions[playerIdx][titleIdx] = true;
                        box.innerHTML = '<img src="assets/images/checkmark.png" alt="✓" style="width: 30px; height: 30px;">';
                    }
                    else {
                        box.innerHTML = '<img src="assets/images/xmark.png" alt="x" style="width: 30px; height: 30px;">';
                    }
                    console.log(currentCorrectSubmissions);
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
