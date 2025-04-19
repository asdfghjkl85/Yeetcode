import { generateRandomCode } from "./code_generator.js";

document.addEventListener("DOMContentLoaded", () => {
    const inviteCodeElement = document.getElementById("inviteCode");
    const startGameButton = document.getElementById("start-game-button");
    const copyCodeButton = document.getElementById("copyCode");

    let socket = new WebSocket("ws://localhost:3000/ws");

    createGame(inviteCodeElement, startGameButton, socket);

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
            startGameButton.disabled = false;
            startGameButton.style.backgroundColor = "#eab764";
            startGameButton.style.cursor = "default";
    
            // Create container if not present
            let player2Container = document.getElementById("player2-container");
            if (player2Container) {
                player2Container.id = "player2-container";
                document.getElementById("create-team-screen").appendChild(player2Container);
            }

            let player2Input = document.getElementById("player2Name");
            if (player2Input) {
                player2Input.id = "player2Name";
                player2Input.disabled = true;
                player2Container.appendChild(player2Input);
            }


            // Update the value
            player2Input.value = data.player2 || "Player2";
            
            // Let Player 2 know they're accepted
            socket.send(JSON.stringify({
                type: "accepted_join_game_send_2",
                isPlayer1Api: localStorage.getItem("isPlayer1Api"), 
                isPlayer2Api: localStorage.getItem("isPlayer2Api"),
                gameId: localStorage.getItem("gameId"),
            }));
        }
    };

    startGameButton.addEventListener("click", () => {
        let player1Name = document.getElementById("player1Name").value.trim() || "Player1";
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

function createGame(inviteCodeElement, startGameButton, socket) {
    localStorage.setItem("isPlayer1Api", "true");
    localStorage.setItem("isPlayer2Api", "false");
    if (!inviteCodeElement) return;

    const invCode = generateRandomCode();
    console.log("Generated Invite Code:", invCode);
    inviteCodeElement.innerText = invCode;
    localStorage.setItem("inviteCode", invCode);

    if (startGameButton) {
        startGameButton.disabled = true;
        startGameButton.style.backgroundColor = "#555";
        startGameButton.style.cursor = "not-allowed";
    }

    fetch("http://localhost:3000/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitation_code: invCode, username: null })
    })
    .then(response => response.json())
    .then(data => {
        const gameId = data._id;
        localStorage.setItem("gameId", gameId);
        socket.send(JSON.stringify({ type: "connect", gameId: gameId, inviteCode: invCode, 
            isPlayer1Api: localStorage.getItem("isPlayer1Api"), isPlayer2Api: localStorage.getItem("isPlayer2Api") }));
    })
    .catch(error => console.error("Error creating game:", error));
}
