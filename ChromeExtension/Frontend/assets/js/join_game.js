// Add event listener for the Join Game button
document.getElementById('join-game').addEventListener('click', function() {
    chrome.storage.local.get('gameId', function(result) {
        let gameId = result.gameId;
        console.log("Game ID:", gameId);

        async function fetchGameInfo() {
            try {
                const response = await fetch(`http://localhost:3000/api/games/${gameId}`);
                const gameData = await response.json();
                console.log('Game Information:', {
                    id: gameData._id,
                    status: gameData.status,
                    settings: gameData.settings,
                    problems: gameData.leetcodeProblems
                });
                return gameData;
            } catch (error) {
                console.error('Error fetching game information:', error);
                return null;
            }
        }

        // Start polling when button is clicked
        const pollInterval = setInterval(async () => {
            const gameData = await fetchGameInfo();
            if (gameData && gameData.leetcodeProblems && gameData.leetcodeProblems.length > 0) {
                clearInterval(pollInterval);
                chrome.storage.local.set({ gameState: gameData });
                window.location.href = 'game-play-screen2.html';
            }
        }, 3000);

        // Clean up interval when leaving the page
        window.addEventListener('beforeunload', () => {
            clearInterval(pollInterval);
        });
    });
});