document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("create-team").addEventListener("click", function () {
        window.location.href = "create-team-screen.html"; // Navigate to Create Team page
    });

    document.getElementById("join-team").addEventListener("click", function () {
        window.location.href = "join-team-screen.html"; // Navigate to Join Team page
    });

    // Back button functionality
    let backButton = document.getElementById("back-to-main");
    if (backButton) {
        backButton.addEventListener("click", function () {
            window.location.href = "main-screen.html"; // Navigate back to main screen
        });
    }
});