let currentProfileIndex = 0;
let decisions = [];
let profiles = [];
let officer = {};

// 默认数据，以防JSON加载失败
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

// Load game data
async function loadGameData() {
  try {
    // 尝试加载JSON文件
    const profilesResponse = await fetch("profiles.json");
    const officerResponse = await fetch("officer.json");

    // 如果请求成功，解析JSON
    if (profilesResponse.ok && officerResponse.ok) {
      const profilesData = await profilesResponse.json();
      const officerData = await officerResponse.json();

      profiles = profilesData.profiles;
      officer = officerData.officer;

      console.log("JSON数据加载成功");
    } else {
      // 如果JSON加载失败，使用默认数据
      console.log("无法加载JSON文件，使用默认数据");
      profiles = defaultProfiles;
      officer = defaultOfficer;
    }
  } catch (error) {
    // 如果出现错误，使用默认数据
    console.error("Error loading game data:", error);
    profiles = defaultProfiles;
    officer = defaultOfficer;
  } finally {
    // 无论成功与否，都初始化游戏
    initializeGame();
  }
}

function initializeGame() {
  console.log("初始化游戏...");
  // 设置官员资料
  const officerAvatar = document.getElementById("officer-avatar");
  const officerName = document.getElementById("officer-name");
  const officerDescription = document.getElementById("officer-description");

  if (officerAvatar) {
    officerAvatar.src = officer.avatar || "https://via.placeholder.com/300";
    // Add loading event to ensure image is displayed properly
    officerAvatar.onload = function () {
      console.log("官员头像加载完成");
      // Add a subtle animation when the image loads
      officerAvatar.style.opacity = 0;
      setTimeout(() => {
        officerAvatar.style.opacity = 1;
        officerAvatar.style.transition = "opacity 0.5s ease-in-out";
      }, 100);
    };
    // Add error handling
    officerAvatar.onerror = function () {
      console.error("官员头像加载失败，使用默认图片");
      officerAvatar.src = "https://via.placeholder.com/300?text=Officer";
    };
  }
  if (officerName) officerName.textContent = officer.name || "Officer Smith";
  if (officerDescription)
    officerDescription.textContent =
      officer.description || "Immigration Officer";

  // 设置游戏指南
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

  // 设置事件监听器
  const startGameBtn = document.getElementById("start-game");
  const personalBtn = document.getElementById("personal-btn");
  const loanBtn = document.getElementById("loan-btn");
  const nothingBtn = document.getElementById("nothing-btn");
  const playAgainBtn = document.getElementById("play-again");

  if (startGameBtn) {
    startGameBtn.addEventListener("click", function () {
      console.log("开始游戏按钮点击");
      startGame();
    });
  }

  if (personalBtn) {
    personalBtn.addEventListener("click", function () {
      console.log("个人财务指导按钮点击");
      makeDecision("personal");
    });
  }

  if (loanBtn) {
    loanBtn.addEventListener("click", function () {
      console.log("长期贷款计划按钮点击");
      makeDecision("loan");
    });
  }

  if (nothingBtn) {
    nothingBtn.addEventListener("click", function () {
      console.log("无操作按钮点击");
      makeDecision("nothing");
    });
  }

  if (playAgainBtn) {
    playAgainBtn.addEventListener("click", function () {
      console.log("再玩一次按钮点击");
      resetGame();
    });
  }

  console.log("游戏初始化完成");
}

function startGame() {
  console.log("开始游戏函数已调用");
  const introScreen = document.getElementById("intro-screen");
  const profileScreen = document.getElementById("profile-screen");

  if (introScreen) introScreen.classList.remove("active");
  if (profileScreen) profileScreen.classList.add("active");

  showCurrentProfile();
}

function showCurrentProfile() {
  console.log("显示当前档案，索引:", currentProfileIndex);
  if (currentProfileIndex >= profiles.length) {
    console.error("索引超出范围");
    return;
  }

  const profile = profiles[currentProfileIndex];

  // 更新档案信息
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

  // 更新文件
  const documentsList = document.getElementById("documents-list");
  if (documentsList) {
    documentsList.innerHTML = "";

    if (profile.documents) {
      Object.entries(profile.documents).forEach(([doc, valid]) => {
        const docItem = document.createElement("div");
        docItem.className = `document-item ${valid ? "valid" : "invalid"}`;
        docItem.innerHTML = `
                    <span>${
                      doc.charAt(0).toUpperCase() +
                      doc.slice(1).replace("_", " ")
                    }:</span>
                    <span>${valid ? "✓ Valid" : "✗ Invalid"}</span>
                `;
        documentsList.appendChild(docItem);
      });
    }
  }
}

function makeDecision(choice) {
  console.log("做出决定:", choice);
  const profile = profiles[currentProfileIndex];

  decisions.push({
    profile: profile,
    choice: choice,
    outcome: getOutcome(choice, profile),
  });

  // 显示当前选择的结果
  showImmediateResult(profile, choice);
}

function showImmediateResult(profile, choice) {
  const outcome = getOutcome(choice, profile);
  const choiceText = getChoiceText(choice);

  // 创建结果展示容器
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
      </div>
      <div class="outcome-section">
        <h3>你的选择: ${choiceText}</h3>
        <div class="outcome-description">
          <p>${outcome.description}</p>
        </div>
      </div>
      <div class="action-buttons">
        <button class="btn continue-btn">继续</button>
      </div>
    </div>
  `;

  // 添加到页面
  const gameContainer = document.getElementById("game-container");
  gameContainer.appendChild(resultContainer);

  // 添加继续按钮事件
  const continueBtn = resultContainer.querySelector(".continue-btn");
  continueBtn.addEventListener("click", function () {
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
  // 直接从profile的outcomes中获取对应选择的结果
  if (profile.outcomes && profile.outcomes[choice]) {
    return profile.outcomes[choice];
  }

  // 如果找不到对应的结果，返回默认值
  return {
    description: "Nothing has found",
    image: profile.avatar || "https://via.placeholder.com/150",
  };
}

function showResults() {
  console.log("显示结果");
  const profileScreen = document.getElementById("profile-screen");
  const resultsScreen = document.getElementById("results-screen");

  if (profileScreen) profileScreen.classList.remove("active");
  if (resultsScreen) resultsScreen.classList.add("active");

  const resultsContainer = document.getElementById("results-container");
  if (resultsContainer) {
    resultsContainer.innerHTML = "";

    decisions.forEach((decision) => {
      const resultItem = document.createElement("div");
      resultItem.className = "result-item";

      // 根据选择显示对应的结果
      const outcome = decision.outcome;
      const choiceText = getChoiceText(decision.choice);

      resultItem.innerHTML = `
        <div class="result-header">
          <img src="${outcome.image}" alt="${decision.profile.name}">
          <div class="result-title">
            <h3>${decision.profile.name}</h3>
            <p class="choice-made">选择: ${choiceText}</p>
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
  console.log("重置游戏");
  currentProfileIndex = 0;
  decisions = [];

  const resultsScreen = document.getElementById("results-screen");
  const introScreen = document.getElementById("intro-screen");

  if (resultsScreen) resultsScreen.classList.remove("active");
  if (introScreen) introScreen.classList.add("active");
}

// 页面加载时启动游戏
document.addEventListener("DOMContentLoaded", function () {
  console.log("页面已加载，正在加载游戏数据...");
  loadGameData();
});

// 更新 CSS 样式
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

.immediate-result .outcome-section {
  background-color: #3a3a3a;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
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
`;
document.head.appendChild(style);
