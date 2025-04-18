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

    // async function getInviteCode() {
    //     return new Promise((resolve) => {
    //         chrome.storage.local.get(["inviteCode"], (data) => resolve(data.inviteCode));
    //     });
    // }

    // // **Listen for WebSocket updates**
    // socket.onmessage = async (event) => {
    //     const data = JSON.parse(event.data);
    //     const inviteCode = await getInviteCode();

    //     if (data.type === "PLAYER_JOINED" && data.invitation_code === inviteCode) {
    //         chrome.storage.local.get(["inviteCode"], (storage) => {
    //             if (data.invitation_code === storage.inviteCode) {
    //                 console.log("Player 2 has joined! Updating UI...");

    //             if (!player2Container) {
    //                 player2Container = document.createElement("div");
    //                 player2Container.id = "player2-container";
    //                 document.getElementById("create-team-screen").appendChild(player2Container);
    //             }

    //             if (!player2Input) {
    //                 player2Input = document.createElement("input");
    //                 player2Input.id = "player2Name";
    //                 player2Input.placeholder = "Player 2"; // Default placeholder
    //                 player2Container.appendChild(player2Input);
    //             }

    //             // Update Player 2's name properly
    //             player2Input.value = data.player2 || "";
    //             player2Input.disabled = true; // Ensure Player 1 can't edit Player 2's name

    //             // Hide "Waiting for Player 2..." message
    //             const waitingMsg = document.getElementById("waitingMsg");
    //             if (waitingMsg) waitingMsg.remove();

    //             player2Container.style.display = "block"; 
    //             toggleButtonState(startGameButton, true);

    //             }
    //         });
    //     }

        // Notify Player 2 when game starts
        // if (data.type === "START_GAME") {
        //     console.log("Game started! Redirecting Player 2...");
        //     window.location.href = "game-play-screen.html";
        // }
    // };

    // **Start Game Button**
    // if (startGameButton) {
    //     startGameButton.addEventListener("click", async () => {
    //         try {
    //             // Retrieve player names
    //             const player1Name = player1Input.value.trim();
    //             const player2Name = player2Input.value.trim();

    //             // Store in localStorage
    //             localStorage.setItem("Player1", player1Name);
    //             localStorage.setItem("Player2", player2Name);

    //             // Store game state before navigation
    //             chrome.storage.local.set({
    //                 gameState: {
    //                     gameId: gameId,
    //                     player1: player1Name,
    //                     player2: player2Name,
    //                     status: "setup"
    //                 }
    //             });

    //             // Navigate to setup screen instead of directly to game
    //             window.location.href = "game-setup-screen.html";
    //         } catch (err) {
    //             console.error("Failed to proceed to game setup:", err);
    //         }
    //     });
    // }

    // let game_code_text = document.getElementById("inviteCode");
    // if (game_code_text) {
    //     const gameCode = localStorage.getItem("gameCode");
    //     game_code_text.innerText = gameCode;
    //     //then add this game code (with other features like player)
    //     //to the list of currently available games
    // }

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