// Function to load a random LeetCode tip from the JSON file
function loadNoteText() {
    // Fetch the JSON file
    fetch('assets/data/notes.json')
        .then(response => response.json())
        .then(data => {
            // Get the array of LeetCode tips
            const tips = data.tips;

            // Select a random tip from the array
            const randomIndex = Math.floor(Math.random() * tips.length);
            const randomTip = tips[randomIndex];

            // Display the random tip in the note section
            document.getElementById('note-text').innerText = randomTip;
        })
        .catch(error => {
            console.error('Error loading note text:', error);
            document.getElementById('note-text').innerText = 'Failed to load LeetCode tips.';
        });
}

// Event listener for when the note section is toggled
document.getElementById('toggle-note-checkbox').addEventListener('change', function() {
    if (this.checked) {
        // Load and display a random LeetCode tip when the note section is expanded
        loadNoteText();
    }
});