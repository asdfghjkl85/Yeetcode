import generateRandomCode from "./code_generator.js";

const socket = new WebSocket("ws://localhost:3000/ws");

document.addEventListener("DOMContentLoaded", function () {
    // UI Elements
    const createTeamButton = document.getElementById("create-team-button");
    const joinTeamButton = document.getElementById("join-team-button");
    const startGameButton = document.getElementById("start-game-button");
    let player1Input = document.getElementById("player1Name");
    const player2Container = document.getElementById("player2-container");
    let player2Input = document.getElementById("player2Name");
    const confirmJoinButton = document.getElementById("confirm-join");
    let back_to_main_button = document.getElementById("back-to-main-screen");
    let back_to_main_button_from_join = document.getElementById("back-to-main-screen-from-join");

    // Navigate back to main screen
    if (back_to_main_button) {
        back_to_main_button.addEventListener("click", function () {
            window.location.href = "main-screen.html";
        });
    }

    // Navigate back to main screen
    if (back_to_main_button_from_join) {
        back_to_main_button_from_join.addEventListener("click", function () {
            window.location.href = "main-screen.html"; 
        });
    }
    

    //<!--------------------LOGIC FOR STARTING GAME---------------------!.
    
    //Player 1
    if (createTeamButton) {
        createTeamButton.addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "create-team-screen.html";
        })
    }

    //Player 2
    if (joinTeamButton) {
        joinTeamButton.addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "join-team-screen.html";
        })
    }

    const toggleCheckbox = document.getElementById("toggle-note-checkbox");
    const noteContent = document.getElementById("note-content");

    function adjustNoteHeight() {
        if (toggleCheckbox && noteContent) {
            if (toggleCheckbox.checked) {
                let availableHeight = window.innerHeight - noteContent.offsetTop - 20;
                noteContent.style.height = `${availableHeight}px`;
            } else {
                noteContent.style.height = "0px";
            }
        }
    }

    // Adjust height when checkbox state changes
    if (toggleCheckbox) {
        toggleCheckbox.addEventListener("change", adjustNoteHeight);
    }

    // Update height when the window is resized
    window.addEventListener("resize", adjustNoteHeight);
});