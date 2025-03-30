import updateSubmission from "../../../Backend/utils/gameLoop.js";

const CHECKING_IF_PASSED = true; //Can change this to true if want to check a submission passed
const CYCLE_AMOUNT = 15; //Number of seconds per API Call
const NUM_USERS = 2;

// Initialize time from localStorage or default to 10 minutes
var numHours = 0;
var numMinutes = parseInt(localStorage.getItem("gameTime")) || 10;
var numSeconds = 0;

const gameOverPage = "assets/yeet_motion_html_files/yeet_motion.html";
const gameOverPage2 = "assets/yeet_motion_html_files/rip_motion.html";

// Function to count completed problems for a player
function countCompletedProblems(playerIndex) {
    return window.currentCorrectSubmissions[playerIndex].filter(Boolean).length;
}

// Function to update the UI with submission status
function updateSubmissionUI(submissions) {
    console.log("Updating UI with submissions:", submissions);
    submissions.forEach((playerSubmissions, playerIndex) => {
        playerSubmissions.forEach((isCorrect, problemIndex) => {
            const boxId = `player${playerIndex + 1}Box${problemIndex + 1}`;
            const box = document.getElementById(boxId);
            if (box) {
                // Only update if the problem is newly solved (wasn't solved before)
                if (isCorrect && !window.currentCorrectSubmissions[playerIndex][problemIndex]) {
                    box.innerHTML = '<img src="assets/images/checkmark.png" alt="✓" style="width: 30px; height: 30px;">';
                } else if (!isCorrect && !window.currentCorrectSubmissions[playerIndex][problemIndex]) {
                    box.textContent = '🟡';
                }
            }
        });
    });
}

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
    document.getElementById("timerText").innerText = timeFormated(numHours, numMinutes, numSeconds);
});

function getNextTime(hours, minutes, seconds) {
    //precondition: hours, minutes, and/or seconds > 0
    if (seconds === 0) {
        if (minutes === 0) {
            if (hours === 0) {
                return [0, 0, 0]; // 🔥 prevent negative time
            }
            --hours;
            minutes = 59;
        } else {
            --minutes;
        }
        seconds = 59;
    } else {
        --seconds;
    }
    return [hours, minutes, seconds];
}

function timeFormated(hours, minutes, seconds) {
    //0 <= hours <= 5; 0 <= minutes, seconds < 60
    var timeOutput = ``;
    if (hours < 10) {timeOutput += `0`;}
    timeOutput += `${hours}:`;
    if (minutes < 10) {timeOutput += `0`;}
    timeOutput += `${minutes}:`;
    if (seconds < 10) {timeOutput += `0`;}
    timeOutput += `${seconds}`;
    return timeOutput;
}

var intervalTimer = setInterval(async function() {
    const nextTime = getNextTime(numHours, numMinutes, numSeconds);
    numHours = nextTime[0];
    numMinutes = nextTime[1];
    numSeconds = nextTime[2];
    
    if (numSeconds % CYCLE_AMOUNT === 0 && CHECKING_IF_PASSED && window.PROBLEM_LIST) {
        // Check if submission has changed
        const updatedPlayerSubmissions = await updateSubmission(
            window.PLAYER1, 
            window.PLAYER2, 
            window.PROBLEM_LIST
        );
        
        // Update the UI with new submission status
        updateSubmissionUI(updatedPlayerSubmissions);
        
        // Update the current submissions array
        window.currentCorrectSubmissions = updatedPlayerSubmissions;
        
        // Check if any player has completed all problems
        for (var i = 0; i < NUM_USERS; i++) {
            if (window.currentCorrectSubmissions[i].every(Boolean)) {
                handleGameOver();
                return;
            }
        }
    }
    
    if (numHours === 0 && numMinutes === 0 && numSeconds === 0) {
        // Time's up - determine winner
        handleGameOver();
    } else {
        //update timer display
        document.getElementById("timerText").innerText = timeFormated(numHours, numMinutes, numSeconds);
    }
}, 1000);

