let currentProfileIndex = 0;
let decisions = [];
let profiles = [];
let officer = {};

// Load game data
async function loadGameData() {
  try {
    const [profilesResponse, officerResponse] = await Promise.all([
      fetch("profiles.json"),
      fetch("officer.json"),
    ]);

    const profilesData = await profilesResponse.json();
    const officerData = await officerResponse.json();

    profiles = profilesData.profiles;
    officer = officerData.officer;

    initializeGame();
  } catch (error) {
    console.error("Error loading game data:", error);
  }
}

function initializeGame() {
  // Set up officer profile
  document.getElementById("officer-avatar").src = officer.avatar;
  document.getElementById("officer-name").textContent = officer.name;
  document.getElementById("officer-description").textContent =
    officer.description;

  // Set up game instructions
  const rulesList = document.getElementById("rules-list");
  officer.game_instructions.rules.forEach((rule) => {
    const li = document.createElement("li");
    li.textContent = rule;
    rulesList.appendChild(li);
  });

  // Set up event listeners
  document.getElementById("start-game").addEventListener("click", startGame);
  document
    .getElementById("approve-btn")
    .addEventListener("click", () => makeDecision(true));
  document
    .getElementById("deny-btn")
    .addEventListener("click", () => makeDecision(false));
  document.getElementById("play-again").addEventListener("click", resetGame);
}

function startGame() {
  document.getElementById("intro-screen").classList.remove("active");
  document.getElementById("profile-screen").classList.add("active");
  showCurrentProfile();
}

function showCurrentProfile() {
  const profile = profiles[currentProfileIndex];
  const profileScreen = document.getElementById("profile-screen");

  // Update profile information
  document.getElementById("applicant-avatar").src = profile.avatar;
  document.getElementById("applicant-name").textContent = profile.name;
  document.getElementById("applicant-age").textContent = `Age: ${profile.age}`;
  document.getElementById(
    "applicant-nationality"
  ).textContent = `Nationality: ${profile.nationality}`;
  document.getElementById(
    "applicant-occupation"
  ).textContent = `Occupation: ${profile.occupation}`;

  // Update documents
  const documentsList = document.getElementById("documents-list");
  documentsList.innerHTML = "";

  Object.entries(profile.documents).forEach(([doc, valid]) => {
    const docItem = document.createElement("div");
    docItem.className = `document-item ${valid ? "valid" : "invalid"}`;
    docItem.innerHTML = `
            <span>${
              doc.charAt(0).toUpperCase() + doc.slice(1).replace("_", " ")
            }:</span>
            <span>${valid ? "✓ Valid" : "✗ Invalid"}</span>
        `;
    documentsList.appendChild(docItem);
  });
}

function makeDecision(approved) {
  const profile = profiles[currentProfileIndex];
  decisions.push({
    profile: profile,
    approved: approved,
    outcome: approved ? profile.outcomes.approved : profile.outcomes.denied,
  });

  currentProfileIndex++;

  if (currentProfileIndex < profiles.length) {
    showCurrentProfile();
  } else {
    showResults();
  }
}

function showResults() {
  document.getElementById("profile-screen").classList.remove("active");
  document.getElementById("results-screen").classList.add("active");

  const resultsContainer = document.getElementById("results-container");
  resultsContainer.innerHTML = "";

  decisions.forEach((decision) => {
    const resultItem = document.createElement("div");
    resultItem.className = "result-item";
    resultItem.innerHTML = `
            <img src="${decision.outcome.image}" alt="${decision.profile.name}">
            <div>
                <h3>${decision.profile.name}</h3>
                <p>${decision.outcome.description}</p>
            </div>
        `;
    resultsContainer.appendChild(resultItem);
  });
}

function resetGame() {
  currentProfileIndex = 0;
  decisions = [];
  document.getElementById("results-screen").classList.remove("active");
  document.getElementById("intro-screen").classList.add("active");
}

// Start the game when the page loads
document.addEventListener("DOMContentLoaded", loadGameData);
