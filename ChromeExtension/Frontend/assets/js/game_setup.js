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
    startBtn.addEventListener("click", () => {
      // Get current values from pickers
      const problemPicker = document.getElementById("problem-picker");
      const timePicker = document.getElementById("time-picker");
      
      selectedProblems = parseInt(problemPicker.getAttribute('data-value')) || 3;
      selectedTime = parseInt(timePicker.getAttribute('data-value')) || 60;

      // Save game settings to localStorage
      localStorage.setItem("gameDifficulty", selectedDifficulty);
      localStorage.setItem("gameBattleType", selectedBattleType);
      localStorage.setItem("gameProblems", selectedProblems);
      localStorage.setItem("gameTime", selectedTime);
      
      // Navigate to game play screen
      window.location.href = "game-play-screen.html";
    });
  }
});
  