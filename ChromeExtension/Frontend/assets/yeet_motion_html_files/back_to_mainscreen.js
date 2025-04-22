// JavaScript file to handle navigation back to main screen
// This avoids inline onclick handlers which may be restricted by Chrome Extension Content Security Policy

document.addEventListener('DOMContentLoaded', function() {
    // Get the back button element
    const backButton = document.querySelector('.back-to-main');
    
    // Add click event listener
    if (backButton) {
        backButton.addEventListener('click', function() {
            // Navigate back to main screen
            window.location.href = '../../main-screen.html';
        });
    }
}); 