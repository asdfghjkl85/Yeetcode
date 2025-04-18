// Define the options for the pickers
const problemOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const timeOptions = [5, 10, 15, 20, 30, 60];

// Function to dynamically generate picker items
function generatePickerItems(pickerId, options, formatFn = (val) => val) {
  const pickerItemsContainer = document.querySelector(`#${pickerId} .picker-items`);
  pickerItemsContainer.innerHTML = ''; // Clear any existing items
  options.forEach(option => {
    const item = document.createElement('div');
    item.className = 'picker-item';
    item.setAttribute('data-value', option);
    item.textContent = formatFn(option);
    pickerItemsContainer.appendChild(item);
  });
}

// Function to update the centered value for a given picker element
function updateCenteredValue(pickerElement) {
  const rect = pickerElement.getBoundingClientRect();
  const centerY = rect.top + rect.height / 2;
  let closestDiff = Infinity;
  let centeredValue = null;

  pickerElement.querySelectorAll('.picker-item').forEach(item => {
    const itemRect = item.getBoundingClientRect();
    const itemCenterY = itemRect.top + itemRect.height / 2;
    const diff = Math.abs(centerY - itemCenterY);
    if (diff < closestDiff) {
      closestDiff = diff;
      centeredValue = item.getAttribute('data-value');
    }
  });

  if (centeredValue !== null) {
    pickerElement.setAttribute('data-value', centeredValue);
  }
}

// Attach a debounced scroll listener to update the centered value when scrolling stops
function attachScrollListener(pickerElement) {
  let scrollTimeout;
  pickerElement.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      updateCenteredValue(pickerElement);
    }, 100);
  });
}

// Wait for the DOM content to load
document.addEventListener('DOMContentLoaded', () => {
  const socket = new WebSocket("ws://localhost:3000/ws");

  localStorage.setItem("gameState", "set_up");
  // Initialize game settings
  let selectedDifficulty = "easy";
  let selectedBattleType = "friendly";
  let selectedProblems = 3;
  let selectedTime = 60;

  // Generate picker items
  generatePickerItems('problem-picker', problemOptions);
  generatePickerItems('time-picker', timeOptions, (val) => `${val} min`);

  // Attach scroll listeners and initialize the centered values
  document.querySelectorAll('.ios-picker').forEach(picker => {
    attachScrollListener(picker);
    updateCenteredValue(picker);
  });

  // Difficulty buttons
  const difficultyBtns = document.querySelectorAll('.difficulty-btn');
  difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      difficultyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDifficulty = btn.id.replace('-btn', '');
    });
  });

  // Battle type buttons
  const battleTypeBtns = document.querySelectorAll('.battle-type-btn');
  battleTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      battleTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedBattleType = btn.id.replace('-btn', '');
    });
  });

  // Start button
  const startBtn = document.getElementById("start-btn");
  if (startBtn) {
    startBtn.addEventListener("click", async function () {
      try {
        // Get game state from localStorage
        const gameState = localStorage.getItem('gameState');
        if(gameState != "set_up") {
          console.log("No game state found");
          return;
        }

        // Get selected options
        const difficulty = document.querySelector('.difficulty-btn.active').textContent.toLowerCase();
        const problemCount = document.getElementById('problem-picker').getAttribute('data-value');
        const timeLimit = document.getElementById('time-picker').getAttribute('data-value');
        const battleType = document.querySelector('.battle-type-btn.active').textContent.toLowerCase();

        // Store game settings in localStorage
        localStorage.setItem('gameDifficulty', difficulty);
        localStorage.setItem('problemCount', problemCount);
        localStorage.setItem('gameTime', timeLimit);
        localStorage.setItem('battleType', battleType);

        // Update game status and settings on the backend
        await fetch(`http://localhost:3000/api/games/${gameState.gameId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "in_progress",
            player_1: gameState.player1,
            settings: {
              difficulty,
              problemCount: parseInt(problemCount),
              timeLimit: parseInt(timeLimit),
              battleType
            }
          })
        });

        localStorage.setItem("gameState", "in_progress");
        // Navigate to game play screen
        
        socket.send(JSON.stringify({
          type: "GAME_STARTED",
        }));

        window.location.href = "game-play-screen.html";
      } catch (err) {
        console.error("Failed to start game:", err);
      }
    });
  }
});
