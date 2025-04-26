import { generateRandomCode } from "./code_generator.js";

document.addEventListener("DOMContentLoaded", () => {
    const inviteCodeElement = document.getElementById("inviteCode");
    const startGameSetupButton = document.getElementById("start-game-button-setup");
    const copyCodeButton = document.getElementById("copyCode");
    const backButton = document.getElementById("back-to-main-screen");

    // Initialize backend and WebSocket connection
    const BACKEND_API = "https://yeetcode-production-a720.up.railway.app";
    const socket = new WebSocket("wss://yeetcode-production-a720.up.railway.app/ws");

    // Log WebSocket connection status for debugging
    socket.addEventListener('open', (event) => {
        console.log("WebSocket connection established successfully");
    });

    socket.addEventListener('error', (event) => {
        console.error("WebSocket connection error:", event);
    });

    // Add event listener for the back button
    backButton.addEventListener("click", () => {
        window.location.href = "main-screen.html";
    });

    // Only create game when socket is ready or add a listener to create it when ready
    if (socket.readyState === WebSocket.OPEN) {
        createGame(inviteCodeElement, startGameSetupButton, socket);
    } else {
        socket.addEventListener('open', () => {
            createGame(inviteCodeElement, startGameSetupButton, socket);
        });
    }

    if (copyCodeButton) {
        copyCodeButton.addEventListener("click", () => {
            const inviteCode = localStorage.getItem("inviteCode");
            navigator.clipboard.writeText(inviteCode).then(() => {
                alert("Code copied!");
            }).catch((err) => {
                console.error("Failed to copy code:", err);
            });
        });
    }

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
    
        if (data.type === "PLAYER2_JOINED_send_1") {  
            localStorage.setItem("player2", data.player2);
            startGameSetupButton.disabled = false;
            startGameSetupButton.style.backgroundColor = "#eab764";
            startGameSetupButton.style.cursor = "default";
            
            let waitingMsg = document.getElementById("waitingMsg");
            if (waitingMsg) {
                waitingMsg.textContent = "Player 2 has joined the game!";
            }

            
            // Let Player 2 know they're accepted
            socket.send(JSON.stringify({
                type: "accepted_join_game_send_2",
                isPlayer1Api: localStorage.getItem("isPlayer1Api"), 
                isPlayer2Api: localStorage.getItem("isPlayer2Api"),
                gameId: localStorage.getItem("gameId"),
            }));
        }
    };

    startGameSetupButton.addEventListener("click", () => {
      
        let player1Name = localStorage.getItem("leetcode_username");
        localStorage.setItem("player1",  player1Name);

        socket.send(JSON.stringify({
            type: "player1_name_send_2",
            player1: player1Name,
            isPlayer1Api: localStorage.getItem("isPlayer1Api"), 
            isPlayer2Api: localStorage.getItem("isPlayer2Api"),
            gameId: localStorage.getItem("gameId"),
        }));

        window.location.href = "game-setup-screen.html";
    });
});

function createGame(inviteCodeElement, startGameSetupButton, socket) {
    localStorage.setItem("isPlayer1Api", "true");
    localStorage.setItem("isPlayer2Api", "false");
    if (!inviteCodeElement) return;

    const invCode = generateRandomCode();
    console.log("Generated Invite Code:", invCode);
    inviteCodeElement.innerText = invCode;
    localStorage.setItem("inviteCode", invCode);

    if (startGameSetupButton) {
        startGameSetupButton.disabled = true;
        startGameSetupButton.style.backgroundColor = "#555";
        startGameSetupButton.style.cursor = "not-allowed";
    }

    fetch("https://yeetcode-production-a720.up.railway.app/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitation_code: invCode, username: null })
    })
    .then(response => response.json())
    .then(data => {
        const gameId = data._id;
        localStorage.setItem("gameId", gameId);
        
        // Check if WebSocket is ready before sending message
        if (socket.readyState === WebSocket.OPEN) {
            // WebSocket is open, safe to send
            socket.send(JSON.stringify({ 
                type: "connect", 
                gameId: gameId, 
                inviteCode: invCode, 
                isPlayer1Api: localStorage.getItem("isPlayer1Api"), 
                isPlayer2Api: localStorage.getItem("isPlayer2Api") 
            }));
        } else {
            // WebSocket not ready yet, wait for it to open
            socket.addEventListener('open', function() {
                socket.send(JSON.stringify({ 
                    type: "connect", 
                    gameId: gameId, 
                    inviteCode: invCode, 
                    isPlayer1Api: localStorage.getItem("isPlayer1Api"), 
                    isPlayer2Api: localStorage.getItem("isPlayer2Api") 
                }));
            });
        }
    })
    .catch(error => console.error("Error creating game:", error));
}
