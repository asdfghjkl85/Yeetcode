// Function to save profile changes
async function saveProfileChanges() {
    const bio = document.getElementById('player-bio').textContent;
    const university = document.getElementById('university').textContent;
    
    try {
        //also save changes to mongodb
        localStorage.setItem('bio', bio);
        localStorage.setItem('university', university);
        alert('Profile updated successfully!');
    } catch (error) {
        console.error('Error saving profile:', error);
        alert('Error saving changes. Please try again.');
    }
}

// Handle back button click
document.getElementById('back-button').addEventListener('click', () => {
    window.location.href = "main-screen.html"; 
});

// Handle save button click
document.getElementById('save-profile').addEventListener('click', saveProfileChanges);

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load usernames from localStorage
    const yeetcodeUsername = localStorage.getItem('yeetcode_username');
    const leetcodeUsername = localStorage.getItem('leetcode_username');
    const currentElo = localStorage.getItem('elo');
    const currentTitle = localStorage.getItem('title');
    const currentBio = localStorage.getItem('bio');
    const currentUni = localStorage.getItem('university');

    console.log(`Current stuff: ${currentUni}, ${currentBio}`);
    
    // Update the UI with the usernames
    document.getElementById('yeetcode-username').textContent = yeetcodeUsername || 'Not set';
    document.getElementById('leetcode-username').textContent = leetcodeUsername || 'Not set';
    document.getElementById('elo-rating').textContent = currentElo;
    document.getElementById('player-title').textContent = currentTitle;
    document.getElementById('player-bio').textContent = currentBio;
    document.getElementById('university').textContent = currentUni;
});
