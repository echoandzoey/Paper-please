let currentProfileIndex = 0;
let decisions = [];
let profiles = [];
let officer = {};
let isMusicPlaying = false;
let backgroundMusic;
let buttonSound;
let successSound;
let failureSound;

// Default data in case JSON loading fails
const defaultOfficer = {
  name: "Officer Smith",
  position: "Immigration Officer",
  department: "Border Control",
  location: "Arstotzka Border Checkpoint",
  avatar: "https://via.placeholder.com/150",
  description:
    "You are Officer Smith, a dedicated immigration officer at the Arstotzka Border Checkpoint. Your duty is to carefully examine each applicant's documents and make decisions that will affect their lives forever. Remember: Glory to Arstotzka!",
  game_instructions: {
    rules: [
      "All applicants must have a valid passport",
      "All applicants must have a valid work permit",
      "All applicants must have up-to-date vaccination records",
      "Make your decisions carefully - each choice has consequences",
    ],
  },
};

const defaultProfiles = [
  {
    id: 1,
    name: "Alexei Petrov",
    age: 32,
    nationality: "Arstotzka",
    occupation: "Factory Worker",
    avatar: "https://via.placeholder.com/150",
    documents: {
      passport: true,
      work_permit: true,
      vaccination: true,
    },
    outcomes: {
      approved: {
        description:
          "Alexei returned to his family and continued working at the factory. His children were able to attend school.",
        image: "https://via.placeholder.com/150",
      },
      denied: {
        description:
          "Without proper documentation, Alexei was separated from his family. His children had to work in the streets to survive.",
        image: "https://via.placeholder.com/150",
      },
    },
  },
  {
    id: 2,
    name: "Maria Gonzalez",
    age: 28,
    nationality: "Kolechia",
    occupation: "Teacher",
    avatar: "https://via.placeholder.com/150",
    documents: {
      passport: true,
      work_permit: false,
      vaccination: true,
    },
    outcomes: {
      approved: {
        description:
          "Maria found work at a local school. She helped educate many children in the community.",
        image: "https://via.placeholder.com/150",
      },
      denied: {
        description:
          "Without proper work authorization, Maria was forced into illegal work. She was later arrested.",
        image: "https://via.placeholder.com/150",
      },
    },
  },
  {
    id: 3,
    name: "Johan Schmidt",
    age: 45,
    nationality: "Impor",
    occupation: "Doctor",
    avatar: "https://via.placeholder.com/150",
    documents: {
      passport: true,
      work_permit: true,
      vaccination: false,
    },
    outcomes: {
      approved: {
        description:
          "Dr. Schmidt established a clinic and provided medical care to many in need.",
        image: "https://via.placeholder.com/150",
      },
      denied: {
        description:
          "Without proper vaccination records, Dr. Schmidt was quarantined. Many patients lost access to medical care.",
        image: "https://via.placeholder.com/150",
      },
    },
  },
  {
    id: 4,
    name: "Lena Volkova",
    age: 22,
    nationality: "Arstotzka",
    occupation: "Student",
    avatar: "https://via.placeholder.com/150",
    documents: {
      passport: false,
      work_permit: true,
      vaccination: true,
    },
    outcomes: {
      approved: {
        description:
          "Lena completed her studies and became a successful engineer.",
        image: "https://via.placeholder.com/150",
      },
      denied: {
        description:
          "Without proper identification, Lena was unable to continue her education. She had to work menial jobs.",
        image: "https://via.placeholder.com/150",
      },
    },
  },
  {
    id: 5,
    name: "Carlos Mendoza",
    age: 38,
    nationality: "Republia",
    occupation: "Businessman",
    avatar: "https://via.placeholder.com/150",
    documents: {
      passport: true,
      work_permit: true,
      vaccination: true,
    },
    outcomes: {
      approved: {
        description:
          "Carlos established a successful business, creating jobs for many in the community.",
        image: "https://via.placeholder.com/150",
      },
      denied: {
        description:
          "Without proper authorization, Carlos lost his business opportunity. His family fell into poverty.",
        image: "https://via.placeholder.com/150",
      },
    },
  },
];

// Initialize audio controls
function initializeAudio() {
  console.log("Initializing audio controls...");

  // Get all audio elements
  backgroundMusic = document.getElementById("background-music");
  buttonSound = document.getElementById("button-sound");
  successSound = document.getElementById("success-sound");
  failureSound = document.getElementById("failure-sound");

  const toggleMusicBtn = document.getElementById("toggle-music");

  // Play background music immediately after page loads, don't wait for game start
  playBackgroundMusic();

  // Initialize music icon state
  updateMusicIcon();

  // Add button sounds to all game buttons
  addButtonSounds();

  if (toggleMusicBtn) {
    toggleMusicBtn.addEventListener("click", function () {
      if (isMusicPlaying) {
        pauseBackgroundMusic();
      } else {
        playBackgroundMusic();
      }
      updateMusicIcon();

      // Play button click sound effect
      playButtonSound();
    });
  }

  // Check if music file exists and can be played
  backgroundMusic.addEventListener("canplaythrough", function () {
    console.log("Music file loaded and ready to play");
  });

  backgroundMusic.addEventListener("error", function () {
    console.error("Failed to load music file");
    const musicIcon = document.querySelector(".music-icon");
    if (musicIcon) {
      musicIcon.textContent = "🔇";
      musicIcon.style.color = "#999";
    }
  });
}

// Add click sound effects to all buttons
function addButtonSounds() {
  const allButtons = document.querySelectorAll(".btn");

  allButtons.forEach((button) => {
    button.addEventListener("click", playButtonSound);
  });
}

// Play button click sound effect
function playButtonSound() {
  if (buttonSound) {
    // Reset sound before playing to ensure continuous playback
    buttonSound.currentTime = 0;
    buttonSound.volume = 0.5; // Set volume to 50%
    buttonSound.play().catch((error) => {
      console.error("Failed to play button sound:", error);
    });
  }
}

// Play correct decision sound effect
function playSuccessSound() {
  if (successSound) {
    successSound.currentTime = 0;
    successSound.volume = 0.7; // Set volume to 70%
    successSound.play().catch((error) => {
      console.error("Failed to play success sound:", error);
    });
  }
}

// Play wrong decision sound effect
function playFailureSound() {
  if (failureSound) {
    failureSound.currentTime = 0;
    failureSound.volume = 0.7; // Set volume to 70%
    failureSound.play().catch((error) => {
      console.error("Failed to play failure sound:", error);
    });
  }
}

// Stop sound effects
function stopSoundEffects() {
  if (successSound) {
    successSound.pause();
    successSound.currentTime = 0;
  }
  if (failureSound) {
    failureSound.pause();
    failureSound.currentTime = 0;
  }
}

// Play background music
function playBackgroundMusic() {
  if (backgroundMusic) {
    backgroundMusic.volume = 0.3; // Set background music volume to 30%
    backgroundMusic
      .play()
      .then(() => {
        console.log("Background music started playing");
        isMusicPlaying = true;
        updateMusicIcon();
      })
      .catch((error) => {
        console.error("Failed to play music:", error);
        // May be due to autoplay restrictions before user interaction
        const musicIcon = document.querySelector(".music-icon");
        if (musicIcon) {
          musicIcon.textContent = "🔈";
          musicIcon.classList.add("muted");
        }

        // Add one-time click event to try playing music on first user interaction
        document.addEventListener(
          "click",
          function tryPlayMusic() {
            playBackgroundMusic();
            document.removeEventListener("click", tryPlayMusic);
          },
          { once: true }
        );
      });
  }
}

// Pause background music
function pauseBackgroundMusic() {
  if (backgroundMusic) {
    backgroundMusic.pause();
    console.log("Background music paused");
    isMusicPlaying = false;
  }
}

// Update music icon
function updateMusicIcon() {
  const musicIcon = document.querySelector(".music-icon");
  if (musicIcon) {
    // Check if music is actually playing
    const isActuallyPlaying = !backgroundMusic.paused;

    musicIcon.textContent = isActuallyPlaying ? "🔊" : "🔈";
    if (isActuallyPlaying) {
      musicIcon.classList.remove("muted");
      isMusicPlaying = true;
    } else {
      musicIcon.classList.add("muted");
      isMusicPlaying = false;
    }
  }
}

// Load game data
async function loadGameData() {
  try {
    // Try loading JSON files
    const profilesResponse = await fetch("profiles.json");
    const officerResponse = await fetch("officer.json");

    // If requests successful, parse JSON
    if (profilesResponse.ok && officerResponse.ok) {
      const profilesData = await profilesResponse.json();
      const officerData = await officerResponse.json();

      profiles = profilesData.profiles;
      officer = officerData.officer;

      console.log("JSON data loaded successfully");
    } else {
      // If JSON loading fails, use default data
      console.log("Unable to load JSON files, using default data");
      profiles = defaultProfiles;
      officer = defaultOfficer;
    }
  } catch (error) {
    // If error occurs, use default data
    console.error("Error loading game data:", error);
    profiles = defaultProfiles;
    officer = defaultOfficer;
  } finally {
    // Initialize game regardless of outcome
    initializeGame();
    // Initialize audio controls
    initializeAudio();
  }
}

function initializeGame() {
  console.log("Initializing game...");
  // Set officer profile
  const officerAvatar = document.getElementById("officer-avatar");
  const officerName = document.getElementById("officer-name");
  const officerDescription = document.getElementById("officer-description");

  if (officerAvatar) {
    officerAvatar.src = officer.avatar || "https://via.placeholder.com/300";
    // Add loading event to ensure image is displayed properly
    officerAvatar.onload = function () {
      console.log("Officer avatar loaded successfully");
      // Add a subtle animation when the image loads
      officerAvatar.style.opacity = 0;
      setTimeout(() => {
        officerAvatar.style.opacity = 1;
        officerAvatar.style.transition = "opacity 0.5s ease-in-out";
      }, 100);
    };
    // Add error handling
    officerAvatar.onerror = function () {
      console.error("Failed to load officer avatar, using default image");
      officerAvatar.src = "https://via.placeholder.com/300?text=Officer";
    };
  }
  if (officerName) officerName.textContent = officer.name || "Officer Smith";
  if (officerDescription)
    officerDescription.textContent =
      officer.description || "Immigration Officer";

  // Set game instructions
  const rulesList = document.getElementById("rules-list");
  if (rulesList) {
    rulesList.innerHTML = "";

    if (officer.game_instructions && officer.game_instructions.rules) {
      officer.game_instructions.rules.forEach((rule) => {
        const li = document.createElement("li");
        li.textContent = rule;
        rulesList.appendChild(li);
      });
    }
  }

  // Set event listeners
  const startGameBtn = document.getElementById("start-game");
  const personalBtn = document.getElementById("personal-btn");
  const loanBtn = document.getElementById("loan-btn");
  const nothingBtn = document.getElementById("nothing-btn");
  const playAgainBtn = document.getElementById("play-again");

  if (startGameBtn) {
    startGameBtn.addEventListener("click", function () {
      console.log("Start game button clicked");
      startGame();
    });
  }

  if (personalBtn) {
    personalBtn.addEventListener("click", function () {
      console.log("Personal financial guidance button clicked");
      makeDecision("personal");
    });
  }

  if (loanBtn) {
    loanBtn.addEventListener("click", function () {
      console.log("Long-term loan plan button clicked");
      makeDecision("loan");
    });
  }

  if (nothingBtn) {
    nothingBtn.addEventListener("click", function () {
      console.log("No action button clicked");
      makeDecision("nothing");
    });
  }

  if (playAgainBtn) {
    playAgainBtn.addEventListener("click", function () {
      console.log("Play again button clicked");
      resetGame();
    });
  }

  console.log("Game initialization complete");
}

function startGame() {
  console.log("Start game function called");
  const introScreen = document.getElementById("intro-screen");
  const profileScreen = document.getElementById("profile-screen");

  if (introScreen) introScreen.classList.remove("active");
  if (profileScreen) profileScreen.classList.add("active");

  // No need to play background music here as it's already playing on page load

  showCurrentProfile();
}

function showCurrentProfile() {
  console.log("Showing current profile, index:", currentProfileIndex);
  if (currentProfileIndex >= profiles.length) {
    console.error("Index out of range");
    return;
  }

  const profile = profiles[currentProfileIndex];

  // Update profile information
  const applicantAvatar = document.getElementById("applicant-avatar");
  const applicantName = document.getElementById("applicant-name");
  const applicantAge = document.getElementById("applicant-age");
  const applicantNationality = document.getElementById("applicant-nationality");
  const applicantOccupation = document.getElementById("applicant-occupation");

  if (applicantAvatar)
    applicantAvatar.src = profile.avatar || "https://via.placeholder.com/150";
  if (applicantName) applicantName.textContent = profile.name || "Unknown";
  if (applicantAge)
    applicantAge.textContent = `Age: ${profile.age || "Unknown"}`;
  if (applicantNationality)
    applicantNationality.textContent = `Nationality: ${
      profile.nationality || "Unknown"
    }`;
  if (applicantOccupation)
    applicantOccupation.textContent = `Occupation: ${
      profile.occupation || "Unknown"
    }`;

  // Update documents
  const documentsList = document.getElementById("documents-list");
  if (documentsList) {
    documentsList.innerHTML = "";

    if (profile.documents) {
      // Define the document categories and their display names
      const documentCategories = [
        { key: "income_level", name: "Income Level" },
        { key: "current_debt", name: "Current Debt" },
        { key: "assets_savings", name: "Assets & Savings" },
        { key: "credit_history", name: "Credit History" },
        { key: "loan_purpose", name: "Loan Purpose" },
      ];

      // Create a document section for each category
      documentCategories.forEach((category) => {
        if (profile.documents[category.key]) {
          const docItem = document.createElement("div");
          docItem.className = "document-item financial-document";

          docItem.innerHTML = `
            <div class="document-header">${category.name}:</div>
            <div class="document-content">${
              profile.documents[category.key]
            }</div>
          `;

          documentsList.appendChild(docItem);
        }
      });
    }
  }
}

function makeDecision(choice) {
  console.log("Making decision:", choice);
  const profile = profiles[currentProfileIndex];
  const isCorrect = choice === profile.correct_choice;

  // Play corresponding sound effect
  if (isCorrect) {
    playSuccessSound();
  } else {
    playFailureSound();
  }

  decisions.push({
    profile: profile,
    choice: choice,
    outcome: getOutcome(choice, profile),
  });

  // Show current choice result
  showImmediateResult(profile, choice);
}

// Add screen shake effect
function screenShake() {
  const gameContainer = document.getElementById("game-container");

  // Add shake CSS class
  gameContainer.classList.add("screen-shake");

  // Remove CSS class after shake ends
  setTimeout(() => {
    gameContainer.classList.remove("screen-shake");
  }, 500); // Shake lasts 500ms
}

function showImmediateResult(profile, choice) {
  const outcome = getOutcome(choice, profile);
  const choiceText = getChoiceText(choice);
  const isCorrect = choice === profile.correct_choice;

  // Add screen shake effect for wrong decisions
  if (!isCorrect) {
    screenShake();
  }

  // Create result display container
  const resultContainer = document.createElement("div");
  resultContainer.className = "immediate-result";
  resultContainer.innerHTML = `
    <div class="profile-container">
      <div class="profile-header">
        <img src="${profile.avatar}" alt="${profile.name}">
        <div class="profile-info">
          <h2>${profile.name}</h2>
          <p>Age: ${profile.age}</p>
          <p>Nationality: ${profile.nationality}</p>
          <p>Occupation: ${profile.occupation}</p>
        </div>
        <div class="decision-result-icon ${isCorrect ? "correct" : "wrong"}">
          ${isCorrect ? "✓" : "✗"}
        </div>
      </div>
      <div class="outcome-section ${isCorrect ? "correct" : "wrong"}">
        <h3>Your Choice: ${choiceText}</h3>
        <div class="outcome-description">
          <p>${outcome.description}</p>
        </div>
      </div>
      <div class="action-buttons">
        <button class="btn continue-btn">Continue</button>
      </div>
    </div>
  `;

  // Add to page
  const gameContainer = document.getElementById("game-container");
  gameContainer.appendChild(resultContainer);

  // Add continue button event
  const continueBtn = resultContainer.querySelector(".continue-btn");
  continueBtn.addEventListener("click", function () {
    stopSoundEffects(); // Stop result sound effects
    playButtonSound(); // Play button click sound
    resultContainer.remove();
    currentProfileIndex++;
    if (currentProfileIndex < profiles.length) {
      showCurrentProfile();
    } else {
      showResults();
    }
  });
}

function getOutcome(choice, profile) {
  // Get result directly from profile's outcomes
  if (profile.outcomes && profile.outcomes[choice]) {
    return profile.outcomes[choice];
  }

  // Return default if no matching result found
  return {
    description: "Nothing has found",
    image: profile.avatar || "https://via.placeholder.com/150",
  };
}

function showResults() {
  console.log("Showing results");
  const profileScreen = document.getElementById("profile-screen");
  const resultsScreen = document.getElementById("results-screen");

  if (profileScreen) profileScreen.classList.remove("active");
  if (resultsScreen) resultsScreen.classList.add("active");

  // Calculate accuracy statistics
  let correctCount = 0;
  const totalCount = decisions.length;

  decisions.forEach((decision) => {
    if (decision.choice === decision.profile.correct_choice) {
      correctCount++;
    }
  });

  const correctRate = Math.round((correctCount / totalCount) * 100);

  // Update results screen title
  const resultsTitle = document.querySelector("#results-screen h2");
  if (resultsTitle) {
    resultsTitle.innerHTML = `End of Shift Report <span class="accuracy-rate">(Accuracy: ${correctCount}/${totalCount} - ${correctRate}%)</span>`;
  }

  const resultsContainer = document.getElementById("results-container");
  if (resultsContainer) {
    // Clear container content
    resultsContainer.innerHTML = "";

    // Add overall assessment
    const assessmentElement = document.createElement("div");
    assessmentElement.className = "accuracy-assessment";

    let assessmentMessage = "";
    if (correctRate >= 80) {
      assessmentMessage =
        "Excellent financial officer! Your decisions provided appropriate assistance to most applicants.";
    } else if (correctRate >= 60) {
      assessmentMessage =
        "Qualified financial officer. Most of your decisions were reasonable, but there's room for improvement.";
    } else if (correctRate >= 40) {
      assessmentMessage =
        "Passable financial officer. You need to evaluate applicants' needs more carefully.";
    } else {
      assessmentMessage =
        "Unqualified financial officer. Most of your decisions failed to meet applicants' real needs.";
    }

    assessmentElement.innerHTML = `
      <div class="assessment-header">
        <h3>Overall Assessment</h3>
        <div class="accuracy-badge ${getAccuracyClass(
          correctRate
        )}">${correctRate}%</div>
      </div>
      <p>${assessmentMessage}</p>
    `;

    resultsContainer.appendChild(assessmentElement);

    // Add decision details title
    const decisionsHeader = document.createElement("h3");
    decisionsHeader.className = "decisions-header";
    decisionsHeader.textContent = "Individual Decision Details";
    resultsContainer.appendChild(decisionsHeader);

    decisions.forEach((decision) => {
      const resultItem = document.createElement("div");
      resultItem.className = "result-item";

      // Show result based on choice
      const outcome = decision.outcome;
      const choiceText = getChoiceText(decision.choice);
      const isCorrect = decision.choice === decision.profile.correct_choice;
      const correctChoiceText = getChoiceText(decision.profile.correct_choice);

      resultItem.innerHTML = `
        <div class="result-header">
          <img src="${outcome.image}" alt="${decision.profile.name}">
          <div class="result-title">
            <h3>${decision.profile.name}</h3>
            <p class="choice-made">Your Choice: 
              <span class="${
                isCorrect ? "correct-choice" : "wrong-choice"
              }">${choiceText}</span>
              ${
                !isCorrect
                  ? `<span class="correct-choice-note">(Correct choice should be: ${correctChoiceText})</span>`
                  : ""
              }
            </p>
          </div>
          <div class="decision-badge ${isCorrect ? "correct" : "wrong"}">
            ${isCorrect ? "✓" : "✗"}
          </div>
        </div>
        <div class="result-description">
          <p>${outcome.description}</p>
        </div>
      `;
      resultsContainer.appendChild(resultItem);
    });
  }
}

// Return CSS class based on accuracy rate
function getAccuracyClass(rate) {
  if (rate >= 80) return "excellent";
  if (rate >= 60) return "good";
  if (rate >= 40) return "fair";
  return "poor";
}

function getChoiceText(choice) {
  switch (choice) {
    case "personal":
      return "Personal Financial Guidance";
    case "loan":
      return "Long-term Loan Plan";
    case "nothing":
      return "No Action";
    default:
      return "Unknown Choice";
  }
}

function resetGame() {
  console.log("Resetting game");
  currentProfileIndex = 0;
  decisions = [];

  const resultsScreen = document.getElementById("results-screen");
  const introScreen = document.getElementById("intro-screen");

  if (resultsScreen) resultsScreen.classList.remove("active");
  if (introScreen) introScreen.classList.add("active");

  // Restart background music
  if (backgroundMusic) {
    // If music was paused, play again
    if (!isMusicPlaying) {
      playBackgroundMusic();
    } else {
      // If music is playing, restart from beginning
      backgroundMusic.currentTime = 0;
    }
  }

  // Play button sound effect
  playButtonSound();
}

// Start game when page loads
document.addEventListener("DOMContentLoaded", function () {
  console.log("Page loaded, loading game data...");
  loadGameData();
});

// Update CSS styles
const style = document.createElement("style");
style.textContent = `
.immediate-result {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.immediate-result .profile-container {
  background-color: #2a2a2a;
  padding: 2rem;
  border-radius: 10px;
  max-width: 800px;
  width: 90%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.immediate-result .profile-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  position: relative;
}

.immediate-result .profile-header img {
  width: 150px;
  height: 150px;
  border-radius: 8px;
  object-fit: cover;
  border: 3px solid #4a4a4a;
}

.immediate-result .profile-info {
  flex: 1;
}

/* Decision result icon */
.decision-result-icon {
  position: absolute;
  top: -15px;
  right: -15px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pop-in {
  0% { transform: scale(0); opacity: 0; }
  80% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

.decision-result-icon.correct {
  background-color: #27ae60;
  color: white;
}

.decision-result-icon.wrong {
  background-color: #c0392b;
  color: white;
}

.immediate-result .outcome-section {
  background-color: #3a3a3a;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 5px solid #4a4a4a;
}

.immediate-result .outcome-section.correct {
  border-left-color: #27ae60;
}

.immediate-result .outcome-section.wrong {
  border-left-color: #c0392b;
}

.immediate-result .outcome-section h3 {
  color: #2196f3;
  margin-bottom: 1rem;
}

.immediate-result .outcome-description {
  line-height: 1.6;
  color: #e0e0e0;
}

.immediate-result .action-buttons {
  display: flex;
  justify-content: center;
}

.immediate-result .continue-btn {
  background-color: #2196f3;
  color: white;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.immediate-result .continue-btn:hover {
  background-color: #1976d2;
  transform: translateY(-2px);
}

/* Accuracy rate statistics styles */
.accuracy-rate {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-left: 1rem;
  background-color: #333;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
}

.accuracy-assessment {
  background-color: #2c3e50;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-left: 5px solid #3498db;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

.assessment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.assessment-header h3 {
  margin: 0;
  color: #ecf0f1;
}

.accuracy-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  font-size: 1.2rem;
}

.accuracy-badge.excellent {
  background-color: #27ae60;
  color: white;
}

.accuracy-badge.good {
  background-color: #2980b9;
  color: white;
}

.accuracy-badge.fair {
  background-color: #f39c12;
  color: white;
}

.accuracy-badge.poor {
  background-color: #c0392b;
  color: white;
}

.decisions-header {
  margin: 1.5rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #3a3a3a;
  color: #ecf0f1;
}

.result-item {
  background-color: #3a3a3a;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.result-header {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
}

.result-header img {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  border: 3px solid #4a4a4a;
}

.result-title {
  flex: 1;
}

.result-title h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #f5f5f5;
}

.choice-made {
  color: #bdc3c7;
  margin-bottom: 0.5rem;
}

.correct-choice {
  color: #2ecc71;
  font-weight: bold;
}

.wrong-choice {
  color: #e74c3c;
  font-weight: bold;
}

.correct-choice-note {
  font-size: 0.85rem;
  color: #3498db;
  display: block;
  margin-top: 0.3rem;
}

.decision-badge {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.decision-badge.correct {
  background-color: #27ae60;
  color: white;
}

.decision-badge.wrong {
  background-color: #c0392b;
  color: white;
}

.result-description {
  background-color: #4a4a4a;
  padding: 1rem;
  border-radius: 6px;
  line-height: 1.6;
}

.result-description p {
  margin: 0;
  color: #e0e0e0;
}

/* Financial document styles */
.financial-document {
  margin-bottom: 12px;
  background-color: #3a3a3a;
  border-radius: 6px;
  padding: 10px 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.document-header {
  font-weight: bold;
  color: #64b5f6;
  margin-bottom: 4px;
  font-size: 1rem;
}

.document-content {
  color: #e0e0e0;
  line-height: 1.4;
  font-size: 0.95rem;
}

.documents {
  background-color: #3a3a3a;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  max-height: 400px;
  overflow-y: auto;
}

.documents h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #f5f5f5;
  border-bottom: 1px solid #4a4a4a;
  padding-bottom: 0.5rem;
}

/* Audio controls styles */
#audio-controls {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1100;
}

.audio-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(42, 42, 42, 0.7);
  border: 2px solid #4a4a4a;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.audio-btn:hover {
  background-color: rgba(55, 55, 55, 0.9);
  transform: scale(1.1);
}

.music-icon {
  font-size: 20px;
  color: #fff;
}

.music-icon.muted {
  color: #aaa;
}

/* 添加点击按钮时的视觉反馈 */
.btn {
  position: relative;
  overflow: hidden;
}

.btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%, -50%);
  transform-origin: 50% 50%;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0) translate(-50%, -50%);
    opacity: 0.5;
  }
  100% {
    transform: scale(40, 40) translate(-50%, -50%);
    opacity: 0;
  }
}

.btn:active::after {
  animation: ripple 600ms linear;
}

/* 屏幕抖动效果 */
@keyframes shake {
  0% { transform: translate(0, 0) rotate(0deg); }
  10% { transform: translate(-5px, -5px) rotate(-1deg); }
  20% { transform: translate(5px, -5px) rotate(1deg); }
  30% { transform: translate(-5px, 5px) rotate(0deg); }
  40% { transform: translate(5px, 5px) rotate(1deg); }
  50% { transform: translate(-5px, -5px) rotate(-1deg); }
  60% { transform: translate(5px, -5px) rotate(0deg); }
  70% { transform: translate(-5px, 5px) rotate(-1deg); }
  80% { transform: translate(-5px, -5px) rotate(1deg); }
  90% { transform: translate(5px, -5px) rotate(0deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

.screen-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  transform-origin: center center;
}

/* 错误效果增强 */
.immediate-result .wrong {
  position: relative;
}

.immediate-result .wrong::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(192, 57, 43, 0.1);
  pointer-events: none;
  animation: pulse-red 1s ease-out;
}

@keyframes pulse-red {
  0% { background-color: rgba(192, 57, 43, 0.4); }
  100% { background-color: rgba(192, 57, 43, 0); }
}
`;
document.head.appendChild(style);
