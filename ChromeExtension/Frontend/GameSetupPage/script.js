document.addEventListener("DOMContentLoaded", () => {
    // Game state
    const gameState = {
      difficulty: "Easy",
      problemCount: 3,
      timeLimit: 10,
      battleType: "Friendly",
    }
  
    // Difficulty buttons
    const easyBtn = document.getElementById("easy-btn")
    const mediumBtn = document.getElementById("medium-btn")
    const hardBtn = document.getElementById("hard-btn")
    const difficultyBtns = [easyBtn, mediumBtn, hardBtn]
  
    // Battle type buttons
    const friendlyBtn = document.getElementById("friendly-btn")
    const rankedBtn = document.getElementById("ranked-btn")
    const battleTypeBtns = [friendlyBtn, rankedBtn]
  
    // iOS Pickers
    const problemPicker = document.getElementById("problem-picker")
    const timePicker = document.getElementById("time-picker")
  
    // Start button
    const startBtn = document.getElementById("start-btn")
  
    // Initialize pickers
    initPicker(problemPicker, gameState.problemCount)
    initPicker(timePicker, gameState.timeLimit)
  
    // Difficulty button event listeners
    easyBtn.addEventListener("click", () => {
      setDifficulty("Easy")
    })
  
    mediumBtn.addEventListener("click", () => {
      setDifficulty("Medium")
    })
  
    hardBtn.addEventListener("click", () => {
      setDifficulty("Hard")
    })
  
    // Battle type button event listeners
    friendlyBtn.addEventListener("click", () => {
      setBattleType("Friendly")
    })
  
    rankedBtn.addEventListener("click", () => {
      setBattleType("Ranked")
    })
  
    // Start button event listener
    startBtn.addEventListener("click", () => {
      console.log("Game started with settings:", gameState)
      // Add your game start logic here
    })
  
    // Set difficulty function
    function setDifficulty(difficulty) {
      gameState.difficulty = difficulty
  
      // Update UI
      difficultyBtns.forEach((btn) => {
        btn.classList.remove("active")
      })
  
      if (difficulty === "Easy") {
        easyBtn.classList.add("active")
      } else if (difficulty === "Medium") {
        mediumBtn.classList.add("active")
      } else if (difficulty === "Hard") {
        hardBtn.classList.add("active")
      }
    }
  
    // Set battle type function
    function setBattleType(battleType) {
      gameState.battleType = battleType
  
      // Update UI
      battleTypeBtns.forEach((btn) => {
        btn.classList.remove("active")
      })
  
      if (battleType === "Friendly") {
        friendlyBtn.classList.add("active")
      } else if (battleType === "Ranked") {
        rankedBtn.classList.add("active")
      }
    }
  
    // Initialize iOS-style picker
    function initPicker(pickerElement, initialValue) {
      const pickerItems = pickerElement.querySelector(".picker-items")
      const items = Array.from(pickerItems.children)
      let isDragging = false
      let startY = 0
      let scrollTop = 0
      const itemHeight = 40
  
      // Set initial scroll position
      const initialIndex = items.findIndex((item) => Number.parseInt(item.dataset.value) === initialValue)
      if (initialIndex !== -1) {
        const initialScrollTop = initialIndex * itemHeight
        pickerElement.scrollTop = initialScrollTop
      }
  
      // Mouse/Touch down event
      pickerElement.addEventListener("mousedown", handleMouseDown)
      pickerElement.addEventListener("touchstart", handleMouseDown, { passive: false })
  
      // Mouse/Touch move event
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("touchmove", handleMouseMove, { passive: false })
  
      // Mouse/Touch up event
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchend", handleMouseUp)
      document.addEventListener("mouseleave", handleMouseUp)
  
      // Scroll event
      pickerElement.addEventListener("scroll", handleScroll)
  
      function handleMouseDown(e) {
        isDragging = true
        startY = e.clientY || (e.touches && e.touches[0].clientY) || 0
        scrollTop = pickerElement.scrollTop
        e.preventDefault()
      }
  
      function handleMouseMove(e) {
        if (isDragging) {
          const y = e.clientY || (e.touches && e.touches[0].clientY) || 0
          const delta = startY - y
          pickerElement.scrollTop = scrollTop + delta
          e.preventDefault()
        }
      }
  
      function handleMouseUp() {
        if (isDragging) {
          isDragging = false
  
          // Snap to the nearest option
          const newScrollTop = pickerElement.scrollTop
          const centerIndex = Math.round(newScrollTop / itemHeight)
          const boundedIndex = Math.max(0, Math.min(items.length - 1, centerIndex))
  
          // Smooth scroll to the selected option
          pickerElement.scrollTo({
            top: boundedIndex * itemHeight,
            behavior: "smooth",
          })
  
          // Update game state
          const selectedValue = Number.parseInt(items[boundedIndex].dataset.value)
          if (pickerElement.id === "problem-picker") {
            gameState.problemCount = selectedValue
          } else if (pickerElement.id === "time-picker") {
            gameState.timeLimit = selectedValue
          }
        }
      }
  
      function handleScroll() {
        if (!isDragging) {
          const newScrollTop = pickerElement.scrollTop
          const centerIndex = Math.round(newScrollTop / itemHeight)
          const boundedIndex = Math.max(0, Math.min(items.length - 1, centerIndex))
  
          // Update game state
          const selectedValue = Number.parseInt(items[boundedIndex].dataset.value)
          if (pickerElement.id === "problem-picker") {
            gameState.problemCount = selectedValue
          } else if (pickerElement.id === "time-picker") {
            gameState.timeLimit = selectedValue
          }
        }
      }
    }
  })
  
  