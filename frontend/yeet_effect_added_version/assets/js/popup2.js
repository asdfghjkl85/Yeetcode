const ANIMATION_DIR = "yeet_motion_html_files";

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("back-to-main-create").addEventListener("click", function () {
        window.location.href = "main-screen.html"; //Navigate to animation file
    });
    document.getElementById("start-game").addEventListener("click", function () {
        window.location.href = `assets/${ANIMATION_DIR}/yeet_motion.html`;
    });
});