document.addEventListener('DOMContentLoaded', function() {
    // Get player names from localStorage
    const player1 = localStorage.getItem('player1') || 'Player 1';
    const player2 = localStorage.getItem('player2') || 'Player 2';

    // Update player names in the UI
    const player1Element = document.getElementById("game-over-player1");
    const player2Element = document.getElementById("game-over-player2");

    player1Element.innerText = player1;
    player2Element.innerText = player2;

    // Handle back button click
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            // Clear game-specific data from localStorage
            //localStorage.removeItem('gameState');
            
            // Navigate back to the main screen
            window.location.href = 'main-screen.html';
        });
    }
}); 